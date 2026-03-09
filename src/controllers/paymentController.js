const Stripe = require('stripe');
const config = require('../config');
const Order = require('../models/Order');

const stripe = config.STRIPE_SECRET_KEY ? new Stripe(config.STRIPE_SECRET_KEY) : null;

const paystackApi = async (endpoint, method = 'GET', body = null) => {
  const response = await fetch(`https://api.paystack.co${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${config.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : null,
  });
  return response.json();
};

const createStripePaymentIntent = async (req, res) => {
  try {
    const { amount, orderId, email } = req.body;

    if (!stripe) {
      return res.status(500).json({ 
        success: false, 
        error: 'Stripe is not configured' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'ngn',
      metadata: {
        orderId,
        email,
      },
      receipt_email: email,
    });

    res.status(200).json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const verifyStripePayment = async (req, res) => {
  try {
    const { paymentIntentId } = req.body;

    if (!stripe) {
      return res.status(500).json({ 
        success: false, 
        error: 'Stripe is not configured' 
      });
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    res.status(200).json({
      success: true,
      paymentStatus: paymentIntent.status,
      amount: paymentIntent.amount / 100,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const initializePaystack = async (req, res) => {
  try {
    const { amount, email, orderId, callbackUrl } = req.body;

    if (!config.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Paystack is not configured' 
      });
    }

    const response = await paystackApi('/transaction/initialize', 'POST', {
      email,
      amount: Math.round(amount * 100),
      callback_url: callbackUrl || `${config.FRONTEND_URL}/checkout/success`,
      metadata: {
        orderId,
        email,
      },
    });

    if (response.status) {
      res.status(200).json({
        success: true,
        authorizationUrl: response.data.authorization_url,
        reference: response.data.reference,
      });
    } else {
      res.status(400).json({
        success: false,
        error: response.message,
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const verifyPaystackPayment = async (req, res) => {
  try {
    const { reference } = req.body;

    if (!config.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Paystack is not configured' 
      });
    }

    const response = await paystackApi(`/transaction/verify/${reference}`, 'GET');

    if (response.data && response.data.status === 'success') {
      res.status(200).json({
        success: true,
        paymentStatus: 'success',
        amount: response.data.amount / 100,
        reference: response.data.reference,
      });
    } else {
      res.status(400).json({
        success: false,
        paymentStatus: 'failed',
        error: 'Payment verification failed',
      });
    }
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const createPaystackTransferRecipient = async (req, res) => {
  try {
    const { accountNumber, bankCode, name } = req.body;

    if (!config.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Paystack is not configured' 
      });
    }

    const response = await paystackApi('/transferrecipient', 'POST', {
      type: 'nuban',
      name,
      account_number: accountNumber,
      bank_code: bankCode,
      currency: 'NGN',
    });

    res.status(200).json({
      success: true,
      recipientCode: response.data.recipient_code,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const handleStripeWebhook = async (req, res) => {
  try {
    if (!stripe) {
      return res.status(500).json({ 
        success: false, 
        error: 'Stripe is not configured' 
      });
    }

    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        config.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object;
        const orderId = paymentIntent.metadata.orderId;
        
        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            status: 'processing',
            isPaid: true,
            paidAt: new Date(),
            paymentId: paymentIntent.id,
            paymentMethod: 'stripe',
          });
        }
        break;
        
      case 'payment_intent.payment_failed':
        const failedPayment = event.data.object;
        console.log('Payment failed:', failedPayment.id);
        break;
        
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

const getBanks = async (req, res) => {
  try {
    if (!config.PAYSTACK_SECRET_KEY) {
      return res.status(500).json({ 
        success: false, 
        error: 'Paystack is not configured' 
      });
    }

    const response = await paystackApi('/bank', 'GET');
    
    res.status(200).json({
      success: true,
      banks: response.data,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

module.exports = {
  createStripePaymentIntent,
  verifyStripePayment,
  initializePaystack,
  verifyPaystackPayment,
  createPaystackTransferRecipient,
  handleStripeWebhook,
  getBanks,
};
