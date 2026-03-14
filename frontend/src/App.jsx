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

  const openAuth = (mode) => {
    setAuthMode(mode);
    setShowAuth(true);
  };

  const handleCheckout = () => {
    if (!user) {
      // If user is not logged in: Close cart and open Login popup
      setIsCartOpen(false);
      openAuth("login");
      alert("Please login to proceed with checkout");
    } else {
      // If user is logged in: Simulate order placement
      alert(`Order Placed Successfully for ${user.email}!`);
      setCart([]); // Clear the cart after success
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

  // Calculate Total Price
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
                Welcome, <strong>{user.email.split("@")[0]}</strong> (
                {user.role})
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
              cart.map((item) => {
                const lineTotal = (
                  parseFloat(item.price) * item.quantity
                ).toFixed(2);

                return (
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
                        ₹{lineTotal}
                        <span
                          style={{
                            color: "#999",
                            fontWeight: "normal",
                            marginLeft: "5px",
                          }}
                        >
                          (₹{item.price} x {item.quantity})
                        </span>
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
                      <span
                        style={{
                          fontWeight: "bold",
                          minWidth: "20px",
                          textAlign: "center",
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        className="qty-btn"
                        onClick={() => addToCart(item)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })
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
