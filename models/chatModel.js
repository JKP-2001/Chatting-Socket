const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    chatName: { type: String, required: true }, // name of the chat 
    isGroupChat: { type: Boolean, default: false }, // if the chat is a group chat      
    users: [{ type: Schema.Types.ObjectId, ref: "User" }], // array of user ids
    latestMessage: { type: Schema.Types.ObjectId, ref: "Message" }, // id of the latest message
    groupAdmin: { type: Schema.Types.ObjectId, ref: "User" }, // id of the group admin 
    notifications: {type:Number, default:0}
}, { timestamps: true });


const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;


