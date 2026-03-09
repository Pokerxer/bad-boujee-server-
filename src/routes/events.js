const express = require('express');
const router = express.Router();
const { 
  getEvents, 
  getUpcomingEvents, 
  getFeaturedEvent, 
  getEventBySlug, 
  registerForEvent 
} = require('../controllers/eventController');

router.get('/', getEvents);
router.get('/upcoming', getUpcomingEvents);
router.get('/featured', getFeaturedEvent);
router.get('/slug/:slug', getEventBySlug);
router.post('/:id/register', registerForEvent);

module.exports = router;
