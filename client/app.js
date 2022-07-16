const socket = io();

//HTML Refs
const loginForm = document.getElementById('welcome-form');
const messagesSection = document.getElementById('messages-section');
const messagesList = document.getElementById('messages-list');
const addMessageForm = document.getElementById('add-messages-form');
const userNameInput = document.getElementById('username');
const messageContentInput = document.getElementById('message-content');

//Global variables
let userName = '';

//Code
const login = (e) => {
  e.preventDefault();

  if (userNameInput.value !== '') {
    userName = userNameInput.value;
    console.log(userName);
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

  if (messageContentInput.value !== '') {
    addMessage(userName, messageContentInput.value);
    messageContentInput.value = '';
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
