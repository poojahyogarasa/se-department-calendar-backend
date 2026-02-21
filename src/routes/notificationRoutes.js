const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middlewares/authMiddleware');

const {
  getMyNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

router.get('/', verifyToken, getMyNotifications);
router.get('/count', verifyToken, getUnreadCount);
router.patch('/:id/read', verifyToken, markAsRead);
router.patch('/read-all', verifyToken, markAllAsRead);
router.delete('/:id', verifyToken, deleteNotification);

module.exports = router;