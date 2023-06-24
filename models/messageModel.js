const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: "User" }, // id of the user who sent the message
    content: { type: String, trim: true }, // actual message
    chat: { type: Schema.Types.ObjectId, ref: "Chat" }, // id of the chat the message was sent in
    readBy: [{ type: Schema.Types.ObjectId, ref: "User" }], // array of user ids who read the message
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;