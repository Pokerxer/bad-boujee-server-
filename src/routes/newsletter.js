const express = require('express');
const router = express.Router();
const { subscribe, unsubscribe, getSubscribers } = require('../controllers/newsletterController');

router.post('/', subscribe);
router.delete('/:email', unsubscribe);
router.get('/', getSubscribers);

module.exports = router;
