const db = require("../config/db");


// =====================================
// 🔹 GET MY NOTIFICATIONS
// =====================================
exports.getMyNotifications = (req, res) => {

  const userId = req.user.id;
  const { unread } = req.query;

  let query = `
    SELECT 
      notification_id,
      event_id,
      message,
      notification_type,
      sent_at,
      is_read
    FROM notifications
    WHERE user_id = ?
  `;

  let values = [userId];

  if (unread === "true") {
    query += ` AND is_read = 0`;
  }

  query += ` ORDER BY sent_at DESC`;

  db.query(query, values, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};



// =====================================
// 🔹 GET UNREAD COUNT
// =====================================
exports.getUnreadCount = (req, res) => {

  const userId = req.user.id;

  db.query(
    `SELECT COUNT(*) AS unread_count
     FROM notifications
     WHERE user_id = ? AND is_read = 0`,
    [userId],
    (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      res.json({
        unread_count: result[0].unread_count
      });
    }
  );
};



// =====================================
// 🔹 MARK SINGLE AS READ
// =====================================
exports.markAsRead = (req, res) => {

  const userId = req.user.id;
  const notificationId = req.params.id;

  db.query(
    `UPDATE notifications
     SET is_read = 1
     WHERE user_id = ? AND notification_id = ?`,
    [userId, notificationId],
    (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ message: "Notification marked as read" });
    }
  );
};



// =====================================
// 🔹 MARK ALL AS READ
// =====================================
exports.markAllAsRead = (req, res) => {

  const userId = req.user.id;

  db.query(
    `UPDATE notifications
     SET is_read = 1
     WHERE user_id = ? AND is_read = 0`,
    [userId],
    (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      res.json({
        message: "All notifications marked as read",
        updated: result.affectedRows
      });
    }
  );
};



// =====================================
// 🔹 DELETE NOTIFICATION
// =====================================
exports.deleteNotification = (req, res) => {

  const userId = req.user.id;
  const notificationId = req.params.id;

  db.query(
    `DELETE FROM notifications
     WHERE user_id = ? AND notification_id = ?`,
    [userId, notificationId],
    (err, result) => {

      if (err) return res.status(500).json({ error: err.message });

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Notification not found" });
      }

      res.json({ message: "Notification deleted successfully" });
    }
  );
};