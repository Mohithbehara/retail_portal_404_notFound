import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Product.css";

const ProductList = ({
  products,
  categories,
  onAddCategory,
  onAddProduct,
  onDeleteProduct,
  onEditProduct,
  onAddToCart,
  onRemoveFromCart,
  cart,
}) => {
  const { user } = useAuth();
  const [visibleCount, setVisibleCount] = useState(4);
  const [filter, setFilter] = useState("All");

  const filteredProducts = products.filter(
    (p) => filter === "All" || p.category === filter,
  );

  const handleLoadMore = () => setVisibleCount((prev) => prev + 4);

  return (
    <div className="product-section">
      <div className="category-bar">
        {categories.map((cat) => (
          <div
            key={cat}
            className={`category-chip ${filter === cat ? "active" : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat}
          </div>
        ))}
        {/* Admin Category Add Button */}
        {user?.role === "Admin" && (
          <button className="add-cat-btn" onClick={onAddCategory}>
            +
          </button>
        )}
      </div>

      <div className="product-grid">
        {/* Admin "Add Product" placeholder shown at the start */}
        {user?.role === "Admin" && (
          <div className="product-card admin-add-card" onClick={onAddProduct}>
            <div className="admin-add-icon">+</div>
            <p>Add New Product</p>
          </div>
        )}

        {filteredProducts.slice(0, visibleCount).map((product) => {
          const cartItem = cart.find((item) => item.id === product.id);
          const quantity = cartItem ? cartItem.quantity : 0;

          return (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.icon}</div>
              <div className="product-info">
                <h3>{product.title}</h3>
                <p className="product-price">₹{product.price}</p>

                <div className="action-btns">
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

                  {/* Functional Admin Actions */}
                  {user?.role === "Admin" && (
                    <div className="admin-actions">
                      <button
                        className="btn-admin"
                        onClick={() => onEditProduct(product.id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn-admin del"
                        onClick={() => onDeleteProduct(product.id)}
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
