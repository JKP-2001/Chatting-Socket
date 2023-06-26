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
        res.json({ "message": "You are not authorized" });
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
        socket.in(chatId).emit("typing", chatId);
    })

    socket.on("stop typing", (chatId) => {
        console.log("stop typing")
        socket.in(chatId).emit("stop typing", chatId);
    })


    socket.on("new message", (newMessage) => {
        var chat = newMessage.chat;

        console.log("new message received")

        // console.log({newMessage})

        if (chat.users.length === 0) {
            return console.log("Chat.users not defined");
        }

        chat.users.forEach((user) => {
            console.log({ user })
            if (user._id == newMessage.sender._id) {
                return;
            }
            socket.in(user._id).emit("message received", newMessage);
        }
        )
    })

    socket.on("enter a group", (groupId) => {
        socket.join(groupId);
        console.log("joined group " + groupId);
        socket.emit("Group joined");
    });

    socket.on("group message detected", (data) => {
        console.log("new group message received")
        console.log(data);
        socket.in(data.grpId).emit("group message received",(data));
    });

    socket.on("assignment detected", (data) => {
        console.log("new assignment received")
        socket.in(data.grpId).emit("assignment received",(data));
    });

    socket.on("member added", (data) => {
        console.log("new member added")
        socket.in(data.grpId).emit("member added to grp",(data));
    });

    socket.on("code reset", (data) => {
        console.log("code resetted")
        socket.in(data.grpId).emit("code resetted",(data));
    });

    socket.on("assignment assign", (data) => {
        console.log("assignment assigned")
        console.log({member:data});
        socket.emit("Assignment Assign",(data));
    });


    socket.on("open assignment", (data) => {
        socket.join(data.assId);
        console.log("joined assignment " + data.assId);
        socket.emit("Assignment Opened");
    });

    socket.on("assignment submit", (data) => {
        console.log("assignment submitted")
        console.log({assId:data.assId});
        socket.in(data.assId).emit("Assignment Submit",(data));
    });



    // socket.on("new group message", (newMessage) => {

});
