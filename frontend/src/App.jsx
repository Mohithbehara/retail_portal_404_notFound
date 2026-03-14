import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Auth from "./components/Auth";
import ProductList from "./components/ProductList";
import "./App.css";

const HomePage = () => {
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const { user, logout } = useAuth();

  // --- ADMIN STATE & LOGIC ---
  const [categories, setCategories] = useState([
    "All",
    "Pizza",
    "Drinks",
    "Breads",
  ]);

  const [products, setProducts] = useState([
    {
      id: 1,
      title: "Margherita Pizza",
      price: "299",
      category: "Pizza",
      icon: "🍕",
    },
    { id: 2, title: "Coca Cola", price: "45", category: "Drinks", icon: "🥤" },
    {
      id: 3,
      title: "Garlic Bread",
      price: "99",
      category: "Breads",
      icon: "🥖",
    },
    {
      id: 4,
      title: "Pepperoni Feast",
      price: "499",
      category: "Pizza",
      icon: "🍕",
    },
    { id: 5, title: "Iced Tea", price: "60", category: "Drinks", icon: "🍹" },
    {
      id: 6,
      title: "Cheese Sticks",
      price: "120",
      category: "Breads",
      icon: "🧀",
    },
  ]);

  const addCategory = () => {
    const name = prompt("Enter new category name:");
    if (name && !categories.includes(name)) {
      setCategories([...categories, name]);
    }
  };

  const addProduct = () => {
    const title = prompt("Product Name:");
    const price = prompt("Price (INR):");
    const category = prompt("Category (e.g. Pizza, Drinks):", "Pizza");
    if (title && price) {
      const newProduct = {
        id: Date.now(),
        title,
        price,
        category,
        icon: "📦",
      };
      setProducts([newProduct, ...products]);
    }
  };

  const deleteProduct = (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      setCart(cart.filter((item) => item.id !== id));
    }
  };

  const editProduct = (id) => {
    const product = products.find((p) => p.id === id);
    const newTitle = prompt("Edit Title:", product.title);
    const newPrice = prompt("Edit Price:", product.price);
    if (newTitle && newPrice) {
      setProducts(
        products.map((p) =>
          p.id === id ? { ...p, title: newTitle, price: newPrice } : p,
        ),
      );
    }
  };

  // --- AUTH & CART LOGIC ---
  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleCheckout = () => {
    if (!user) {
      setIsCartOpen(false);
      openAuth("login");
      alert("Please login to proceed with checkout");
    } else {
      // Safely access email or fallback to 'User'
      const displayName = user?.email || "Valued Customer";
      alert(`Order Placed Successfully for ${displayName}!`);
      setCart([]);
      setIsCartOpen(false);
    }
  };

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === productId);
      if (!existingItem) return prevCart;
      if (existingItem.quantity === 1) {
        return prevCart.filter((item) => item.id !== productId);
      }
      return prevCart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity - 1 } : item,
      );
    });
  };

  const totalPrice = cart
    .reduce((acc, item) => acc + parseFloat(item.price) * item.quantity, 0)
    .toFixed(2);

  return (
    <div className="home-container">
      {/* Navigation */}
      <nav className="navbar">
        <div className="logo">RETAIL PORTAL</div>
        <div className="nav-btns">
          {!user ? (
            <>
              <button className="login-btn" onClick={() => openAuth("login")}>
                Login
              </button>
              <button className="signup-btn" onClick={() => openAuth("signup")}>
                Sign Up
              </button>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <span>
                Welcome,{" "}
                <strong>
                  {/* Safely handle cases where email might be missing */}
                  {user?.email ? user.email.split("@")[0] : "Admin"}
                </strong>{" "}
                ({user?.role})
              </span>
              <button className="login-btn" onClick={logout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Product Listing */}
      <ProductList
        products={products}
        categories={categories}
        onAddCategory={addCategory}
        onAddProduct={addProduct}
        onDeleteProduct={deleteProduct}
        onEditProduct={editProduct}
        onAddToCart={addToCart}
        onRemoveFromCart={removeFromCart}
        cart={cart}
      />

      {/* Floating Cart Button */}
      <button className="cart-fab" onClick={() => setIsCartOpen(!isCartOpen)}>
        🛒
        {cart.length > 0 && (
          <span className="cart-count">
            {cart.reduce((sum, item) => sum + item.quantity, 0)}
          </span>
        )}
      </button>

      {/* Cart Popup Modal */}
      {isCartOpen && (
        <div className="cart-modal">
          <div className="cart-header">
            <span>Your Order</span>
            <button onClick={() => setIsCartOpen(false)} className="close-cart">
              ✕
            </button>
          </div>
          <div className="cart-items">
            {cart.length === 0 ? (
              <p
                style={{
                  textAlign: "center",
                  color: "#999",
                  marginTop: "20px",
                }}
              >
                Cart is empty
              </p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="cart-item"
                  style={{ alignItems: "center", marginBottom: "15px" }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "600" }}>
                      {item.icon} {item.title}
                    </div>
                    <div
                      style={{
                        fontSize: "0.85rem",
                        color: "#ff8200",
                        fontWeight: "bold",
                      }}
                    >
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
                  <div
                    className="quantity-controls"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                    }}
                  >
                    <button
                      className="qty-btn"
                      onClick={() => removeFromCart(item.id)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button className="qty-btn" onClick={() => addToCart(item)}>
                      +
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
          <div className="cart-footer">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "10px",
              }}
            >
              <strong>Total:</strong>
              <strong style={{ fontSize: "1.2rem", color: "#ff8200" }}>
                ₹{totalPrice}
              </strong>
            </div>
            <button className="checkout-btn" onClick={handleCheckout}>
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Auth Modal Overlay */}
      {showAuth && !user && (
        <div className="modal-overlay" onClick={() => setShowAuth(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-modal" onClick={() => setShowAuth(false)}>
              &times;
            </button>
            <Auth initialMode={authMode} />
          </div>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <HomePage />
    </AuthProvider>
  );
}

export default App;
