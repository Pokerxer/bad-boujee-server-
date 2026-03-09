const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide event title'],
    trim: true,
  },
  subtitle: {
    type: String,
  },
  slug: {
    type: String,
    required: [true, 'Please provide event slug'],
    unique: true,
    lowercase: true,
  },
  date: {
    type: Date,
    required: [true, 'Please provide event date'],
  },
  endDate: Date,
  location: {
    type: String,
    required: [true, 'Please provide event location'],
  },
  address: String,
  price: {
    type: Number,
    required: [true, 'Please provide event price'],
    min: 0,
  },
  priceLabel: {
    type: String,
    default: 'Per Person',
  },
  image: {
    type: String,
    required: [true, 'Please provide event image'],
  },
  images: [String],
  description: {
    type: String,
    required: [true, 'Please provide event description'],
  },
  tags: [String],
  spots: {
    type: Number,
    required: true,
    min: 0,
  },
  totalSpots: {
    type: Number,
    required: true,
  },
  schedule: [{
    time: String,
    activity: String,
  }],
  featured: {
    type: Boolean,
    default: false,
  },
  eventType: {
    type: String,
    enum: ['tournament', 'open-run', 'training', 'community', 'other'],
    default: 'other',
  },
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming',
  },
  registrations: [{
    name: String,
    email: String,
    phone: String,
    teamName: String,
    registeredAt: {
      type: Date,
      default: Date.now,
    },
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

eventSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Event', eventSchema);
