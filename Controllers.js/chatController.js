
const User = require('../models/User');
const Chat = require("../models/chatModel");

const accessChat = async (req, res) => {
    try {
        const {userId} = req.body;

        const loggedUserEmail = req.user.email;

        const user = await User.findOne({email:loggedUserEmail});

        if(!user){
            throw new Error("Logged In User Not Found");
        }


        if(!userId){
            throw new Error("User Id is required");
        }

        var isChat = await Chat.find({
            isGroupChat: false,
            $and: [
                { users: { $elemMatch: { $eq: userId } } },
                { users: { $elemMatch: { $eq: user._id } } }
            ]
        }).populate("users","firstName lastName email _id").populate("latestMessage");

        
        if(isChat.length > 0){
            res.status(200).json({success:true,details:isChat[0]});
            return;
        }

        else{
            const chat = await Chat.create({
                chatName: "New Chat",
                isGroupChat: false,
                users: [userId, user._id ],
                latestMessage: null,
                groupAdmin: null
            });

            const newChat = await Chat.findById(chat._id).populate("users","firstName lastName email _id").populate("latestMessage");

            res.status(200).json({success:true,details:newChat});
            return;
        }
        
    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});

    }
}


const editNotfications = async (req, res) => {
    try {
        const chatId = req.body.chatId;
        const number = req.body.number;

        console.log(number)

        const loggedUserEmail = req.user.email;

        const user = await User.findOne({email:loggedUserEmail});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        if(!chatId || number<0){
            throw new Error("Chat Id and Number are required");
        }

        const chat = await Chat.findById(chatId);

        if(!chat){
            throw new Error("Chat Not Found");
        }

        if(number === 0){
            await Chat.findByIdAndUpdate(chatId,{notifications:0});
        }

        else{
            var num = chat.notifications + number;
            await Chat.findByIdAndUpdate(chatId,{notifications:num});

        }

        const chatnew = await Chat.findById(chatId);

        res.status(200).json({success:true,details:chatnew.notifications});

        return;


    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}

const fetchAllChat = async (req, res) => {
    try {
        const loggedUserEmail = req.user.email;

        const user = await User.findOne({email:loggedUserEmail});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        const chats = await Chat.find({users:{$elemMatch:{$eq:user._id}}}).populate("users","firstName lastName email _id").populate("latestMessage").populate("groupAdmin","firstName lastName email _id").sort({updatedAt:-1});

        if(chats.length > 0){
            res.status(200).json({success:true,details:chats});
            return;
        }

        else{
            res.status(200).json({success:true,details:[]});
            return;
        }

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}


const fetchAllNotifications = async (req, res) => {
    try {
        const loggedUserEmail = req.user.email;

        const user = await User.findOne({email:loggedUserEmail});

        if(!user){
            throw new Error("Logged In User Not Found");

        }

        const chats = await Chat.find({users:{$elemMatch:{$eq:user._id}}}).select("notifications -_id").sort({updatedAt:-1});

        // const notifications = await Notification.find

        res.status(200).json({success:true,details:chats});

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }

}


const createGroupChat = async (req, res) => {
    try {
        const {chatName,Users} = req.body;

        if(!chatName || !Users){
            throw new Error("Chat Name and Users are required");
        }



        const loggedUserEmail = req.user.email;

        const user = await User.findOne({email:loggedUserEmail});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        var users = JSON.parse(Users);

        if(users.length < 2){
            throw new Error("Atleast 2 users are required");
        }

        users.push(user._id);
        
        const chat = await Chat.create({
            chatName: chatName,
            isGroupChat: true,
            users: users,
            latestMessage: null,
            groupAdmin: user._id
        });

        const newChat = await Chat.findById(chat._id).populate("users","firstName lastName email _id").populate("latestMessage").populate("groupAdmin","firstName lastName email _id");

        res.status(200).json({success:true,details:newChat});
        return;

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}


const renameGroupChat = async (req, res) => {
    try {
        const {chatId,chatName} = req.body;
        
        if(!chatId || !chatName){
            throw new Error("Chat Id and Chat Name are required");
        }

        const chat = await Chat.findById(chatId);

        const user = await User.findOne({email:req.user.email});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        if(!chat){
            throw new Error("Chat Not Found");
        }

        if(chat.groupAdmin.toString() !== user._id.toString()){
            throw new Error("You are not the admin of this group");
        }

        const updateChat = await Chat.findByIdAndUpdate(chatId,{chatName:chatName},{new:true}).populate("users","firstName lastName email _id").populate("latestMessage").populate("groupAdmin","firstName lastName email _id");
        
        res.status(200).json({success:true,details:updateChat});
        return;

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}


const addUserToGroupChat = async (req, res) => {
    try {
        const {chatId,userId} = req.body;

        if(!chatId || !userId){
            throw new Error("Chat Id and User Id are required");
        }

        const user = await User.findOne({email:req.user.email});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        const chat = await Chat.findById(chatId);

        if(!chat){
            throw new Error("Chat Not Found");
        }

        if(chat.groupAdmin.toString() !== user._id.toString()){
            throw new Error("You are not the admin of this group");
        }

        const updateChat = await Chat.findByIdAndUpdate(chatId,{$push:{users:userId}},{new:true}).populate("users","firstName lastName email _id").populate("latestMessage").populate("groupAdmin","firstName lastName email _id");

        res.status(200).json({success:true,details:updateChat});
        return;

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}


const deleteUserFromGroupChat = async (req, res) => {
    try {

        const {chatId,userId} = req.body;

        if(!chatId || !userId){
            throw new Error("Chat Id and User Id are required");
        }

        const user = await User.findOne({email:req.user.email});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        const chat = await Chat.findById(chatId);

        if(!chat){
            throw new Error("Chat Not Found");
        }

        if(chat.groupAdmin.toString() !== user._id.toString()){
            throw new Error("You are not the admin of this group");
        }

        const updateChat = await Chat.findByIdAndUpdate(chatId,{$pull:{users:userId}},{new:true}).populate("users","firstName lastName email _id").populate("latestMessage").populate("groupAdmin","firstName lastName email _id");

        res.status(200).json({success:true,details:updateChat});
        return;

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}




module.exports = {accessChat,fetchAllChat,createGroupChat,renameGroupChat,addUserToGroupChat,deleteUserFromGroupChat,editNotfications, fetchAllNotifications};
