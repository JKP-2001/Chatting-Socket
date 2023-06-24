const express = require('express');
const chatRouter = express.Router();

// const { check, validationResult } = require('express-validator');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { fetchUser } = require('../Middlewares/fetchUser');
const { accessChat, fetchAllChat, createGroupChat, renameGroupChat, addUserToGroupChat, deleteUserFromGroupChat, editNotfications, fetchAllNotifications } = require('../Controllers.js/chatController');


chatRouter.post('/chat',fetchUser,accessChat);
chatRouter.get('/chat/all',fetchUser,fetchAllChat);
chatRouter.post('/chat/creategrp',fetchUser,createGroupChat);
chatRouter.patch('/chat/rename',fetchUser,renameGroupChat);
chatRouter.patch('/chat/add',fetchUser,addUserToGroupChat);
chatRouter.patch('/chat/remove',fetchUser,deleteUserFromGroupChat);
chatRouter.patch('/chat/notification',fetchUser,editNotfications);

chatRouter.get('/chat/notification/all',fetchUser,fetchAllNotifications);

// chatRouter.delete('/chat',fetchUser,deleteGroupChat);
// chatRouter.get('/chat/:id',fetchUser,fetchChatById);
// chatRouter.get('/chat/:id/messages',fetchUser,fetchChatMessages);
// chatRouter.post('/chat/:id/message',fetchUser,sendMessage);
// chatRouter.patch('/chat/:id/message/:messageId',fetchUser,updateMessage);
// chatRouter.delete('/chat/:id/message/:messageId',fetchUser,deleteMessage);
// chatRouter.get('/chat/:id/messages/latest',fetchUser,fetchLatestMessage);


// chatRouter.get('/chat/:id/messages/new',fetchUser,fetchNewMessages);
// chatRouter.get('/chat/:id/messages/previous',fetchUser,fetchPreviousMessages);
// chatRouter.get('/chat/:id/messages/next',fetchUser,fetchNextMessages);
// chatRouter.get('/chat/:id/messages/previous/:messageId',fetchUser,fetchPreviousMessages);
// chatRouter.get('/chat/:id/messages/next/:messageId',fetchUser,fetchNextMessages);

module.exports = chatRouter;






