const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  comment: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide product name'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters'],
  },
  slug: {
    type: String,
    required: [true, 'Please provide product slug'],
    unique: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: [true, 'Please provide product price'],
    min: 0,
    default: 0,
  },
  compareAtPrice: {
    type: Number,
    default: 0,
  },
  description: {
    type: String,
    required: [true, 'Please provide product description'],
    maxlength: [2000, 'Description cannot exceed 2000 characters'],
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot exceed 200 characters'],
  },
  image: {
    type: String,
    required: [true, 'Please provide product image'],
  },
  images: [{
    type: String,
  }],
  category: {
    type: String,
    required: [true, 'Please provide product category'],
    enum: {
      values: ['tank', 'tee', 'hoodie', 'shorts', 'accessory', 'jersey', 'outerwear'],
      message: 'Invalid category',
    },
  },
  subcategory: {
    type: String,
  },
  sizes: [{
    size: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      default: 0,
      min: 0,
    },
    sku: String,
  }],
  colors: [{
    name: {
      type: String,
      required: true,
    },
    hex: String,
    images: [String],
  }],
  material: {
    type: String,
  },
  careInstructions: {
    type: String,
  },
  badge: {
    type: String,
    enum: ['new', 'limited', 'sold-out', 'hot', 'sale', null],
    default: null,
  },
  featured: {
    type: Boolean,
    default: false,
  },
  inStock: {
    type: Boolean,
    default: true,
  },
  stockQuantity: {
    type: Number,
    default: 0,
    min: 0,
  },
  soldCount: {
    type: Number,
    default: 0,
  },
  rating: {
    type: Number,
    default: 0,
    min: 0,
    max: 5,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
  reviews: [reviewSchema],
  tags: [String],
  weight: {
    type: Number,
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: -1 });

productSchema.virtual('discountPercentage').get(function() {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

productSchema.virtual('isOnSale').get(function() {
  return this.compareAtPrice > this.price;
});

productSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  if (this.sizes && this.sizes.length > 0) {
    this.stockQuantity = this.sizes.reduce((total, size) => total + size.stock, 0);
    this.inStock = this.stockQuantity > 0;
  }
  
  next();
});

productSchema.methods.addReview = async function(userId, name, rating, comment) {
  const review = {
    user: userId,
    name,
    rating,
    comment,
    createdAt: new Date(),
  };
  
  this.reviews.push(review);
  
  const totalRating = this.reviews.reduce((sum, rev) => sum + rev.rating, 0);
  this.rating = Math.round((totalRating / this.reviews.length) * 10) / 10;
  this.reviewCount = this.reviews.length;
  
  await this.save();
};

module.exports = mongoose.model('Product', productSchema);
