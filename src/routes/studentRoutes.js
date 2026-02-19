const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get(
  '/dashboard',
  verifyToken,
  authorizeRoles('STUDENT'),
  (req, res) => {
    res.json({
      success: true,
      message: 'Student dashboard accessed successfully',
      user: req.user
    });
  }
);

module.exports = router;
