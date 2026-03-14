# 🛒 Retail Portal — Backend API

> Inventory & Shopping Cart System built with **Node.js**, **Express**, **MongoDB**, **JWT**, **Nodemailer**, and **Cloudinary**

---

## 📁 Project Structure

```
backend/
├── config/
│   ├── cloudinary.js          # Cloudinary SDK config
│   ├── db.js                  # MongoDB connection setup
│   ├── env.js                 # Centralized environment variables
│   └── nodemailer.js          # Nodemailer transporter config
├── controllers/
│   ├── authController.js      # Register & Login logic
│   ├── cartController.js      # Cart CRUD operations
│   ├── categoryController.js  # Category management
│   └── productController.js   # Product CRUD, search & pagination
├── middleware/
│   ├── adminMiddleware.js     # Admin role guard
│   ├── authMiddleware.js      # JWT token verification
│   └── upload.js              # Multer + Cloudinary image upload
├── models/
│   ├── Cart.js                # Cart schema
│   ├── Category.js            # Category schema
│   ├── Product.js             # Product schema
│   └── User.js                # User schema (with password hashing)
├── routes/
│   ├── authRoutes.js          # /api/auth/*
│   ├── cartRoutes.js          # /api/cart/*
│   ├── categoryRoutes.js      # /api/categories/*
│   └── productRoutes.js       # /api/products/*
├── services/
│   ├── email-template.js      # HTML email templates
│   └── send-email.js          # Email sending functions
├── .env.example               # Environment variable template
├── .gitignore
├── createAdmin.js             # Admin user seed script
├── package.json
├── server.js                  # App entry point
└── README.md
```

---

## ⚙️ Setup & Installation

### 1. Install dependencies

```bash
cd backend
npm install
```

### 2. Configure environment variables

Copy the template and fill in your values:

```bash
cp .env.example .env
```

`.env` file:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/retail-portal
JWT_SECRET=your_jwt_secret_key
EMAIL=yourgmail@gmail.com
EMAIL_PASS=your_gmail_app_password
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

