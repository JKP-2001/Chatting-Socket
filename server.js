require("dotenv").config();

const express = require("express");
const app = express();
const port = process.env.PORT || 5001;
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");
const connectDB = require("./config/db");
const saltRounds = 10;

const BASE_URL = process.env.BASE_URL;

const message = require("./models/messageModel");


const colors = require("colors");
const userRouter = require("./Routes/userRoutes");
const chatRouter = require("./Routes/chatRoutes");
const Message = require("./models/messageModel");
const messageRouter = require("./Routes/messageRoutes");

app.use(express.json());


app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Credentials", "true");
    res.header(
        "Access-Control-Allow-Methods",
        "GET,HEAD,OPTIONS,POST,PUT,DELETE,PATCH"
    );
    res.header(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization, security-key, auth-token,"
    );
    next();
});

app.use((req, res, next) => {

    if (req.originalMethod !== "GET" && req.headers["security-key"] !== process.env.SECURITY_KEY) {
        res.json({"message": "You are not authorized"});
        return;
    }
    next();
});

connectDB();

app.use(BASE_URL, userRouter);
app.use(BASE_URL, chatRouter);
app.use(BASE_URL, messageRouter)


const server = app.listen(port, () => {
    console.log(`Server started on port ${port}`.blue.bold);
}
);


const io = require("socket.io")(server, {
    pingTimeout: 60000,
    cors: {
        origin: "*",
    },
});


io.on("connection", (socket) => {


    socket.on('setup', (userData) => {
        socket.join(userData._id);
        console.log(userData._id + " connected")
        socket.emit("Connected");
    })

    socket.on("join chat", (chatId) => {
        socket.join(chatId);
        console.log("joined chat " + chatId);
        socket.emit("Chat initiated");
    })

    socket.on("typing", (chatId) => {
        console.log("typing")
        socket.in(chatId).emit("typing");
    })

    socket.on("stop typing", (chatId) => {
        console.log("stop typing")
        socket.in(chatId).emit("stop typing");
    })


    socket.on("new message", (newMessage) => {
        var chat = newMessage.chat;

        console.log("new message received")

        // console.log({newMessage})

        if(chat.users.length === 0){
            return console.log("Chat.users not defined");
        }

        chat.users.forEach((user) => {
            console.log({user})
            if(user._id == newMessage.sender._id){
                return;
            }
            socket.in(user._id).emit("message received", newMessage);
        }
        )
    })

    

});
