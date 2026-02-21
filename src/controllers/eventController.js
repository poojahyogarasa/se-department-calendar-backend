const db = require("../config/db");

// =====================================
// 🔹 CREATE EVENT (With Notification)
// =====================================
exports.createEvent = async (req, res) => {
  const {
    title,
    description,
    event_type,
    start_datetime,
    end_datetime,
    location
  } = req.body;

  const created_by = req.user.id;
  const userRole = req.user.role;

  db.beginTransaction(async (err) => {
    if (err) return res.status(500).json({ error: err.message });

    try {

      // 1️⃣ TIME VALIDATION
      if (new Date(end_datetime) <= new Date(start_datetime)) {
        throw new Error("End time must be after start time");
      }

      // 2️⃣ LOCATION CONFLICT CHECK
      const locationConflict = await new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM events
           WHERE location = ?
           AND (start_datetime < ? AND end_datetime > ?)`,
          [location, end_datetime, start_datetime],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      if (locationConflict.length > 0) {
        throw new Error("Time slot already booked for this location");
      }

      // 3️⃣ LECTURER DOUBLE BOOKING CHECK
      const lecturerConflict = await new Promise((resolve, reject) => {
        db.query(
          `SELECT * FROM events
           WHERE created_by = ?
           AND (start_datetime < ? AND end_datetime > ?)`,
          [created_by, end_datetime, start_datetime],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      if (lecturerConflict.length > 0) {
        throw new Error("You already have another event at this time");
      }

      // 4️⃣ INSERT EVENT
      const insertResult = await new Promise((resolve, reject) => {
        db.query(
          `INSERT INTO events
          (title, description, event_type, start_datetime, end_datetime, location, status, created_by)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            title,
            description,
            event_type,
            start_datetime,
            end_datetime,
            location,
            userRole === "ADMIN" ? "APPROVED" : "PENDING",
            created_by
          ],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      const eventId = insertResult.insertId;

      // 5️⃣ CREATE NOTIFICATION FOR HOD (if not ADMIN)
      if (userRole !== "ADMIN") {

        const hodResult = await new Promise((resolve, reject) => {
          db.query(
            `SELECT id FROM users WHERE role = 'HOD' LIMIT 1`,
            (err, result) => {
              if (err) reject(err);
              else resolve(result);
            }
          );
        });

        if (hodResult.length > 0) {
          const hodId = hodResult[0].id;

          await new Promise((resolve, reject) => {
            db.query(
              `INSERT INTO notifications
               (event_id, user_id, message, notification_type, sent_at)
               VALUES (?, ?, ?, ?, NOW())`,
              [
                eventId,
                hodId,
                "New event pending approval",
                "APPROVAL_REQUEST"
              ],
              (err) => {
                if (err) reject(err);
                else resolve();
              }
            );
          });
        }
      }

      db.commit(err => {
        if (err) {
          return db.rollback(() => {
            res.status(500).json({ error: err.message });
          });
        }

        res.status(201).json({
          message: "Event created successfully"
        });
      });

    } catch (error) {
      db.rollback(() => {
        res.status(400).json({ error: error.message });
      });
    }
  });
};

// =====================================
// 🔹 GET EVENTS (Role-Based + Date Filter)
// =====================================
exports.getEvents = (req, res) => {

  const { start, end } = req.query;
  const role = req.user.role;
  const userId = req.user.id;

  let query = `SELECT * FROM events WHERE 1=1`;
  let values = [];

  if (start && end) {
    query += ` AND start_datetime >= ? AND end_datetime <= ?`;
    values.push(start, end);
  }

  if (role === "STUDENT") {
    query += ` AND status = 'APPROVED'`;
  }

  if (role === "LECTURER") {
    query += `
      AND (
        status = 'APPROVED'
        OR created_by = ?
      )
    `;
    values.push(userId);
  }

  query += ` ORDER BY start_datetime ASC`;

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

// =====================================
// 🔹 GET SINGLE EVENT
// =====================================
exports.getEventById = (req, res) => {

  const eventId = req.params.id;

  db.query(
    `SELECT * FROM events WHERE event_id = ?`,
    [eventId],
    (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      res.json(result[0]);
    }
  );
};

// =====================================
// 🔹 UPDATE EVENT
// =====================================
exports.updateEvent = async (req, res) => {

  const eventId = req.params.id;
  const role = req.user.role;
  const userId = req.user.id;

  const {
    title,
    description,
    event_type,
    start_datetime,
    end_datetime,
    location
  } = req.body;

  try {

    const eventResult = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM events WHERE event_id = ?`,
        [eventId],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (eventResult.length === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = eventResult[0];

    if (role === "LECTURER" && event.created_by !== userId) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (new Date(end_datetime) <= new Date(start_datetime)) {
      return res.status(400).json({ error: "End time must be after start time" });
    }

    const conflict = await new Promise((resolve, reject) => {
      db.query(
        `SELECT * FROM events
         WHERE event_id != ?
         AND location = ?
         AND (start_datetime < ? AND end_datetime > ?)`,
        [eventId, location, end_datetime, start_datetime],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (conflict.length > 0) {
      return res.status(400).json({
        error: "Time slot already booked for this location"
      });
    }

    let newStatus = event.status;
    if (role === "LECTURER" && event.status === "APPROVED") {
      newStatus = "PENDING";
    }

    await new Promise((resolve, reject) => {
      db.query(
        `UPDATE events
         SET title=?, description=?, event_type=?, start_datetime=?, end_datetime=?, location=?, status=?
         WHERE event_id=?`,
        [
          title,
          description,
          event_type,
          start_datetime,
          end_datetime,
          location,
          newStatus,
          eventId
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });

    res.json({ message: "Event updated successfully" });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// =====================================
// 🔹 DELETE EVENT
// =====================================
exports.deleteEvent = (req, res) => {

  const eventId = req.params.id;
  const role = req.user.role;
  const userId = req.user.id;

  db.query(
    `SELECT * FROM events WHERE event_id = ?`,
    [eventId],
    (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0) {
        return res.status(404).json({ message: "Event not found" });
      }

      const event = result[0];

      if (role === "LECTURER" && event.created_by !== userId) {
        return res.status(403).json({ message: "Not authorized" });
      }

      if (role === "HOD") {
        return res.status(403).json({ message: "HOD cannot delete events" });
      }

      db.query(
        `DELETE FROM events WHERE event_id = ?`,
        [eventId],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.json({ message: "Event deleted successfully" });
        }
      );
    }
  );
};