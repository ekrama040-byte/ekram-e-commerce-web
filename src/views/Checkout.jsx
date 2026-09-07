import { useState } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

function Checkout() {
  const [delivery, setDelivery] = useState("standard");
  const navigate = useNavigate();

  const subtotal = 318.98;
  const shipping = delivery === "express" ? 18 : 0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleContinue = (e) => {
  e.preventDefault();

  navigate("/payment");
};
  return (
    <div className="checkout-page">

      {/* HEADER */}
      <header className="checkout-header">

        <button
          className="checkout-back"
          onClick={() => window.history.back()}
        >
          ← BACK TO CART
        </button>

        <div className="checkout-logo">
          ATELIER <span>NOIR</span>
        </div>

        <div className="checkout-secure">
          ● SECURE CHECKOUT
        </div>

      </header>


      {/* PROGRESS */}
      <div className="checkout-progress">

        <div className="checkout-step done">
          <span>01</span>
          <div>
            <strong>CART</strong>
            <small>YOUR ITEMS</small>
          </div>
        </div>

        <div className="checkout-line done"></div>

        <div className="checkout-step active">
          <span>02</span>
          <div>
            <strong>SHIPPING</strong>
            <small>DELIVERY DETAILS</small>
          </div>
        </div>

        <div className="checkout-line"></div>

        <div className="checkout-step">
          <span>03</span>
          <div>
            <strong>PAYMENT</strong>
            <small>SECURE PAYMENT</small>
          </div>
        </div>

        <div className="checkout-line"></div>

        <div className="checkout-step">
          <span>04</span>
          <div>
            <strong>CONFIRMATION</strong>
            <small>ORDER COMPLETE</small>
          </div>
        </div>

      </div>


      {/* MAIN */}
      <main className="checkout-container">

        {/* LEFT */}
        <section className="checkout-form-section">

          <div className="checkout-title">

            <span>STEP 02 / DELIVERY DETAILS</span>

            <h1>
              SHIPPING
              <br />
              <em>INFORMATION.</em>
            </h1>

            <p>
              Where should we deliver your order?
              Enter your details below.
            </p>

          </div>


          <form onSubmit={handleContinue}>

            {/* CONTACT */}
            <div className="checkout-card">

              <div className="card-heading">
                <span>01</span>

                <div>
                  <strong>CONTACT INFORMATION</strong>
                  <p>We'll use this to send your order updates.</p>
                </div>
              </div>

              <div className="input-group">

                <label>EMAIL ADDRESS</label>

                <input
                  type="email"
                  placeholder="you@example.com"
                  required
                />

              </div>

              <div className="input-group">

                <label>PHONE NUMBER</label>

                <input
                  type="tel"
                  placeholder="+1 000 000 0000"
                  required
                />

              </div>

            </div>


            {/* ADDRESS */}
            <div className="checkout-card">

              <div className="card-heading">

                <span>02</span>

                <div>
                  <strong>SHIPPING ADDRESS</strong>
                  <p>Enter the address where you'd like your order delivered.</p>
                </div>

              </div>


              <div className="form-row">

                <div className="input-group">

                  <label>FIRST NAME</label>

                  <input
                    type="text"
                    placeholder="John"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>LAST NAME</label>

                  <input
                    type="text"
                    placeholder="Smith"
                    required
                  />

                </div>

              </div>


              <div className="input-group">

                <label>ADDRESS</label>

                <input
                  type="text"
                  placeholder="123 Main Street"
                  required
                />

              </div>


              <div className="input-group">

                <label>APARTMENT / SUITE</label>

                <input
                  type="text"
                  placeholder="Optional"
                />

              </div>


              <div className="form-row three">

                <div className="input-group">

                  <label>CITY</label>

                  <input
                    type="text"
                    placeholder="New York"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>STATE</label>

                  <input
                    type="text"
                    placeholder="NY"
                    required
                  />

                </div>

                <div className="input-group">

                  <label>POSTAL CODE</label>

                  <input
                    type="text"
                    placeholder="10001"
                    required
                  />

                </div>

              </div>


              <div className="input-group">

                <label>COUNTRY</label>

                <select required>

                  <option value="">
                    SELECT COUNTRY
                  </option>

                  <option>United States</option>
                  <option>Canada</option>
                  <option>United Kingdom</option>
                  <option>India</option>
                  <option>Australia</option>

                </select>

              </div>

            </div>


            {/* DELIVERY */}
            <div className="checkout-card">

              <div className="card-heading">

                <span>03</span>

                <div>
                  <strong>DELIVERY METHOD</strong>
                  <p>Choose how you'd like to receive your order.</p>
                </div>

              </div>


              <button
                type="button"
                className={
                  delivery === "standard"
                    ? "delivery-option selected"
                    : "delivery-option"
                }
                onClick={() => setDelivery("standard")}
              >

                <div className="delivery-radio">
                  {delivery === "standard" ? "●" : "○"}
                </div>

                <div className="delivery-info">

                  <strong>STANDARD DELIVERY</strong>

                  <span>
                    5–7 business days
                  </span>

                </div>

                <b>FREE</b>

              </button>


              <button
                type="button"
                className={
                  delivery === "express"
                    ? "delivery-option selected"
                    : "delivery-option"
                }
                onClick={() => setDelivery("express")}
              >

                <div className="delivery-radio">
                  {delivery === "express" ? "●" : "○"}
                </div>

                <div className="delivery-info">

                  <strong>EXPRESS DELIVERY</strong>

                  <span>
                    2–3 business days
                  </span>

                </div>

                <b>$18.00</b>

              </button>

            </div>


            {/* CONTINUE */}
            <button
              type="submit"
              className="checkout-continue"
            >
              CONTINUE TO PAYMENT
              <span>→</span>
            </button>

          </form>

        </section>


        {/* RIGHT ORDER SUMMARY */}
        <aside className="checkout-summary">

          <div className="summary-top">

            <div>
              <span>YOUR ORDER</span>

              <h2>
                ORDER
                <br />
                <em>SUMMARY.</em>
              </h2>
            </div>

            <small>#AN-2406</small>

          </div>


          {/* PRODUCT */}
          <div className="checkout-product">

            <div className="checkout-product-image">
              <img
                src="https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg"
                alt="Product"
              />
            </div>

            <div className="checkout-product-info">

              <span>ESSENTIAL COLLECTION</span>

              <h3>
                Classic Essential
              </h3>

              <p>
                Qty: 1
              </p>

            </div>

            <strong>
              $189.99
            </strong>

          </div>


          <div className="checkout-product">

            <div className="checkout-product-image">
              <img
                src="https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
                alt="Product"
              />
            </div>

            <div className="checkout-product-info">

              <span>MODERN COLLECTION</span>

              <h3>
                Modern Essential
              </h3>

              <p>
                Qty: 1
              </p>

            </div>

            <strong>
              $128.99
            </strong>

          </div>


          {/* PRICES */}
          <div className="checkout-prices">

            <div>
              <span>SUBTOTAL</span>
              <strong>
                ${subtotal.toFixed(2)}
              </strong>
            </div>

            <div>
              <span>SHIPPING</span>

              <strong>
                {shipping === 0
                  ? "FREE"
                  : `$${shipping.toFixed(2)}`}
              </strong>
            </div>

            <div>
              <span>ESTIMATED TAX</span>
              <strong>
                ${tax.toFixed(2)}
              </strong>
            </div>

          </div>


          {/* TOTAL */}
          <div className="checkout-total">

            <span>TOTAL</span>

            <div>
              <strong>
                ${total.toFixed(2)}
              </strong>

              <small>USD</small>
            </div>

          </div>


          {/* DELIVERY INFO */}
          <div className="checkout-delivery">

            <div className="delivery-symbol">
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


          {/* SECURE */}
          <div className="checkout-safe">

            <span>✓</span>

            <div>

              <strong>
                SECURE CHECKOUT
              </strong>

              <p>
                Your information is encrypted
                and securely transmitted.
              </p>

            </div>

          </div>

        </aside>

      </main>

    </div>
  );
}

export default Checkout;