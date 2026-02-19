const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

// HOD Dashboard
router.get('/dashboard',
  verifyToken,
  authorizeRoles('HOD'),
  (req, res) => {
    res.json({
      message: 'Welcome HOD Dashboard',
      user: req.user
    });
  }
);

module.exports = router;
