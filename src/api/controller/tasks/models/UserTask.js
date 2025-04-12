const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

const userTaskSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  taskId: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    required: true
  },
}, { versionKey: false });

module.exports = mongoose.model('UserTask', userTaskSchema, 'user_tasks');
