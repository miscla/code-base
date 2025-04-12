const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    default: uuid()
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  },
  comment: {
    type: String,
    required: true
  }
}, { versionKey: false });

module.exports = mongoose.model('TaskComment', taskSchema, 'task_comments');
