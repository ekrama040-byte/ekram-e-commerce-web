import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function PaymentPage() {
  const [paymentMethod, setPaymentMethod] = useState("card");

  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const navigate = useNavigate();

const { clearCart } = useCart();

  // Demo order data
  const orderItems = [
    {
      id: 1,
      name: "Premium Essential",
      price: 89.99,
      quantity: 1,
      image:
        "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
    },
    {
      id: 2,
      name: "Modern Collection",
      price: 64.99,
      quantity: 1,
      image:
        "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
    },
  ];

  const subtotal = orderItems.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const shipping = 0;

  const tax = subtotal * 0.08;

  const total = subtotal + shipping + tax;

 const handlePayment = (event) => {
  event.preventDefault();

  // Payment simulation
  clearCart();

  navigate("/order-confirmation");
};

  return (
    <div className="payment-page">

      {/* =========================================
          NAVBAR
      ========================================= */}

      <nav className="checkout-navbar">

        <button
          className="checkout-back"
          onClick={() => {
            window.history.back();
          }}
        >
          ← BACK
        </button>

        <div className="brand">
          ATELIER
          <span>NOIR</span>
        </div>

        <div className="secure-checkout-label">
          <span>●</span>
          SECURE CHECKOUT
        </div>

      </nav>


      {/* =========================================
          CHECKOUT PROGRESS
      ========================================= */}

      <section className="checkout-progress">

        <div className="progress-step completed">
          <span>01</span>
          <div>
            <strong>CART</strong>
            <small>YOUR ITEMS</small>
          </div>
        </div>

        <div className="progress-line completed"></div>

        <div className="progress-step completed">
          <span>02</span>
          <div>
            <strong>SHIPPING</strong>
            <small>DELIVERY DETAILS</small>
          </div>
        </div>

        <div className="progress-line active"></div>

        <div className="progress-step active">
          <span>03</span>
          <div>
            <strong>PAYMENT</strong>
            <small>SECURE PAYMENT</small>
          </div>
        </div>

        <div className="progress-line"></div>

        <div className="progress-step">
          <span>04</span>
          <div>
            <strong>CONFIRMATION</strong>
            <small>ORDER COMPLETE</small>
          </div>
        </div>

      </section>


      {/* =========================================
          MAIN CHECKOUT
      ========================================= */}

      <main className="checkout-main">

        {/* =====================================
            LEFT COLUMN
        ===================================== */}

        <section className="payment-column">

          <div className="checkout-heading">

            <span className="section-label">
              STEP 03 / SECURE PAYMENT
            </span>

            <h1>
              SELECT PAYMENT
              <br />
              <span>METHOD.</span>
            </h1>

            <p>
              Choose your preferred payment method
              to complete your order securely.
            </p>

          </div>


          {/* PAYMENT METHODS */}

          <div className="payment-methods">

            <button
              className={
                paymentMethod === "card"
                  ? "payment-method selected"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("card")
              }
            >
              <div className="method-icon">
                ▣
              </div>

              <div>
                <strong>
                  CREDIT / DEBIT CARD
                </strong>

                <span>
                  Visa, Mastercard, Amex
                </span>
              </div>

              <i>
                {paymentMethod === "card"
                  ? "●"
                  : "○"}
              </i>
            </button>


            <button
              className={
                paymentMethod === "upi"
                  ? "payment-method selected"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("upi")
              }
            >
              <div className="method-icon">
                UPI
              </div>

              <div>
                <strong>
                  UPI PAYMENT
                </strong>

                <span>
                  Google Pay, PhonePe, Paytm
                </span>
              </div>

              <i>
                {paymentMethod === "upi"
                  ? "●"
                  : "○"}
              </i>
            </button>


            <button
              className={
                paymentMethod === "qr"
                  ? "payment-method selected"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("qr")
              }
            >
              <div className="method-icon">
                ▦
              </div>

              <div>
                <strong>
                  QR PAYMENT
                </strong>

                <span>
                  Scan and pay securely
                </span>
              </div>

              <i>
                {paymentMethod === "qr"
                  ? "●"
                  : "○"}
              </i>
            </button>

          </div>


          {/* =================================
              CARD FORM
          ================================= */}

          {paymentMethod === "card" && (

            <form
              className="payment-form"
              onSubmit={handlePayment}
            >

              <div className="form-section-heading">

                <div>
                  <span>01</span>

                  <div>
                    <strong>
                      CARD INFORMATION
                    </strong>

                    <p>
                      Enter your card details below.
                    </p>
                  </div>
                </div>

                <span className="secure-label">
                  🔒 ENCRYPTED
                </span>

              </div>


              <div className="form-group">

                <label>
                  CARDHOLDER NAME
                </label>

                <input
                  type="text"
                  placeholder="John Smith"
                  value={cardName}
                  onChange={(e) =>
                    setCardName(e.target.value)
                  }
                  required
                />

              </div>


              <div className="form-group">

                <label>
                  CARD NUMBER
                </label>

                <div className="card-input-wrapper">

                  <input
                    type="text"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) =>
                      setCardNumber(e.target.value)
                    }
                    maxLength={19}
                    required
                  />

                  <span>▣</span>

                </div>

              </div>


              <div className="form-row">

                <div className="form-group">

                  <label>
                    EXPIRY DATE
                  </label>

                  <input
                    type="text"
                    placeholder="MM / YY"
                    value={expiry}
                    onChange={(e) =>
                      setExpiry(e.target.value)
                    }
                    maxLength={7}
                    required
                  />

                </div>


                <div className="form-group">

                  <label>
                    CVV
                  </label>

                  <input
                    type="password"
                    placeholder="•••"
                    value={cvv}
                    onChange={(e) =>
                      setCvv(e.target.value)
                    }
                    maxLength={4}
                    required
                  />

                </div>

              </div>


              <label className="save-card">

                <input type="checkbox" />

                <span>
                  Save this card securely for
                  future purchases
                </span>

              </label>


              <button
                type="submit"
                className="complete-payment"
              >
                PAY ${total.toFixed(2)}
                <span>→</span>
              </button>

            </form>

          )}


          {/* =================================
              UPI
          ================================= */}

          {paymentMethod === "upi" && (

            <div className="alternative-payment">

              <div className="alternative-icon">
                UPI
              </div>

              <h2>
                PAY WITH UPI
              </h2>

              <p>
                Enter your UPI ID to continue
                with your payment.
              </p>

              <input
                type="text"
                placeholder="yourname@upi"
              />

              <button
                className="complete-payment"
                onClick={handlePayment}
              >
                CONTINUE TO UPI
                <span>→</span>
              </button>

            </div>

          )}


          {/* =================================
              QR PAYMENT
          ================================= */}

          {paymentMethod === "qr" && (

            <div className="alternative-payment qr-payment">

              <div className="fake-qr">

                <div className="qr-corner top-left"></div>
                <div className="qr-corner top-right"></div>
                <div className="qr-corner bottom-left"></div>

                <div className="qr-pattern">
                  ▦ ▦ ▦
                  <br />
                  ▦ ▪ ▦
                  <br />
                  ▦ ▦ ▦
                </div>

              </div>

              <h2>
                SCAN TO PAY
              </h2>

              <p>
                Scan this QR code using your
                preferred payment application.
              </p>

              <button
                className="complete-payment"
                onClick={handlePayment}
              >
                I'VE COMPLETED PAYMENT
                <span>→</span>
              </button>

            </div>

          )}


          {/* =================================
              SECURITY
          ================================= */}

          <div className="payment-security">

            <div className="security-icon">
              ✓
            </div>

            <div>

              <strong>
                YOUR PAYMENT IS SECURE
              </strong>

              <p>
                All payment information is encrypted
                and processed securely. We never store
                your complete card details.
              </p>

            </div>

          </div>

        </section>


        {/* =====================================
            RIGHT COLUMN - ORDER SUMMARY
        ===================================== */}

        <aside className="order-summary">

          <div className="summary-header">

            <div>
              <span className="section-label">
                YOUR ORDER
              </span>

              <h2>
                ORDER
                <br />
                <span>SUMMARY</span>
              </h2>
            </div>

            <span className="order-number">
              #AN-2406
            </span>

          </div>


          {/* ITEMS */}

          <div className="summary-items">

            {orderItems.map((item) => (

              <div
                className="summary-item"
                key={item.id}
              >

                <div className="summary-image">

                  <img
                    src={item.image}
                    alt={item.name}
                  />

                </div>

                <div className="summary-item-info">

                  <span>
                    ESSENTIAL COLLECTION
                  </span>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    Qty: {item.quantity}
                  </p>

                </div>

                <strong>
                  ${item.price.toFixed(2)}
                </strong>

              </div>

            ))}

          </div>


          {/* PRICE BREAKDOWN */}

          <div className="price-breakdown">

            <div>
              <span>SUBTOTAL</span>
              <strong>
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>SHIPPING</span>
              <strong className="free">
                FREE
              </strong>
            </div>

            <div>
              <span>ESTIMATED TAX</span>
              <strong>
                ${tax.toFixed(2)}
              </strong>
            </div>

          </div>


          <div className="summary-total">

            <span>TOTAL</span>

            <div>
              <strong>
                ${total.toFixed(2)}
              </strong>

              <small>
                USD
              </small>
            </div>

          </div>


          {/* DELIVERY */}

          <div className="delivery-card">

            <div className="delivery-icon">
              ◇
            </div>

            <div>

              <strong>
                ESTIMATED DELIVERY
              </strong>

              <p>
                September 10 — September 14
              </p>

              <small>
                Complimentary standard shipping
              </small>

            </div>

          </div>


          {/* COUPON */}

          <div className="coupon">

            <input
              type="text"
              placeholder="PROMO CODE"
            />

            <button>
              APPLY
            </button>

          </div>

        </aside>

      </main>


      {/* =========================================
          ORDER PROTECTION
      ========================================= */}

      <section className="order-protection">

        <div className="protection-heading">

          <span className="section-label">
            ORDER PROTECTION
          </span>

          <h2>
            WE'VE GOT
            <br />
            <span>YOU COVERED.</span>
          </h2>

        </div>


        <div className="protection-items">

          <div>

            <span>01</span>

            <div>
              <strong>
                SECURE PAYMENT
              </strong>

              <p>
                Industry-standard encryption
                protects every transaction.
              </p>
            </div>

          </div>


          <div>

            <span>02</span>

            <div>
              <strong>
                EASY RETURNS
              </strong>

              <p>
                Return eligible purchases
                within 30 days.
              </p>
            </div>

          </div>


          <div>

            <span>03</span>

            <div>
              <strong>
                ORDER TRACKING
              </strong>

              <p>
                Follow your order from our
                studio to your door.
              </p>
            </div>

          </div>

        </div>

      </section>


      {/* =========================================
          FOOTER
      ========================================= */}

      <footer className="luxury-footer">

        <div className="footer-brand">

          <div className="brand">
            ATELIER
            <span>NOIR</span>
          </div>

          <p>
            Modern essentials for a
            considered wardrobe.
          </p>

        </div>

        <div className="footer-column">

          <h4>SHOP</h4>
          <a href="/">Men</a>
          <a href="/">Women</a>
          <a href="/">New Arrivals</a>

        </div>

        <div className="footer-column">

          <h4>COMPANY</h4>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Journal</a>

        </div>

        <div className="footer-column">

          <h4>SUPPORT</h4>
          <a href="/">Shipping</a>
          <a href="/">Returns</a>
          <a href="/">FAQ</a>

        </div>

        <div className="footer-bottom">

          <span>
            © 2026 ATELIER NOIR
          </span>

          <span>
            SECURE CHECKOUT
          </span>

        </div>

      </footer>

    </div>
  );
}