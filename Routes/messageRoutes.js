const express = require('express');

const messageRouter = express.Router();

const { fetchUser } = require('../Middlewares/fetchUser');
const { chattingController, fetchAllMessages } = require('../Controllers.js/messageControllers');

messageRouter.post('/chat/chatting',fetchUser,chattingController);
messageRouter.get('/chat/allchats/:chatId',fetchUser,fetchAllMessages);


module.exports = messageRouter;