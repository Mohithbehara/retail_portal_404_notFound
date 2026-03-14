import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Product.css";

const MOCK_PRODUCTS = [
  {
    id: 1,
    title: "Margherita Pizza",
    price: "299",
    category: "Pizza",
    icon: "🍕",
  },
  { id: 2, title: "Coca Cola", price: "45", category: "Drinks", icon: "🥤" },
  { id: 3, title: "Garlic Bread", price: "99", category: "Breads", icon: "🥖" },
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
];

// Added onRemoveFromCart and cart props
const ProductList = ({ onAddToCart, onRemoveFromCart, cart }) => {
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(4); // Lazy loading state
  const [filter, setFilter] = useState("All");

  const filteredProducts = MOCK_PRODUCTS.filter(
    (p) => filter === "All" || p.category === filter,
  );

  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

  return (
    <div className="product-section">
      <div className="category-bar">
        {["All", "Pizza", "Drinks", "Breads"].map((cat) => (
          <div
            key={cat}
            className={`category-chip ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </div>
        ))}
      </div>

      <div className="product-grid">
        {filteredProducts.slice(0, visibleCount).map((product) => {
          // Check if product exists in cart to get current quantity
          const cartItem = cart.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.icon}</div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-price">₹{product.price}</p>

                <div className="action-btns">
                  {/* QUANTITY LOGIC: Show +/- if in cart, otherwise show Add to Cart */}
                  {quantity === 0 ? (
                    <button
                      className="btn-add"
                      onClick={() => onAddToCart(product)}
                    >
                      Add to Cart
                    </button>
                  ) : (
                    <div className="quantity-controls-main">
                      <button
                        className="qty-btn-main"
                        onClick={() => onRemoveFromCart(product.id)}
                      >
                        -
                      </button>
                      <span className="qty-display">{quantity}</span>
                      <button
                        className="qty-btn-main"
                        onClick={() => onAddToCart(product)}
                      >
                        +
                      </button>
                    </div>
                  )}

                  {/* ROLE BASED MODEL: Admin Controls */}
                  {user?.role === "Admin" && (
                    <div className="admin-actions">
                      <button
                        className="btn-admin"
                        onClick={() => alert("Edit Mode")}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-admin del"
                        onClick={() => alert("Delete")}
                      >
                        Del
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {visibleCount < filteredProducts.length && (
        <div className="load-more-container">
          <button className="signup-btn" onClick={handleLoadMore}>
            Load More Products
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductList;
