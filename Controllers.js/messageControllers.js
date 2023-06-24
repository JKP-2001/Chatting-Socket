const User = require("../models/User");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");

const chattingController = async (req, res) => {
    try{
        const chatId = req.body.chatId;
        const content = req.body.content;

        // console.log({chatId})
        // console.log({content})

        const user = await User.findOne({email:req.user.email});

        if(!user){
            throw new Error("Logged In User Not Found");
        }



        const sender = user._id;


        
        if(!chatId || !content){
            throw new Error("Chat Id and Message are required");
        }

        var newMessage = {

            sender:sender,
            content:content,
            chat:chatId
        };

        var message = await Message.create(newMessage);

        message = await message.populate("sender","firstName lastName email _id");

        message = await message.populate("chat");

        message = await User.populate(message,{
            path:"chat.users",
            select:"firstName lastName email _id"
        });

        await Chat.findByIdAndUpdate(chatId,{latestMessage:message._id,$push:{messages:message._id}});

        res.status(200).json({success:true,details:message});
        return;

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }

}

const fetchAllMessages = async (req, res) => {
    try{
        const chatId = req.params.chatId;

        if(!chatId){
            throw new Error("Chat Id is required");
        }

        const user = await User.findOne({email:req.user.email});

        if(!user){
            throw new Error("Logged In User Not Found");
        }

        const messages = await Message.find({chat:chatId}).populate("sender","firstName lastName email _id").populate("chat");

        res.status(200).json({success:true,details:messages});

    } catch (err) {
        res.status(400).json({success:false, "error":err.toString()});
    }
}


module.exports = {chattingController,fetchAllMessages};