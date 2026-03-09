const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('./config');

const productRoutes = require('./routes/products');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const eventRoutes = require('./routes/events');
const newsletterRoutes = require('./routes/newsletter');
const paymentRoutes = require('./routes/payments');

const app = express();

app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true,
}));

app.use('/api/payments/stripe/webhook', express.raw({ type: 'application/json' }));

app.use(express.json());

app.use('/api/products', productRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/newsletter', newsletterRoutes);
app.use('/api/payments', paymentRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ball & Boujee API is running' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Server Error',
  });
});

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(config.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

const startServer = async () => {
  await connectDB();
  
  app.listen(config.PORT, () => {
    console.log(`Server running on port ${config.PORT}`);
    console.log(`API available at http://localhost:${config.PORT}/api`);
  });
};

startServer();

module.exports = app;
