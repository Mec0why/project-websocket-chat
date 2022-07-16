// initialize server
const express = require('express');
const app = express();
const db = require('./db');
const path = require('path');

app.get('/messages', (req, res) => {
  res.json(db.messages);
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 You shall not pass!');
});

app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});
