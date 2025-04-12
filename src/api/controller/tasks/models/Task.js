const { v4: uuid } = require('uuid');
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  userAssign: {
    type: Array,
    required: true
  },
  userCreate: {
    type: Object,
    required: true
  },
  taskId: {
    type: String,
    default: uuid()
  },
  taskName: {
    type: String,
    required: true
  },
  createdAt: {
    type: String,
    default: new Date().toISOString()
  },
  status: {
    type: String,
    default: 'created',
    enum: ['created', 'approve', 'closed'],
  }
}, { versionKey: false });

module.exports = mongoose.model('Task', taskSchema);
