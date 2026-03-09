const Newsletter = require('../models/Newsletter');

const subscribe = async (req, res) => {
  try {
    const { email, name, source } = req.body;
    
    if (!email) {
      return res.status(400).json({ success: false, error: 'Please provide an email' });
    }
    
    const existingSubscriber = await Newsletter.findOne({ email });
    
    if (existingSubscriber) {
      if (!existingSubscriber.subscribed) {
        existingSubscriber.subscribed = true;
        existingSubscriber.unsubscribedAt = undefined;
        existingSubscriber.subscribedAt = Date.now();
        await existingSubscriber.save();
        
        return res.status(200).json({
          success: true,
          message: 'Successfully re-subscribed to newsletter',
          subscriber: existingSubscriber,
        });
      }
      return res.status(400).json({ success: false, error: 'Email already subscribed' });
    }
    
    const subscriber = await Newsletter.create({
      email,
      name,
      source: source || 'website',
    });
    
    res.status(201).json({
      success: true,
      message: 'Successfully subscribed to newsletter',
      subscriber,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    const subscriber = await Newsletter.findOne({ email: req.params.email });
    
    if (!subscriber) {
      return res.status(404).json({ success: false, error: 'Subscriber not found' });
    }
    
    subscriber.subscribed = false;
    subscriber.unsubscribedAt = Date.now();
    await subscriber.save();
    
    res.status(200).json({
      success: true,
      message: 'Successfully unsubscribed from newsletter',
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getSubscribers = async (req, res) => {
  try {
    const subscribers = await Newsletter.find({ subscribed: true });
    
    res.status(200).json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  subscribe,
  unsubscribe,
  getSubscribers,
};
