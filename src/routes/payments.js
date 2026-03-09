const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  createStripePaymentIntent,
  verifyStripePayment,
  initializePaystack,
  verifyPaystackPayment,
  createPaystackTransferRecipient,
  handleStripeWebhook,
  getBanks,
} = require('../controllers/paymentController');

router.post('/stripe/create-intent', auth, createStripePaymentIntent);
router.post('/stripe/verify', auth, verifyStripePayment);
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook);

router.post('/paystack/initialize', auth, initializePaystack);
router.post('/paystack/verify', auth, verifyPaystackPayment);
router.post('/paystack/create-recipient', auth, admin, createPaystackTransferRecipient);
router.get('/paystack/banks', getBanks);

module.exports = router;
