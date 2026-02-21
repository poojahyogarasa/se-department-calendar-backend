const express = require('express');
const router = express.Router();

const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');
const eventController = require('../controllers/eventController');

// Create Event
router.post(
  '/',
  verifyToken,
  authorizeRoles('ADMIN', 'LECTURER'),
  eventController.createEvent
);

// Get Events
router.get(
  '/',
  verifyToken,
  eventController.getEvents
);

// Get Single Event
router.get(
  '/:id',
  verifyToken,
  eventController.getEventById
);

// Update Event
router.put(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'LECTURER'),
  eventController.updateEvent
);

// Delete Event
router.delete(
  '/:id',
  verifyToken,
  authorizeRoles('ADMIN', 'LECTURER', 'HOD'),
  eventController.deleteEvent
);

module.exports = router;