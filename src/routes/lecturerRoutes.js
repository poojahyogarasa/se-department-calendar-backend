const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

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

module.exports = router;
