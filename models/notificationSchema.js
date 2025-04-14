import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  title: {
    type: String,
    required: true,
  },
  body: {
    type: String,
    required: true,
  },
  data: {
    type: Object,
    default: {},
  },
  type: {
    type: String,
    enum: ['like', 'comment', 'follow', 'system', 'other'],
    default: 'other',
  },
  read: {
    type: Boolean,
    default: false,
  },
  delivered: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: '30d', // Auto-delete after 30 days
  },
});

const NotificationSchema = mongoose.model('Notification', notificationSchema);
export default NotificationSchema;