> **Note:** For `EMAIL_PASS`, use a [Gmail App Password](https://support.google.com/accounts/answer/185833), not your regular password.

### 3. Start the server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: **http://localhost:5000**

### 4. Seed an admin user (optional)

```bash
node createAdmin.js
```

This creates an admin with:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

---

## 🔑 Authentication

All protected routes require a **Bearer token** in the `Authorization` header:

```
Authorization: Bearer <your_jwt_token>
```

Get your token by calling the **Login** endpoint.

---

## 📡 API Endpoints

### Base URL: `http://localhost:5000/api`

---

### 🔐 Auth — `/api/auth`

#### `POST /api/auth/register` — Register a new user

**Body:**
```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "123456"
}
```

**Response** `201`:
```json
{
  "message": "User registered successfully"
}
```

> A welcome email is automatically sent via Nodemailer.

---

#### `POST /api/auth/login` — Login and get JWT token

**Body:**
```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

**Response** `200`:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

### 📂 Categories — `/api/categories`

#### `POST /api/categories` — Create category *(Admin only)*

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "name": "Burgers",
  "description": "All burger items"
}
```

**Response** `201`:
```json
{
  "_id": "...",
  "name": "Burgers",
  "description": "All burger items",
  "createdAt": "2026-03-14T..."
}
```

---

#### `GET /api/categories` — Get all categories

**Response** `200`:
```json
[
  {
    "_id": "...",
    "name": "Burgers",
    "description": "All burger items",
    "createdAt": "2026-03-14T..."
  }
]
```

---

### 📦 Products — `/api/products`

#### `POST /api/products` — Create product *(Admin only)*

**Headers:** `Authorization: Bearer <token>`

**Content-Type:** `multipart/form-data` (for image upload) or `application/json`

**Body (form-data):**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | text | ✅ | Product name |
| description | text | ❌ | Product description |
| price | text | ✅ | Product price |
| stock | text | ❌ | Stock quantity (default: 0) |
| category | text | ✅ | Category ID |
| image | file | ❌ | Product image (jpg/png/webp) |

> **Image upload:** Send an image file in the `image` field — it will be automatically uploaded to Cloudinary and the URL stored as `imageUrl`. Alternatively, pass `imageUrl` as text with a direct URL.

**Response** `201`: Returns the created product object with `imageUrl` from Cloudinary.

---

#### `GET /api/products` — Get all products *(Paginated & Filterable)*

**Query params:** 
- `?page=1&limit=10`
- `?category=CATEGORY_ID` (Filter by a specific category)

**Response** `200`:
```json
{
  "products": [ ... ],
  "currentPage": 1,
  "totalPages": 3,
  "totalProducts": 25
}
```

---

#### `GET /api/products/search` — Search products by name

**Query params:** `?name=burger`

**Response** `200`:
```json
[
  {
    "_id": "...",
    "name": "Veg Burger",
    "price": 120,
    "category": { "_id": "...", "name": "Burgers" }
  }
]
```

---

#### `GET /api/products/:id` — Get product by ID

**Response** `200`: Returns a single product with populated category.

---

#### `PUT /api/products/:id/stock` — Update product stock *(Admin only)*

**Headers:** `Authorization: Bearer <token>`

**Body:**
```json
{
  "stock": 15
}
```

**Response** `200`: Returns the updated product.

---

### 🛒 Cart — `/api/cart` *(All routes require auth)*

**Headers for all cart routes:** `Authorization: Bearer <token>`

---

#### `POST /api/cart/add` — Add item to cart

**Body:**
```json
{
  "productId": "<productId>",
  "quantity": 2
}
```

**Response** `200`: Returns the updated cart with items and total price.

---

#### `GET /api/cart` — Get user's cart

**Response** `200`:
```json
{
  "_id": "...",
  "user": "...",
  "items": [
    {
      "product": { "_id": "...", "name": "Veg Burger", "price": 120 },
      "quantity": 2
    }
  ],
  "totalPrice": 240
}
```

---

#### `PUT /api/cart/update` — Update cart item quantity

**Body:**
```json
{
  "productId": "<productId>",
  "quantity": 3
}
```

**Response** `200`: Returns the updated cart.

---

#### `DELETE /api/cart/remove/:productId` — Remove item from cart

**Response** `200`: Returns the updated cart.

---

### 📦 Orders — `/api/orders` *(Auth required)*

#### `POST /api/orders` — Place a "Cash on Delivery" order
**Body:**
```json
{
  "shippingAddress": "123 Street, City, Country"
}
```
**Response** `201`:
```json
{
  "message": "Order placed successfully",
  "order": { ... }
}
```
> Email notifications are sent to the customer (confirmation) and admin (new order/low stock).

#### `GET /api/orders` — Get user's order history
**Response** `200`: Returns an array of user's past orders.

---

## 🧪 Postman Testing Flow

Test the APIs in this recommended order:

| Step | Method | Endpoint | Notes |
|------|--------|----------|-------|
| 1 | POST | `/api/auth/register` | Register a new user |
| 2 | POST | `/api/auth/login` | Get JWT token |
| 3 | POST | `/api/categories` | Create category *(use admin token)* |
| 4 | POST | `/api/products` | Create product *(use admin token)* |
| 5 | GET | `/api/products` | List all products |
| 6 | GET | `/api/products/search?name=burger` | Search products |
| 7 | POST | `/api/cart/add` | Add item to cart |
| 8 | GET | `/api/cart` | View cart |
| 9 | PUT | `/api/cart/update` | Update quantity |
| 10 | DELETE | `/api/cart/remove/:productId` | Remove item |

> **Tip:** After login, copy the `token` from the response and set it as `Bearer <token>` in the Authorization header for all subsequent requests.

---

## 📊 Database Schemas

### User
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| email | String | Required, unique |
| password | String | Hashed with bcrypt |
| role | String | `"user"` or `"admin"`, default: `"user"` |
| createdAt | Date | Auto-generated |

### Category
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required, unique |
| description | String | Optional |
| createdAt | Date | Auto-generated |

### Product
| Field | Type | Notes |
|-------|------|-------|
| name | String | Required |
| description | String | Optional |
| price | Number | Required, min: 0 |
| stock | Number | Required, min: 0 |
| imageUrl | String | Optional, Cloudinary URL |
| category | ObjectId | Ref → Category |
| createdAt | Date | Auto-generated |

### Cart
| Field | Type | Notes |
|-------|------|-------|
| user | ObjectId | Ref → User, unique |
| items | Array | `[{ product: ObjectId, quantity: Number }]` |
| totalPrice | Number | Auto-calculated |
| createdAt | Date | Auto-generated |

---

## 🛡️ Error Responses

All endpoints return errors in a consistent format:

```json
{
  "message": "Error description here"
}
```

| Status | Meaning |
|--------|---------|
| `400` | Bad request / validation error |
| `401` | Unauthorized (missing or invalid token) |
| `403` | Forbidden (admin access required) |
| `404` | Resource not found |
| `500` | Server error |

---

## 🚀 CI/CD & Deployment

### GitHub Actions
The project includes automated CI workflows located in `.github/workflows/`:
- **Backend CI**: Runs on every push to `backend/**`. Includes dependency installation and build verification.

### Deployment
- **Backend (Render)**: Deployed as a Web Service.
- **Frontend (Vercel)**: Deployed as a Static Site.
For detailed steps, refer to `deployment_guide.md` in the root (if available) or repository documentation.

## 👥 Team — 404 Not Found

Built for the **HCL Hackathon**
