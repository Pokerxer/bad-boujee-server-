const User = require('../models/User');

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  
  const options = {
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };
  
  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
};

const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'Email already registered' });
    }
    
    const user = await User.create({
      name,
      email,
      password,
      phone,
    });
    
    sendTokenResponse(user, 201, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }
    
    sendTokenResponse(user, 200, res);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user?.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const updateWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    const productId = req.params.productId;
    const wishlistIndex = user.wishlist.indexOf(productId);
    
    if (wishlistIndex > -1) {
      user.wishlist.splice(wishlistIndex, 1);
    } else {
      user.wishlist.push(productId);
    }
    
    await user.save();
    
    const updatedUser = await User.findById(req.user.id).populate('wishlist');
    
    res.status(200).json({ success: true, wishlist: updatedUser.wishlist });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

module.exports = {
  register,
  login,
  getMe,
  updateWishlist,
};
