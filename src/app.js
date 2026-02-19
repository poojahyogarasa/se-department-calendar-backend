const express = require('express');
const cors = require('cors');

require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');
const lecturerRoutes = require('./routes/lecturerRoutes');
const hodRoutes = require('./routes/hodRoutes');
const toRoutes = require('./routes/toRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);
app.use('/api/lecturer', lecturerRoutes);
app.use('/api/hod', hodRoutes);
app.use('/api/to', toRoutes);

app.get('/', (req, res) => {
  res.send('Department Calendar Backend Running 🚀');
});

module.exports = app;
