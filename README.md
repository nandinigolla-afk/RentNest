# 🏠 RentNest – Furniture & Appliance Rental Platform

> A full-stack web application for renting premium furniture and appliances on monthly plans.

---

## 🚀 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, React Router v6, Context API |
| Styling | Custom CSS3 with CSS Variables, Animations |
| Backend | Node.js, Express.js, REST API |
| Database | MongoDB with Mongoose ODM |
| Auth | JWT (JSON Web Tokens) + bcryptjs |
| HTTP Client | Axios |
| Notifications | react-hot-toast |

---

## 📁 Project Structure

```
rentnest/
├── backend/
│   ├── config/          # Database connection
│   ├── controllers/     # Business logic (auth, products, orders, cart, maintenance, admin)
│   ├── middleware/      # Auth guard, error handler
│   ├── models/          # Mongoose schemas (User, Product, Order, Cart, Maintenance)
│   ├── routes/          # Express route definitions
│   ├── uploads/         # File upload storage
│   ├── seed.js          # Database seeder with 12 sample products
│   ├── server.js        # Express app entry point
│   └── .env             # Environment variables
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── admin/      # AdminProducts, AdminOrders, AdminUsers, AdminMaintenance
│       │   ├── layout/     # Navbar, Footer
│       │   └── products/   # ProductCard
│       ├── context/        # AuthContext, CartContext
│       ├── pages/          # All page components
│       ├── styles/         # Global CSS with design tokens & animations
│       └── utils/          # Axios instance
└── README.md
```

---

## ⚙️ Setup & Installation

### Prerequisites
- Node.js v18+
- MongoDB (local) or MongoDB Atlas connection string
- npm or yarn

### 1. Clone / Extract the project
```bash
cd rentnest
```

### 2. Backend Setup
```bash
cd backend
npm install

# Edit .env with your MongoDB URI
# MONGO_URI=mongodb://localhost:27017/rentnest
# JWT_SECRET=your_secret_key

npm run seed        # Seeds 12 products + 2 users
npm run dev         # Starts backend on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start           # Starts React on http://localhost:3000
```

---

## 🔐 Demo Credentials

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@rentnest.com | Admin@123 |
| **User** | user@rentnest.com | User@123 |

---

## 🌐 API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |
| PUT | `/api/auth/update-profile` | Update profile |
| PUT | `/api/auth/change-password` | Change password |

### Products
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/products` | List products (filterable) |
| GET | `/api/products/:id` | Get product detail |
| POST | `/api/products` | Create product (admin) |
| PUT | `/api/products/:id` | Update product (admin) |
| DELETE | `/api/products/:id` | Delete product (admin) |
| POST | `/api/products/:id/review` | Add review |

### Cart
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/cart` | Get cart |
| POST | `/api/cart/add` | Add to cart |
| PUT | `/api/cart/:productId` | Update tenure |
| DELETE | `/api/cart/:productId` | Remove item |
| DELETE | `/api/cart/clear` | Clear cart |

### Orders
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/orders` | Create order |
| GET | `/api/orders/my-orders` | My orders |
| GET | `/api/orders/:id` | Order detail |
| PUT | `/api/orders/:id/status` | Update status (admin) |
| PUT | `/api/orders/:id/request-return` | Request return |

### Maintenance
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/maintenance` | Submit request |
| GET | `/api/maintenance/my-requests` | My requests |
| GET | `/api/maintenance` | All requests (admin) |
| PUT | `/api/maintenance/:id` | Update request (admin) |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/users` | All users |
| PUT | `/api/admin/users/:id` | Update user |

---

## ✨ Features

### User Features
- 🔐 JWT Authentication (Register/Login with animated sliding panel)
- 🛋️ Product catalog with category filters, search, and sort
- 📄 Detailed product pages with image gallery, tenure selector, pricing breakdown
- 🛒 Cart with tenure selection and checkout
- 📦 Order tracking with status history timeline
- 👤 Profile management with address book
- 🔧 Maintenance request system
- ❤️ Product wishlist (UI)

### Admin Features
- 📊 Dashboard with KPIs, recent orders, category breakdown
- 🛋️ Full product CRUD (create, edit, delete)
- 📦 Order management with status updates
- 👥 User management (activate/deactivate, role changes)
- 🔧 Maintenance request handling with technician notes

### Design & UX
- 🎨 Purple-gradient premium design system
- ✨ Smooth card hover animations, page transitions
- 📱 Fully responsive (mobile-first)
- ⚡ Skeleton loading states
- 🔔 Toast notifications
- 🌗 Animated sign-in/sign-up sliding panel

---

## 📦 Seeded Products (12 total)
- King Size Bed with Storage
- 3-Seater Fabric Sofa
- Study Table with Shelves
- 4-Door Wardrobe with Mirror
- Double Door Refrigerator 350L
- Front Load Washing Machine 7kg
- 55" 4K Smart LED TV
- 1.5 Ton 5-Star Split AC
- Office Chair Ergonomic
- Microwave Oven 28L Convection
- Single Bed with Mattress
- Dining Table Set (4 Seater)

---

## 🔮 Future Enhancements
- [ ] Mobile app (React Native)
- [ ] Razorpay / Stripe payment integration
- [ ] Real-time order tracking
- [ ] SMS/Email notifications
- [ ] Subscription bundles
- [ ] Smart appliance IoT tracking
