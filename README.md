# Ball & Boujee Backend Server

Express.js server with MongoDB database for the Ball & Boujee e-commerce platform.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Installation

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update the `MONGODB_URI` in `.env` with your MongoDB connection string.

## Usage

### Start the server

```bash
npm start
```

The server will run on `http://localhost:5000`

### Seed the database with sample data

```bash
npm run seed
```

## API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering, pagination, sorting)
- `GET /api/products/featured` - Get featured products
- `GET /api/products/slug/:slug` - Get product by slug
- `GET /api/products/:id` - Get product by ID

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/wishlist/:productId` - Toggle wishlist

### Orders
- `POST /api/orders` - Create new order
- `GET /api/orders/my-orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `PUT /api/orders/:id/status` - Update order status

### Events
- `GET /api/events` - Get all events
- `GET /api/events/upcoming` - Get upcoming events
- `GET /api/events/featured` - Get featured event
- `GET /api/events/slug/:slug` - Get event by slug
- `POST /api/events/:id/register` - Register for event

### Newsletter
- `POST /api/newsletter` - Subscribe to newsletter
- `DELETE /api/newsletter/:email` - Unsubscribe
- `GET /api/newsletter` - Get all subscribers

### Health Check
- `GET /api/health` - Check if server is running

## Project Structure

```
server/
├── src/
│   ├── config/
│   │   └── index.js          # Configuration
│   ├── middleware/
│   │   └── auth.js           # Authentication middleware
│   ├── models/
│   │   ├── Event.js          # Event model
│   │   ├── Newsletter.js     # Newsletter model
│   │   ├── Order.js          # Order model
│   │   ├── Product.js        # Product model
│   │   └── User.js           # User model
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   ├── events.js         # Events routes
│   │   ├── newsletter.js     # Newsletter routes
│   │   ├── orders.js         # Orders routes
│   │   └── products.js       # Products routes
│   ├── seed.js                # Database seeder
│   └── server.js              # Main server file
├── .env.example               # Example environment variables
├── package.json
└── README.md
```
