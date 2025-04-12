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
  status: {
    type: String,
    enum: ['created', 'approve', 'closed'],
  }
}, { versionKey: false });

module.exports = mongoose.model('TaskHistory', taskSchema, 'task_history');
