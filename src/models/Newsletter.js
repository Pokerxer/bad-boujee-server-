const mongoose = require('mongoose');

const newsletterSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
  },
  name: {
    type: String,
  },
  subscribed: {
    type: Boolean,
    default: true,
  },
  unsubscribedAt: Date,
  subscribedAt: {
    type: Date,
    default: Date.now,
  },
  source: {
    type: String,
    default: 'website',
  },
});

module.exports = mongoose.model('Newsletter', newsletterSchema);
