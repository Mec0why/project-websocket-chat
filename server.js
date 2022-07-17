// initialize server
const express = require('express'),
  app = express(),
  socket = require('socket.io'),
  db = require('./db'),
  path = require('path');

app.get('/messages', (req, res) => {
  res.json(db.messages);
});

app.get('/users', (req, res) => {
  res.json(db.users);
});

app.use(express.static(path.join(__dirname, '/client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '/client/index.html'));
});

app.use((req, res) => {
  res.status(404).send('404 You shall not pass!');
});

const server = app.listen(process.env.PORT || 8000, () => {
  console.log('Server is running on port: 8000');
});

const io = socket(server);

io.on('connection', (socket) => {
  console.log('New client! Its id – ' + socket.id);

  socket.on('loggedIn', (user) => {
    console.log('Oh, user logged in! ' + socket.id);
    db.users.push(user);
  });

  socket.on('newUser', (newUser) => {
    console.log(newUser.content);
    db.messages.push(newUser);
    socket.broadcast.emit('newUser', newUser);
  });

  socket.on('message', (message) => {
    console.log("Oh, I've got something from " + socket.id);
    db.messages.push(message);
    socket.broadcast.emit('message', message);
  });

  socket.on('disconnect', () => {
    console.log('Oh, socket ' + socket.id + ' has left');

    let leavingUser = db.users.find((user) => user.id === socket.id);

    console.log('This User left: ' + leavingUser.name);

    socket.broadcast.emit('userLeaves', {
      author: 'ChatBot',
      content: `${leavingUser.name} has left the conversation... :(`,
    });

    const filteredDb = db.users.filter((user) =>
      user.id === socket.id ? false : true
    );

    db.users = filteredDb;
    console.log(db.users);
  });

  console.log("I've added a listener on message and disconnect events \n");
});
