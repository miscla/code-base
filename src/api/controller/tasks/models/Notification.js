const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  deliveryEmail: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  }
}, { versionKey: false });

module.exports = mongoose.model('Notification', taskSchema, 'notifications');
