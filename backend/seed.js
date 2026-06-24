const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Product = require('./models/Product');
const User = require('./models/User');

const products = [
  {
    name: 'King Size Bed with Storage',
    description: 'Spacious king size bed with hydraulic storage, solid wood frame, and premium finish. Perfect for large bedrooms.',
    category: 'Furniture', subcategory: 'Bed',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600','https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600'],
    monthlyRent: 1800, securityDeposit: 3600,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 10 }],
    brand: 'WoodCraft', condition: 'New', availableQuantity: 5, totalQuantity: 5,
    features: ['Hydraulic Storage', 'Solid Wood', 'Anti-termite coating', 'Easy Assembly'],
    color: 'Walnut Brown', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai'],
  },
  {
    name: '3-Seater Fabric Sofa',
    description: 'Premium 3-seater sofa with high-density foam, available in multiple colors. Great for living rooms.',
    category: 'Furniture', subcategory: 'Sofa',
    images: ['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600','https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=600'],
    monthlyRent: 1200, securityDeposit: 2400,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 12 }],
    brand: 'ComfortPlus', condition: 'New', availableQuantity: 8, totalQuantity: 8,
    features: ['High-density foam', 'Stain resistant fabric', 'Solid wood legs', 'Easy to clean'],
    color: 'Grey', serviceAreas: ['Hyderabad', 'Bangalore', 'Chennai'],
  },
  {
    name: 'Study Table with Shelves',
    description: 'Ergonomic study table with built-in shelves and cable management. Ideal for students and work-from-home professionals.',
    category: 'Furniture', subcategory: 'Table',
    images: ['https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=600','https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600'],
    monthlyRent: 499, securityDeposit: 999,
    tenureOptions: [{ months: 1, discountPercent: 0 }, { months: 3, discountPercent: 5 }, { months: 6, discountPercent: 10 }],
    brand: 'DeskMaster', condition: 'New', availableQuantity: 15, totalQuantity: 15,
    features: ['Cable management', '3 shelves', 'Drawer included', 'Anti-scratch surface'],
    color: 'Oak White', serviceAreas: ['Hyderabad', 'Pune', 'Delhi'],
  },
  {
    name: '4-Door Wardrobe with Mirror',
    description: 'Spacious 4-door wardrobe with full-length mirror, multiple compartments and hanging space.',
    category: 'Furniture', subcategory: 'Wardrobe',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600','https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=600'],
    monthlyRent: 1500, securityDeposit: 3000,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 8 }, { months: 12, discountPercent: 15 }],
    brand: 'SpaceMax', condition: 'New', availableQuantity: 6, totalQuantity: 6,
    features: ['Full-length mirror', 'Soft-close hinges', 'Anti-rust handles', '4 drawers'],
    color: 'White', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai', 'Chennai'],
  },
  {
    name: 'Double Door Refrigerator 350L',
    description: '350L frost-free double door refrigerator with inverter compressor, energy saving 5-star rating.',
    category: 'Appliances', subcategory: 'Refrigerator',
    images: ['https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=600','https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=600'],
    monthlyRent: 1299, securityDeposit: 2598,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 10 }],
    brand: 'Samsung', condition: 'Like New', availableQuantity: 10, totalQuantity: 10,
    features: ['5-star energy rating', 'Frost Free', 'Inverter Compressor', 'Deodorizer'],
    color: 'Silver', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai'],
  },
  {
    name: 'Front Load Washing Machine 7kg',
    description: 'Fully automatic front load washing machine with multiple wash programs and quick wash feature.',
    category: 'Appliances', subcategory: 'Washing Machine',
    images: ['https://images.unsplash.com/photo-1626806787461-102c1bfaaea1?w=600','https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=600'],
    monthlyRent: 999, securityDeposit: 1998,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 12 }],
    brand: 'LG', condition: 'Like New', availableQuantity: 12, totalQuantity: 12,
    features: ['7kg capacity', '15 wash programs', 'Quick wash 15 min', 'Child lock'],
    color: 'White', serviceAreas: ['Hyderabad', 'Bangalore', 'Chennai', 'Pune'],
  },
  {
    name: '55" 4K Smart LED TV',
    description: '55 inch 4K Ultra HD Smart TV with Android OS, built-in streaming apps and Dolby Audio.',
    category: 'Electronics', subcategory: 'TV',
    images: ['https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600','https://images.unsplash.com/photo-1461151304267-38535e780c79?w=600'],
    monthlyRent: 1599, securityDeposit: 3198,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 10 }],
    brand: 'Sony', condition: 'New', availableQuantity: 7, totalQuantity: 7,
    features: ['4K Ultra HD', 'Android 11', 'Dolby Audio', 'Netflix/Prime built-in', 'Voice control'],
    color: 'Black', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai', 'Delhi'],
  },
  {
    name: '1.5 Ton 5-Star Split AC',
    description: '1.5 ton inverter split AC with 5-star energy rating, Wi-Fi control and auto-clean function.',
    category: 'Appliances', subcategory: 'AC',
    images: ['https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600','https://images.unsplash.com/photo-1631567091765-75ae2a0a7427?w=600'],
    monthlyRent: 1799, securityDeposit: 3598,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 10 }],
    brand: 'Daikin', condition: 'New', availableQuantity: 9, totalQuantity: 9,
    features: ['5-star inverter', 'Wi-Fi enabled', 'Auto clean', 'PM 2.5 filter', 'Sleep mode'],
    color: 'White', serviceAreas: ['Hyderabad', 'Bangalore', 'Chennai'],
  },
  {
    name: 'Office Chair Ergonomic',
    description: 'Fully ergonomic office chair with lumbar support, adjustable armrests and breathable mesh back.',
    category: 'Furniture', subcategory: 'Chair',
    images: ['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600','https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600'],
    monthlyRent: 599, securityDeposit: 1199,
    tenureOptions: [{ months: 1, discountPercent: 0 }, { months: 3, discountPercent: 5 }, { months: 6, discountPercent: 10 }],
    brand: 'ErgoWork', condition: 'New', availableQuantity: 20, totalQuantity: 20,
    features: ['Lumbar support', 'Adjustable height', 'Mesh back', '360° swivel', 'Weight capacity 120kg'],
    color: 'Black', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi'],
  },
  {
    name: 'Microwave Oven 28L Convection',
    description: '28L convection microwave with 300+ auto-cook menus, grill and bake functions.',
    category: 'Appliances', subcategory: 'Microwave',
    images: ['https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=600','https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=600'],
    monthlyRent: 699, securityDeposit: 1398,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 5 }, { months: 12, discountPercent: 10 }],
    brand: 'IFB', condition: 'Like New', availableQuantity: 14, totalQuantity: 14,
    features: ['28L capacity', 'Convection + Grill', '300+ menus', 'Child lock', 'Steam clean'],
    color: 'Black', serviceAreas: ['Hyderabad', 'Bangalore', 'Chennai', 'Mumbai'],
  },
  {
    name: 'Single Bed with Mattress',
    description: 'Comfortable single bed with 6-inch memory foam mattress, ideal for students and solo living.',
    category: 'Furniture', subcategory: 'Bed',
    images: ['https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600','https://images.unsplash.com/photo-1588046130717-0eb0c9a3ba15?w=600'],
    monthlyRent: 799, securityDeposit: 1599,
    tenureOptions: [{ months: 1, discountPercent: 0 }, { months: 3, discountPercent: 5 }, { months: 6, discountPercent: 10 }, { months: 12, discountPercent: 15 }],
    brand: 'SleepWell', condition: 'New', availableQuantity: 18, totalQuantity: 18,
    features: ['6-inch memory foam', 'Orthopedic support', 'Anti-dustmite cover', 'Easy assembly'],
    color: 'Brown', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai', 'Pune', 'Delhi', 'Chennai'],
  },
  {
    name: 'Dining Table Set (4 Seater)',
    description: 'Solid wood 4-seater dining table set with cushioned chairs. Elegant design for small apartments.',
    category: 'Furniture', subcategory: 'Table',
    images: ['https://images.unsplash.com/photo-1617098900591-3f90928e8c54?w=600','https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600'],
    monthlyRent: 1099, securityDeposit: 2198,
    tenureOptions: [{ months: 3, discountPercent: 0 }, { months: 6, discountPercent: 8 }, { months: 12, discountPercent: 12 }],
    brand: 'DineCraft', condition: 'New', availableQuantity: 7, totalQuantity: 7,
    features: ['Solid Sheesham wood', 'Cushioned chairs', 'Scratch resistant', 'Easy to assemble'],
    color: 'Natural Wood', serviceAreas: ['Hyderabad', 'Bangalore', 'Mumbai'],
  },
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  await Product.deleteMany({});
  await User.deleteMany({});

  await Product.insertMany(products);
  console.log('✅ Products seeded');

  await User.create({
    name: 'Admin User',
    email: 'admin@rentnest.com',
    password: 'Admin@123',
    role: 'admin',
    phone: '9999999999',
  });
  await User.create({
    name: 'Test User',
    email: 'user@rentnest.com',
    password: 'User@123',
    role: 'user',
    phone: '8888888888',
  });
  console.log('✅ Users seeded');
  console.log('Admin: admin@rentnest.com / Admin@123');
  console.log('User:  user@rentnest.com  / User@123');
  process.exit();
};

seedDB().catch((e) => { console.error(e); process.exit(1); });
