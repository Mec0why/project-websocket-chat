const socket = io();

//HTML Refs
const loginForm = document.getElementById('welcome-form'),
  messagesSection = document.getElementById('messages-section'),
  messagesList = document.getElementById('messages-list'),
  addMessageForm = document.getElementById('add-messages-form'),
  userNameInput = document.getElementById('username'),
  messageContentInput = document.getElementById('message-content');

//Add socket event listeners
socket.on('message', ({ author, content }) => addMessage(author, content));
socket.on('newUser', ({ author, content }) => addMessage(author, content));
socket.on('userLeaves', ({ author, content }) => addMessage(author, content));

//Global variables
let userName = '';
const chatBot = 'ChatBot';

//Code
const login = (e) => {
  e.preventDefault();

  if (userNameInput.value !== '') {
    userName = userNameInput.value;
    console.log(userName);

    socket.emit('loggedIn', { name: userName, id: socket.id });
    socket.emit('newUser', {
      author: chatBot,
      content: `${userName} has joined the conversation!`,
    });

    loginForm.classList.toggle('show');
    messagesSection.classList.toggle('show');
  } else {
    alert('Field cannot be empty');
  }
};

const addMessage = (author, content) => {
  const message = document.createElement('li');
  message.classList.add('message');
  message.classList.add('message--received');

  if (author === userName) {
    message.classList.add('message--self');
  }

  if (author === chatBot) {
    message.classList.add('message--chatbot');
  }

  message.innerHTML = `
    <h3 class="message__author">${userName === author ? 'You' : author}</h3>
    <div class="message__content">
      ${content}
    </div>
  `;
  messagesList.appendChild(message);
};

const sendMessage = (e) => {
  e.preventDefault();

  let messageContent = messageContentInput.value;

  if (messageContent) {
    addMessage(userName, messageContent);

    //Add socket event emitter
    socket.emit('message', { author: userName, content: messageContent });

    messageContent = '';
  } else {
    alert("Write something first! Don't be shy! ;)");
  }
};

loginForm.addEventListener('submit', (e) => {
  login(e);
});

addMessageForm.addEventListener('submit', (e) => {
  sendMessage(e);
});
