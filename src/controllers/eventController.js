const Event = require('../models/Event');

const getEvents = async (req, res) => {
  try {
    const { status, eventType, page = 1, limit = 20 } = req.query;
    
    let query = {};
    
    if (status && status !== 'all') {
      query.status = status;
    }
    
    if (eventType && eventType !== 'all') {
      query.eventType = eventType;
    }
    
    const events = await Event.find(query)
      .sort({ date: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    
    const total = await Event.countDocuments(query);
    
    res.status(200).json({
      success: true,
      count: events.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      events,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getUpcomingEvents = async (req, res) => {
  try {
    const events = await Event.find({ 
      status: { $in: ['upcoming', 'ongoing'] },
      date: { $gte: new Date() }
    })
    .sort({ date: 1 })
    .limit(10);
    
    res.status(200).json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getFeaturedEvent = async (req, res) => {
  try {
    const event = await Event.findOne({ 
      featured: true,
      status: { $in: ['upcoming', 'ongoing'] },
      date: { $gte: new Date() }
    }).sort({ date: 1 });
    
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getEventBySlug = async (req, res) => {
  try {
    const event = await Event.findOne({ slug: req.params.slug });
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    res.status(200).json({ success: true, event });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const { name, email, phone, teamName } = req.body;
    
    const event = await Event.findById(req.params.id);
    
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' });
    }
    
    if (event.spots <= 0) {
      return res.status(400).json({ success: false, error: 'No spots available' });
    }
    
    event.registrations.push({ name, email, phone, teamName });
    event.spots -= 1;
    
    await event.save();
    
    res.status(200).json({
      success: true,
      message: 'Registration successful',
      event,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  getEvents,
  getUpcomingEvents,
  getFeaturedEvent,
  getEventBySlug,
  registerForEvent,
};
