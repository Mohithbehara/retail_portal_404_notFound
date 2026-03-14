# Retail Portal Frontend

A modern, responsive e-commerce frontend built with React, Vite, and Tailwind CSS.

## ✨ Features
- **Dynamic Shopping Experience**: Browse products with search and category filtering.
- **User Authentication**: Secure Login/Signup with persistent sessions.
- **Real-time Cart**: Add/remove items and adjust quantities with instant total calculation.
- **Smart Suggestions**: "Suggested Add-ons" in the cart based on your current items.
- **Checkout Flow**: Simple 1-click "Cash on Delivery" order placement.
- **Order History**: Track past orders and reorder items instantly.
- **Admin Dashboard**: Specialized UI for managing products, categories, and inventory.
- **Feedback**: Interactive toast notifications using `react-hot-toast`.

## 📁 Folder Structure
```text
frontend/
├── src/
│   ├── components/     # UI Components (Navbar, Product Cards, etc.)
│   ├── context/        # Auth and Cart state management (Context API)
│   ├── lib/            # Utility functions (Tailwind Merge, clsx)
│   ├── pages/          # Full page views (Home, Shop, Cart, Dashboard)
│   ├── services/       # Axios API instances and service wrappers
│   ├── App.jsx         # Main router and layout
│   └── main.jsx        # React entry point
├── public/             # Static assets
├── tailwind.config.js  # Styling configuration
├── vite.config.js      # Build tool configuration
└── .env                # API URL endpoint configuration
```

## 🔌 API Consumption (Services)
The frontend communicates with the backend via **Axios**. Key service wrappers include:
- `authService.js`: Registration & Login.
- `productService.js`: Fetching products with search, pagination, and category filters.
- `cartService.js`: Managing items in the persistent user cart.
- `orderService.js`: Placing orders and fetching order history.
- `categoryService.js`: Fetching product categories.


## 🛠️ Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Tailwind CSS & Lucide Icons
- **HTTP Client**: Axios
- **State**: React Context API
- **UI Components**: Radix UI (Headless components)

## 🛠️ Getting Started
1. Install dependencies: `npm install`
2. Set Environment Variable:
   - Create a `.env` file.
   - Add `VITE_API_URL=http://localhost:5000/api` (Local) or your production backend URL.
3. Run dev server: `npm run dev` (runs on http://localhost:3000).
4. Build for production: `npm run build`.

## 🚀 CI/CD & Deployment

### GitHub Actions
The project includes automated CI workflows located in `.github/workflows/`:
- **Frontend CI**: Runs on every push to `frontend/**`. Includes dependency installation and build verification.

### Deployment
- **Frontend (Vercel)**: Configured to deploy the `frontend` root directory with the Vite build command.
- **Environment Variables**: Requires `VITE_API_URL` pointing to the live backend.

## 👥 Team — 404 Not Found

Built for the **HCL Hackathon**
