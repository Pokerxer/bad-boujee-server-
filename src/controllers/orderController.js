const Order = require('../models/Order');

const createOrder = async (req, res) => {
  try {
    const { orderItems, shipping, paymentMethod, subtotal, shippingCost, tax, total, userId } = req.body;
    
    const order = await Order.create({
      user: userId || undefined,
      orderItems,
      shipping,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
      status: 'pending',
    });
    
    res.status(201).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { status, paymentId, paymentReference } = req.body;
    
    const updateData = { 
      status,
    };
    
    if (status === 'delivered') {
      updateData.isDelivered = true;
      updateData.deliveredAt = new Date();
    }
    
    if (status === 'paid' || status === 'processing') {
      updateData.isPaid = true;
      updateData.paidAt = new Date();
    }
    
    if (paymentId) {
      updateData.paymentResult = { id: paymentId };
    }
    
    if (paymentReference) {
      updateData.paymentResult = { 
        ...updateData.paymentResult,
        reference: paymentReference,
        status: 'success' 
      };
    }
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' });
    }
    
    res.status(200).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
};
