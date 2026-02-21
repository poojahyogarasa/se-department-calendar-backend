const db = require('../config/db'); // adjust path if different
const { successResponse, errorResponse } = require('../utils/responseHandler');

exports.createEvent = (req, res) => {
  const {
    title,
    description,
    event_type,
    start_datetime,
    end_datetime,
    location
  } = req.body;

  // 🔹 Basic validation
  if (!title || !start_datetime || !end_datetime) {
    return errorResponse(res, 'Required fields missing');
  }

  if (new Date(start_datetime) >= new Date(end_datetime)) {
    return errorResponse(res, 'Start time must be before end time');
  }

  const query = `
    INSERT INTO events 
    (title, description, event_type, start_datetime, end_datetime, location, status, created_by, created_at)
    VALUES (?, ?, ?, ?, ?, ?, 'PENDING', ?, NOW())
  `;

  db.query(
    query,
    [
      title,
      description,
      event_type,
      start_datetime,
      end_datetime,
      location,
      req.user.id
    ],
    (err, result) => {
      if (err) {
        console.error(err);
        return errorResponse(res, 'Database error');
      }

      return successResponse(res, 'Event created successfully (Pending approval)', {
        eventId: result.insertId
      });
    }
  );
};