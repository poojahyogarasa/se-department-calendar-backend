const express = require('express');
const cors = require('cors');

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// ===============================
// ROUTES IMPORT
// ===============================
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const hodRoutes = require('./routes/hodRoutes');
const toRoutes = require('./routes/toRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const eventRoutes = require('./routes/eventRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const todoRoutes = require('./routes/todoRoutes');

// ===============================
// ROUTES REGISTER
// ===============================
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/to', toRoutes);
app.use('/api/todos', todoRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

// ===============================
// ROOT TEST
// ===============================
app.get('/', (req, res) => {
  res.send('Department Calendar Backend Running 🚀');
});

module.exports = app;