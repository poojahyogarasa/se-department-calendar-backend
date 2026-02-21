const db = require("../config/db");

exports.getDashboardSummary = async (req, res) => {

  const userId = req.user.id;
  const role = req.user.role;

  try {

    // ===============================
    // 👨‍🏫 LECTURER DASHBOARD
    // ===============================
    if (role === "LECTURER") {

      const summaryQuery = `
        SELECT
          COUNT(*) AS total_events,
          SUM(status = 'PENDING') AS pending_events,
          SUM(status = 'APPROVED') AS approved_events,
          SUM(status = 'REJECTED') AS rejected_events
        FROM events
        WHERE created_by = ?
      `;

      const notificationQuery = `
        SELECT COUNT(*) AS unread_notifications
        FROM notifications
        WHERE user_id = ? AND is_read = 0
      `;

      const [summary] = await new Promise((resolve, reject) => {
        db.query(summaryQuery, [userId], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      const [notifications] = await new Promise((resolve, reject) => {
        db.query(notificationQuery, [userId], (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      return res.json({
        role,
        total_events: summary.total_events || 0,
        pending_events: summary.pending_events || 0,
        approved_events: summary.approved_events || 0,
        rejected_events: summary.rejected_events || 0,
        unread_notifications: notifications.unread_notifications || 0
      });
    }

    // ===============================
    // 👨‍💼 HOD DASHBOARD
    // ===============================
    if (role === "HOD") {

      const query = `
        SELECT
          COUNT(*) AS total_events,
          SUM(status = 'PENDING') AS pending_events,
          SUM(status = 'APPROVED') AS approved_events,
          SUM(status = 'REJECTED') AS rejected_events
        FROM events
      `;

      const [result] = await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      return res.json({
        role,
        total_events: result.total_events || 0,
        pending_events: result.pending_events || 0,
        approved_events: result.approved_events || 0,
        rejected_events: result.rejected_events || 0
      });
    }

    // ===============================
    // 🎓 STUDENT DASHBOARD
    // ===============================
    if (role === "STUDENT") {

      const query = `
        SELECT
          COUNT(*) AS total_approved,
          SUM(start_datetime > NOW()) AS upcoming_events
        FROM events
        WHERE status = 'APPROVED'
      `;

      const [result] = await new Promise((resolve, reject) => {
        db.query(query, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      return res.json({
        role,
        total_approved: result.total_approved || 0,
        upcoming_events: result.upcoming_events || 0
      });
    }

    // ===============================
    // 👑 ADMIN DASHBOARD
    // ===============================
    if (role === "ADMIN") {

      const userQuery = `SELECT COUNT(*) AS total_users FROM users`;

      const eventQuery = `
        SELECT
          COUNT(*) AS total_events,
          SUM(status = 'PENDING') AS pending_events,
          SUM(status = 'APPROVED') AS approved_events,
          SUM(status = 'REJECTED') AS rejected_events
        FROM events
      `;

      const [users] = await new Promise((resolve, reject) => {
        db.query(userQuery, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      const [events] = await new Promise((resolve, reject) => {
        db.query(eventQuery, (err, result) => {
          if (err) reject(err);
          else resolve(result);
        });
      });

      return res.json({
        role,
        total_users: users.total_users || 0,
        total_events: events.total_events || 0,
        pending_events: events.pending_events || 0,
        approved_events: events.approved_events || 0,
        rejected_events: events.rejected_events || 0
      });
    }

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};