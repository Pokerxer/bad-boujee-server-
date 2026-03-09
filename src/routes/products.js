const express = require('express');
const router = express.Router();
const { auth, admin } = require('../middleware/auth');
const {
  getProducts,
  getFeaturedProducts,
  getProductBySlug,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  getReviews,
  deleteReview,
} = require('../controllers/productController');

router.get('/', getProducts);
router.post('/', auth, admin, createProduct);
router.put('/:id', auth, admin, updateProduct);
router.delete('/:id', auth, admin, deleteProduct);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProductById);
router.post('/:id/reviews', auth, addReview);
router.get('/:id/reviews', getReviews);
router.delete('/:id/reviews/:reviewId', auth, deleteReview);

module.exports = router;
