const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { EVENT_STATUS } = require('../utils/constants');


// =====================================
// 🔹 Get Pending Events
// =====================================
exports.getPendingEvents = (req, res) => {

  const query = `
    SELECT 
      e.event_id,
      e.title,
      e.description,
      e.start_datetime,
      e.end_datetime,
      e.location,
      u.first_name,
      u.last_name
    FROM events e
    JOIN users u ON e.created_by = u.id
    WHERE e.status = ?
    ORDER BY e.created_at DESC
  `;

  db.query(query, [EVENT_STATUS.PENDING], (err, results) => {
    if (err) return errorResponse(res, 'Database error');
    return successResponse(res, 'Pending events fetched', results);
  });
};


// =====================================
// 🔹 Approve Event (With Notification)
// =====================================
exports.approveEvent = (req, res) => {
  const eventId = req.params.eventId;

  db.beginTransaction((err) => {
    if (err) return errorResponse(res, 'Transaction start failed');

    // 1️⃣ Get event creator
    db.query(
      'SELECT created_by FROM events WHERE event_id = ?',
      [eventId],
      (err, result) => {
        if (err || result.length === 0) {
          return db.rollback(() =>
            errorResponse(res, 'Event not found')
          );
        }

        const lecturerId = result[0].created_by;

        // 2️⃣ Update event status
        db.query(
          'UPDATE events SET status = ? WHERE event_id = ?',
          [EVENT_STATUS.APPROVED, eventId],
          (err) => {
            if (err) {
              return db.rollback(() =>
                errorResponse(res, 'Failed to update event')
              );
            }

            // 3️⃣ Update approval_status
            db.query(
              'UPDATE approval_status SET status = ? WHERE event_id = ?',
              [EVENT_STATUS.APPROVED, eventId],
              (err) => {
                if (err) {
                  return db.rollback(() =>
                    errorResponse(res, 'Failed to update approval')
                  );
                }

                // 4️⃣ Insert notification for lecturer
                db.query(
                  `INSERT INTO notifications
                   (event_id, user_id, message, notification_type, sent_at)
                   VALUES (?, ?, ?, ?, NOW())`,
                  [
                    eventId,
                    lecturerId,
                    'Your event has been approved',
                    'APPROVED'
                  ],
                  (err) => {
                    if (err) {
                      return db.rollback(() =>
                        errorResponse(res, 'Failed to insert notification')
                      );
                    }

                    // 5️⃣ Commit
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() =>
                          errorResponse(res, 'Commit failed')
                        );
                      }

                      return successResponse(res, 'Event approved successfully');
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};


// =====================================
// 🔹 Reject Event (With Notification)
// =====================================
exports.rejectEvent = (req, res) => {
  const eventId = req.params.eventId;
  const { reason } = req.body;

  db.beginTransaction((err) => {
    if (err) return errorResponse(res, 'Transaction start failed');

    // 1️⃣ Get event creator
    db.query(
      'SELECT created_by FROM events WHERE event_id = ?',
      [eventId],
      (err, result) => {
        if (err || result.length === 0) {
          return db.rollback(() =>
            errorResponse(res, 'Event not found')
          );
        }

        const lecturerId = result[0].created_by;

        // 2️⃣ Update event status
        db.query(
          'UPDATE events SET status = ? WHERE event_id = ?',
          [EVENT_STATUS.REJECTED, eventId],
          (err) => {
            if (err) {
              return db.rollback(() =>
                errorResponse(res, 'Failed to update event')
              );
            }

            // 3️⃣ Update approval_status
            db.query(
              'UPDATE approval_status SET status = ?, reason = ? WHERE event_id = ?',
              [EVENT_STATUS.REJECTED, reason || null, eventId],
              (err) => {
                if (err) {
                  return db.rollback(() =>
                    errorResponse(res, 'Failed to update approval')
                  );
                }

                // 4️⃣ Insert notification for lecturer
                db.query(
                  `INSERT INTO notifications
                   (event_id, user_id, message, notification_type, sent_at)
                   VALUES (?, ?, ?, ?, NOW())`,
                  [
                    eventId,
                    lecturerId,
                    reason
                      ? `Your event was rejected: ${reason}`
                      : 'Your event was rejected',
                    'REJECTED'
                  ],
                  (err) => {
                    if (err) {
                      return db.rollback(() =>
                        errorResponse(res, 'Failed to insert notification')
                      );
                    }

                    // 5️⃣ Commit
                    db.commit((err) => {
                      if (err) {
                        return db.rollback(() =>
                          errorResponse(res, 'Commit failed')
                        );
                      }

                      return successResponse(res, 'Event rejected successfully');
                    });
                  }
                );
              }
            );
          }
        );
      }
    );
  });
};


// =====================================
// 🔔 Get Notifications (NEW STRUCTURE)
// =====================================
exports.getNotifications = (req, res) => {
  const userId = req.user.id;

  const query = `
    SELECT *
    FROM notifications
    WHERE user_id = ?
    ORDER BY sent_at DESC
  `;

  db.query(query, [userId], (err, results) => {
    if (err) return errorResponse(res, 'Database error');

    return successResponse(res, 'Notifications fetched successfully', results);
  });
};