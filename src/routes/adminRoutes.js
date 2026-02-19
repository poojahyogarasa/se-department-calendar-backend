const express = require('express');
const router = express.Router();
const { verifyToken, authorizeRoles } = require('../middlewares/authMiddleware');

router.get('/dashboard',
  verifyToken,
  authorizeRoles('ADMIN'),
  (req, res) => {
    res.json({ message: 'Welcome Admin Dashboard' });
  }
);

module.exports = router;
