// server.js

require('dotenv').config();  // MUST be first

const app = require('./src/app');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`
========================================
🚀 SE Department Calendar Backend Started
📍 Port        : ${PORT}
🌍 Environment : ${process.env.NODE_ENV || 'development'}
========================================
  `);
});