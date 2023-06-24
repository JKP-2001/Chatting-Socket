const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    chatId: { type: Schema.Types.ObjectId, ref: "Chat" },
    notificationCount: { type: Number, default: 0 },

},);

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;