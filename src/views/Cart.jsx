
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useMemo } from "react";
import "./Cart.css"; // Ensure this matches your file naming!

function Cart() {
  const navigate = useNavigate();

  // 1. Destructured the correct matching keys from your actual CartContext
  const { cart, addToCart, removeFromCart } = useCart();

  // 2. Safely compute the dynamic subtotal live from your basket array data
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  }, [cart]);

  // 3. Custom item quantity decrement handler
  const handleDecreaseQuantity = (item) => {
    if (item.quantity > 1) {
      // Simulate quantity reduction by subtracting an isolated item instance
      removeFromCart(item.id);
      for (let i = 0; i < item.quantity - 1; i++) {
        addToCart(item);
      }
    } else {
      removeFromCart(item.id);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="empty-cart-container">
        <h1>
          YOUR BAG
          <br />
          <span>IS EMPTY.</span>
        </h1>
        <p>Curate your wardrobe with our essential seasonal elements.</p>
        <button className="luxury-action-btn" onClick={() => navigate("/shop")}>
          CONTINUE SHOPPING →
        </button>
      </div>
    );
  }

  return (
    <div className="cart-page-wrapper">
      <header className="cart-page-header">
        <button className="minimal-back-btn" onClick={() => navigate("/shop")}>
          ← CONTINUE SHOPPING
        </button>
        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          ORVEX <span>STUDIO</span>
        </div>
      </header>

      <h1 className="cart-title-main">YOUR BAG.</h1>

      <main className="cart-main-layout">
        {/* LEFT COLUMN - LIST OF ITEMS */}
        <section className="cart-items-section">
          {cart.map((item) => (
            <article className="cart-item-card" key={item.id}>
              <div className="cart-img-box">
                <img src={item.image} alt={item.displayName || item.title} />
              </div>

              <div className="cart-item-details">
                <div className="item-meta-top">
                  <h2>{item.displayName || item.title}</h2>
                  <span className="item-price-tag">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
                <p className="item-unit-cost">${item.price.toFixed(2)} each</p>

                <div className="item-actions-row">
                  {/* Quantity Control Buttons */}
                  <div className="cart-quantity-selector">
                    <button onClick={() => handleDecreaseQuantity(item)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addToCart(item)}>+</button>
                  </div>

                  <button className="cart-remove-inline-btn" onClick={() => removeFromCart(item.id)}>
                    REMOVE
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>

        {/* RIGHT COLUMN - SUMMARY MODIFIER PANEL */}
        <aside className="cart-summary-sidebar">
          <h2>SUMMARY</h2>
          <div className="summary-divider"></div>
          
          <div className="summary-data-row">
            <span>SUBTOTAL</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>
          <div className="summary-data-row">
            <span>SHIPPING</span>
            <span className="shipping-status-txt">COMPLIMENTARY</span>
          </div>
          
          <div className="summary-divider-thick"></div>
          
          <div className="summary-data-row total-row">
            <span>ESTIMATED TOTAL</span>
            <strong>${cartTotal.toFixed(2)}</strong>
          </div>

          <button className="luxury-checkout-btn" onClick={() => navigate("/checkout")}>
            PROCEED TO CHECKOUT <span>→</span>
          </button>
        </aside>
      </main>
    </div>
  );
}

export default Cart;
