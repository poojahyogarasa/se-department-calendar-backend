const jwt = require('jsonwebtoken');

// 🔐 Verify Token
exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Access denied. No token provided.'
    });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Invalid token format.'
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;   // { id, email, role }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.'
    });
  }
};


// 🔐 Role-Based Authorization
exports.authorizeRoles = (...roles) => {
  return (req, res, next) => {

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized.'
      });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to access this resource.'
      });
    }

    next();
  };
};
