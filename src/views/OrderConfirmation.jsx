import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo } from "react";
import { useCart } from "../context/CartContext";
import "./OrderConfirmation.css";

function OrderConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearCart } = useCart();

  // Retrieve user shipping info passed from the checkout process state
  const shippingInfo = location.state?.shippingInfo || {
    firstName: "Valued",
    lastName: "Client",
    address: "Your provided address",
    city: "Your City",
    country: "Your Region"
  };

  // Automatically wipe the shopping basket since the purchase was a success
  useEffect(() => {
    clearCart();
  }, []);

  // Generate a random high-end order identification number
  const orderNumber = useMemo(() => {
    return `AN-${2026}-${Math.floor(100000 + Math.random() * 900000)}`;
  }, []);

  // Calculate high-end logistics delivery window (3 to 5 business days from today)
  const deliveryRange = useMemo(() => {
    const today = new Date();
    const minDelivery = new Date(today);
    const maxDelivery = new Date(today);

    minDelivery.setDate(today.getDate() + 3);
    maxDelivery.setDate(today.getDate() + 5);

    const options = { month: "long", day: "numeric" };
    return `${minDelivery.toLocaleDateString("en-US", options)} — ${maxDelivery.toLocaleDateString("en-US", options)}, 2026`;
  }, []);

  return (
    <div className="confirmation-page">
      <header className="confirmation-header">
        <span className="brand-sub">ORVEX STUDIO / ORDER RECEIPT</span>
        <button className="back-home-txt" onClick={() => navigate("/")}>← RETURN TO HOME</button>
      </header>

      <main className="confirmation-main">
        <section className="confirmation-hero">
          <h1>
            ORDER
            <br />
            <em>CONFIRMED.</em>
          </h1>
          <div className="luxury-divider-line"></div>
          <p className="thank-you-msg">
            Thank you for your patronage, {shippingInfo.firstName}. Your request has been successfully registered into our seasonal database log.
          </p>
          <div className="order-badge">
            <span className="badge-label">LOGISTICS IDENTIFIER</span>
            <strong>{orderNumber}</strong>
          </div>
        </section>

        <section className="logistics-details-panel">
          <div className="logistics-card">
            <h3>DELIVERY DESTINATION</h3>
            <p className="client-name">{shippingInfo.firstName} {shippingInfo.lastName}</p>
            <p className="address-line">{shippingInfo.address}</p>
            <p className="address-line">{shippingInfo.city}, {shippingInfo.country}</p>
          </div>

          <div className="logistics-card highlighted-card">
            <h3>ESTIMATED ARRIVAL</h3>
            <p className="delivery-date">{deliveryRange}</p>
            <p className="delivery-note">
              A private courier dispatch alert accompanied with a real-time carrier tracking link will be transmitted directly to your profile's registered email address shortly.
            </p>
          </div>
        </section>

        <div className="action-row">
          <button className="continue-shopping-btn" onClick={() => navigate("/shop")}>
            CONTINUE SHOPPING <span>→</span>
          </button>
        </div>
      </main>

      <footer className="confirmation-footer">
        <span>© 2026 ATELIER NOIR. ALL CONTEXT RESERVED.</span>
      </footer>
    </div>
  );
}

export default OrderConfirmation;
