const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const eventController = require('../controllers/eventController');

// Lecturer Dashboard
router.get('/dashboard',
  verifyToken,
  authorizeRoles('LECTURER'),
  (req, res) => {
    res.json({
      message: 'Welcome Lecturer Dashboard',
      user: req.user
    });
  }
);

// ✅ Create Event (Workflow)
router.post('/events',
  verifyToken,
  authorizeRoles('LECTURER'),
  eventController.createEvent
);

module.exports = router;