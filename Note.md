# Inventory & Shopping Cart System

Hackathon Project built with **Node.js, Express, React, MongoDB, Postman, Nodemailer**

---

# Project Overview

This project is a simple **product catalog and inventory system with shopping cart functionality**.

Users can:

* Register and login
* Browse product categories
* View products
* Search products
* Add products to cart
* Update cart items
* Remove items from cart

Admins can:

* Create categories
* Create products
* Update product stock
* Manage inventory

---

# Tech Stack

Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication
* Nodemailer

Frontend

* React.js

Testing

* Postman

---

# Project Folder Structure

```
project-root
│
├── backend
│   ├── controllers
│   ├── models
│   ├── routes
│   ├── middleware
│   ├── services
│   │     emailService.js
│   ├── config
│   │     db.js
│   └── server.js
│
├── frontend
│   ├── components
│   ├── pages
│   ├── services
│   └── App.js
│
└── README.md
```

---

# Database Schemas

## User Schema

```javascript
{
  name: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user"
  },
  createdAt: Date
}
```

Example

```
{
 "name": "John",
 "email": "john@gmail.com",
 "password": "hashedpassword",
 "role": "user"
}
```

---

## Category Schema

```javascript
{
  name: String,
  description: String,
  createdAt: Date
}
```

Example

```
{
 "name": "Burgers",
 "description": "Burger items"
}
```

---

## Product Schema

```javascript
{
  name: String,
  description: String,
  price: Number,
  stock: Number,
  imageUrl: String,
  category: {
    type: ObjectId,
    ref: "Category"
  },
  createdAt: Date
}
```

Example

```
{
 "name": "Veg Burger",
 "description": "Grilled burger",
 "price": 120,
 "stock": 20,
 "category": "categoryId"
}
```

---

## Cart Schema

```javascript
{
  user: {
    type: ObjectId,
    ref: "User"
  },

  items: [
    {
      product: {
        type: ObjectId,
        ref: "Product"
      },
      quantity: Number
    }
  ],

  totalPrice: Number,
  createdAt: Date
}
```

---

# API Endpoints

Base URL

```
/api
```

---

# Authentication APIs

## Register User

POST

```
/api/auth/register
```

Request Body

```
{
 "name": "John",
 "email": "john@gmail.com",
 "password": "123456"
}
```

Response

```
{
 "message": "User registered successfully"
}
```

Email notification is sent using Nodemailer.

---

## Login

POST

```
/api/auth/login
```

Request Body

```
{
 "email": "john@gmail.com",
 "password": "123456"
}
```

Response

```
{
 "token": "jwt_token"
}
```

---

# Category APIs

## Create Category

POST

```
/api/categories
```

Body

```
{
 "name": "Burgers",
 "description": "All burger items"
}
```

Admin only endpoint.

---

## Get Categories

GET

```
/api/categories
```

---

# Product APIs

## Create Product

POST

```
/api/products
```

Body

```
{
 "name": "Veg Burger",
 "description": "Grilled burger",
 "price": 120,
 "stock": 20,
 "category": "categoryId"
}
```

Admin only endpoint.

---

## Get All Products

GET

```
/api/products
```

Query example

```
/api/products?page=1&limit=10
```

---

## Search Products

GET

```
/api/products/search?name=burger
```

---

## Get Product By ID

GET

```
/api/products/:id
```

---

## Update Product Stock

PUT

```
/api/products/:id/stock
```

Body

```
{
 "stock": 15
}
```

Admin only endpoint.

---

# Cart APIs

## Add Item To Cart

POST

```
/api/cart/add
```

Body

```
{
 "productId": "productId",
 "quantity": 2
}
```

---

## Get User Cart

GET

```
/api/cart
```

---

## Update Cart Item

PUT

```
/api/cart/update
```

Body

```
{
 "productId": "productId",
 "quantity": 3
}
```

---

## Remove Item From Cart

DELETE

```
/api/cart/remove/:productId
```

---

# Email Notifications

Emails are sent using Nodemailer.

Notifications:

* User registration
* Order confirmation (optional)
* Inventory updates (optional)

Example email

```
Subject: Welcome

Your account was created successfully.
```

---

# Environment Variables

Create `.env` file

```
PORT=5000

MONGO_URI=your_mongodb_connection

JWT_SECRET=your_secret_key

EMAIL=yourgmail@gmail.com
EMAIL_PASS=gmail_app_password
```

---

# Running the Backend

Install dependencies

```
npm install
```

Run server

```
npm run dev
```

Server

```
http://localhost:5000
```

---

# Frontend Setup

Inside frontend folder

```
npm install
npm start
```

Frontend runs at

```
http://localhost:3000
```

---

# Postman Testing Flow

Test APIs in this order

1 Register user
2 Login
3 Create category (admin)
4 Create product (admin)
5 Get products
6 Add item to cart
7 Update cart
8 Remove cart item

---

# How Admin Users Are Created

Do NOT allow users to choose admin role during signup.

Instead use one of these approaches.

### Method 1 (Recommended for Hackathon)

Create admin directly in database.

Example document in MongoDB:

```
{
 "name": "Admin",
 "email": "admin@gmail.com",
 "password": "hashedpassword",
 "role": "admin"
}
```

You can insert it using MongoDB Atlas or Mongo shell.

---

### Method 2

Create a script

```
node createAdmin.js
```

Example

```javascript
const User = require("./models/User");
const bcrypt = require("bcrypt");

async function createAdmin() {
 const password = await bcrypt.hash("admin123", 10);

 await User.create({
   name: "Admin",
   email: "admin@gmail.com",
   password: password,
   role: "admin"
 });

 console.log("Admin created");
}

createAdmin();
```

---

# Admin Middleware

Protect admin routes.

Example

```javascript
function isAdmin(req, res, next) {
 if (req.user.role !== "admin") {
   return res.status(403).json({ message: "Access denied" });
 }
 next();
}
```

Usage

```
router.post("/products", authMiddleware, isAdmin, createProduct)
```

---

# Suggested Team Work Split

Backend Developer

* Database schemas
* Authentication
* Product and category APIs
* Cart APIs
* Email service

Frontend Developer

* React UI
* Product listing page
* Category filter
* Cart UI
* Login and signup pages

Integration and Testing

* Postman collection
* API testing
* Deployment
* README and documentation

---

# Demo Flow

1 Register user
2 Login
3 Browse categories
4 View products
5 Add product to cart
6 Update cart
7 Receive welcome email

---

