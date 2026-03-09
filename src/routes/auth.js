const express = require('express');
const router = express.Router();
const { auth } = require('../middleware/auth');
const { register, login, getMe, updateWishlist } = require('../controllers/userController');

router.post('/register', register);
router.post('/login', login);
router.get('/me', auth, getMe);
router.put('/wishlist/:productId', auth, updateWishlist);

module.exports = router;
