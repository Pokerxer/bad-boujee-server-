require('dotenv').config({ path: './.env' });
const mongoose = require('mongoose');
const config = require('./config');
const Product = require('./models/Product');
const Event = require('./models/Event');
const Newsletter = require('./models/Newsletter');

const products = [
  {
    name: "Infinity Classic Tank",
    slug: "infinity-classic-tank",
    price: 45000,
    compareAtPrice: 55000,
    description: "Premium cotton blend with infinity branding",
    image: "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1503341504253-dff4815485f1?w=600&q=80",
      "https://images.unsplash.com/photo-1503341455253-b2e72333dbdb?w=600&q=80",
    ],
    category: "tank",
    badge: "new",
    sizes: [
      { size: "S", stock: 12 },
      { size: "M", stock: 8 },
      { size: "L", stock: 5 },
      { size: "XL", stock: 0 },
    ],
    featured: true,
  },
  {
    name: "Courtside Tee",
    slug: "courtside-tee",
    price: 55000,
    description: "Oversized fit with retro court graphics",
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&q=80",
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&q=80",
    ],
    category: "tee",
    sizes: [
      { size: "S", stock: 15 },
      { size: "M", stock: 20 },
      { size: "L", stock: 10 },
      { size: "XL", stock: 7 },
    ],
  },
  {
    name: "Boujee Hoops Hoodie",
    slug: "boujee-hoops-hoodie",
    price: 85000,
    compareAtPrice: 120000,
    description: "Heavyweight fleece with embroidered details",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
    images: [
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&q=80",
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80",
    ],
    category: "hoodie",
    badge: "limited",
    sizes: [
      { size: "S", stock: 3 },
      { size: "M", stock: 5 },
      { size: "L", stock: 2 },
      { size: "XL", stock: 0 },
      { size: "2XL", stock: 0 },
    ],
    featured: true,
  },
  {
    name: "Street Legend Cap",
    slug: "street-legend-cap",
    price: 35000,
    description: "Classic snapback with premium embroidery",
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&q=80",
    category: "accessory",
    badge: "new",
    sizes: [],
  },
  {
    name: "Game Day Shorts",
    slug: "game-day-shorts",
    price: 48000,
    description: "Breathable mesh with side stripes",
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=600&q=80",
    category: "shorts",
    sizes: [
      { size: "S", stock: 10 },
      { size: "M", stock: 15 },
      { size: "L", stock: 8 },
      { size: "XL", stock: 5 },
    ],
  },
  {
    name: "Classic Crew Socks",
    slug: "classic-crew-socks",
    price: 18000,
    description: "Cotton blend with arch support",
    image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&q=80",
    category: "accessory",
    badge: "sold-out",
    sizes: [],
  },
  {
    name: "Venice Beach Tank",
    slug: "venice-beach-tank",
    price: 40000,
    description: "Lightweight fabric with beach vibes",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80",
    category: "tank",
    sizes: [
      { size: "S", stock: 8 },
      { size: "M", stock: 12 },
      { size: "L", stock: 6 },
      { size: "XL", stock: 3 },
    ],
  },
  {
    name: "Oversized Hoodie",
    slug: "oversized-hoodie",
    price: 95000,
    compareAtPrice: 130000,
    description: "Ultra-soft fleece with dropped shoulders",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80",
    category: "hoodie",
    badge: "new",
    sizes: [
      { size: "S", stock: 5 },
      { size: "M", stock: 8 },
      { size: "L", stock: 4 },
      { size: "XL", stock: 2 },
    ],
    featured: true,
  },
];

const events = [
  {
    title: "ABUJA SUMMER JAM",
    slug: "abuja-summer-jam-2026",
    subtitle: "3v3 Street Basketball Tournament",
    date: new Date("2026-04-15T16:00:00"),
    location: "Abuja National Stadium Courts",
    address: "Abubakar Tafawa Balewa Way, Abuja",
    price: 15000,
    priceLabel: "Per Team",
    image: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800&q=80",
      "https://images.unsplash.com/photo-1519861531473-92002639313cc?w=800&q=80",
    ],
    tags: ["3v3", "Open Run", "₦50,000 Prize", "All Levels"],
    spots: 18,
    totalSpots: 32,
    description: "The biggest 3v3 tournament in Nigeria's capital. Show off your skills, compete for prizes, and represent your area.",
    schedule: [
      { time: "4:00 PM", activity: "Check-in & Warm-up" },
      { time: "5:00 PM", activity: "Opening Ceremony" },
      { time: "5:30 PM", activity: "Group Stage Begins" },
      { time: "8:00 PM", activity: "Finals & Awards" },
    ],
    eventType: "tournament",
    status: "upcoming",
    featured: true,
  },
  {
    title: "BOUJEE RUN",
    slug: "boujee-run-weekly",
    subtitle: "Weekly Open Gym Night",
    date: new Date("2026-03-21T18:00:00"),
    location: "Moshood Abiola Way Courts",
    address: "Maitama, Abuja",
    price: 2000,
    priceLabel: "Per Player",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&q=80",
    tags: ["Open Run", "All Skills", "Weekly"],
    spots: 40,
    totalSpots: 50,
    description: "Every Saturday evening. Come through, get some runs in, and ball with the community.",
    eventType: "open-run",
    status: "upcoming",
  },
  {
    title: "1V1 KING OF THE COURT",
    slug: "king-of-the-court-2026",
    subtitle: "Individual Challenge",
    date: new Date("2026-04-28T15:00:00"),
    location: "Wuse II Basketball Court",
    address: "Wuse II, Abuja",
    price: 5000,
    priceLabel: "Per Player",
    image: "https://images.unsplash.com/photo-1519861531473-92002639313cc?w=1200&q=80",
    tags: ["1v1", "Winner Takes All", "₦25,000"],
    spots: 16,
    totalSpots: 24,
    description: "One on one. No teams, no excuses. Who rules the court?",
    eventType: "tournament",
    status: "upcoming",
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(config.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    await Product.deleteMany({});
    await Event.deleteMany({});
    
    const createdProducts = await Product.insertMany(products);
    console.log(`Created ${createdProducts.length} products`);
    
    const createdEvents = await Event.insertMany(events);
    console.log(`Created ${createdEvents.length} events`);
    
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error.message);
    process.exit(1);
  }
};

seedDatabase();
