const db = require('../config/db');
const { successResponse, errorResponse } = require('../utils/responseHandler');
const { EVENT_STATUS } = require('../utils/constants');


// 🔹 Get Approved Events
exports.getApprovedEvents = (req, res) => {

  const query = `
    SELECT
      e.event_id,
      e.title,
      e.description,
      e.event_type,
      e.start_datetime,
      e.end_datetime,
      e.location,
      u.first_name,
      u.last_name
    FROM events e
    JOIN users u ON e.created_by = u.id
    WHERE e.status = ?
    ORDER BY e.start_datetime ASC
  `;

  db.query(query, [EVENT_STATUS.APPROVED], (err, results) => {
    if (err) return errorResponse(res, 'Database error');

    return successResponse(res, 'Approved events fetched successfully', results);
  });
};