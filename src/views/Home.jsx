import { useMemo, useState } from "react";
import Hero from "../components/Hero";
import { useClothingApi } from "../hooks/useClothingApi";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../Context/CartContext";

export default function Home() {
  // ================= SEARCH & AUTH STATES =================
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchInput, setIsSearchInput] = useState("");

  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Authentication form states
  const [authView, setAuthView] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const navigate = useNavigate();
  const { products, loading, error } = useClothingApi();

  const [category, setCategory] = useState("All");
  const { cart, addToCart, removeFromCart } = useCart();

  // ================= AUTHENTICATION =================
  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    if (authView === "signup") {
      // Basic registration validation
      if (!username.trim() || !email.trim() || !password) {
        setAuthError("All fields are required.");
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();

      // Check whether account already exists
      const existingUser = localStorage.getItem(`user_${normalizedEmail}`);

      if (existingUser) {
        setAuthError(
          "An account with this email already exists. Please sign in."
        );
        return;
      }

      // Save account
      const newUserData = {
        username: username.trim(),
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(
        `user_${normalizedEmail}`,
        JSON.stringify(newUserData)
      );

      // Log the user in after registration
      setUser({
        name: newUserData.username,
        email: newUserData.email,
      });

      resetAuthForm();
    } else {
      // Login validation
      if (!email.trim() || !password) {
        setAuthError("Please fill in all fields.");
        return;
      }

      const normalizedEmail = email.trim().toLowerCase();
      const savedUserRaw = localStorage.getItem(`user_${normalizedEmail}`);

      if (!savedUserRaw) {
        setAuthError(
          "No account found with this email. Please sign up."
        );
        return;
      }

      try {
        const savedUserData = JSON.parse(savedUserRaw);

        if (savedUserData.password !== password) {
          setAuthError("Incorrect password. Please try again.");
          return;
        }

        // Successful login
        setUser({
          name: savedUserData.username,
          email: savedUserData.email,
        });

        resetAuthForm();
      } catch (err) {
        setAuthError("Unable to load your account. Please sign up again.");
      }
    }
  };

  const resetAuthForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setAuthError("");
    setAuthView("login");
    setShowAuthModal(false);
  };

  // ================= FEATURED PRODUCTS =================
  const featuredProducts = useMemo(() => {
    if (!products) return [];

    if (category === "All") {
      return products.slice(0, 6);
    }

    return products
      .filter((product) => product.genderCategory === category)
      .slice(0, 6);
  }, [products, category]);

  // 1. DYNAMIC GLOBAL CART QUANTITY COUNTER
  const totalCartItems = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  // ================= ERROR =================
  if (error) {
    return (
      <div className="dashboard-error">
        <h2>Something went wrong</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="home-page">

      {/* ================= NAVBAR ================= */}
      <nav className="luxury-navbar">
        <div
          className="brand"
          onClick={() => navigate("/")}
          style={{ cursor: "pointer" }}
        >
          ORVEX 
          <span>STUDIO</span>
        </div>

        <div className="nav-links">
          <Link to="/">HOME</Link>
          <Link to="/shop">COLLECTION</Link>
          <a href="#about">ABOUT</a>
          <a href="#contact">CONTACT</a>
        </div>

        <div className="nav-icons">

          {/* Search */}
          <button
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={isSearchOpen ? "active-icon" : ""}
          >
           ⌕
          </button>

          {/* Account */}
          <button
            aria-label="Account"
            onClick={() => setShowAuthModal(true)}
          >
            {user ? "👤" : "♙"}
          </button>

          {/* Cart */}
          <button
            className="cart-nav-btn"
            aria-label="Cart"
            onClick={() => navigate("/cart")}
          >
            🛒
            {totalCartItems > 0 && (
              <span className="cart-badge-counter">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* ================= HERO ================= */}
      <main id="home">
        <Hero />

        {/* ================= COLLECTION ================= */}
        <section
          className="collection-section"
          id="collection"
        >
          <div className="section-top">
            <div>
              <span className="section-label">
                CURATED COLLECTION
              </span>

              <h2>
                THE NEW
                <br />
                <span>STANDARD</span>
              </h2>
            </div>

            <p>
              Carefully selected pieces that balance contemporary
              design with timeless sophistication.
            </p>
          </div>

          {/* Category tabs */}
          <div className="collection-tabs">
            <button
              className={category === "All" ? "selected" : ""}
              onClick={() => setCategory("All")}
            >
              ALL
            </button>

            <button
              className={category === "Men" ? "selected" : ""}
              onClick={() => setCategory("Men")}
            >
              MEN
            </button>

            <button
              className={category === "Women" ? "selected" : ""}
              onClick={() => setCategory("Women")}
            >
              WOMEN
            </button>
          </div>

          {/* Product grid */}
          {loading ? (
            <div className="loading-products">
              Loading collection...
            </div>
          ) : (
            <div className="luxury-product-grid">
              {featuredProducts.map((product) => {
                const isProductInCart = cart.some(
                  (item) => item.id === product.id
                );

                return (
                  <article
                    className="luxury-product-card"
                    key={product.id}
                  >
                    <div className="product-image-container">
                      <span className="product-number">
                        0{product.id}
                      </span>

                      {/* Product image */}
                      <img
                        src={product.image}
                        alt={product.title}
                        onClick={() =>
                          navigate(`/product/${product.id}`)
                        }
                        style={{ cursor: "pointer" }}
                      />

                      <button
                        className={`quick-add ${
                          isProductInCart
                            ? "remove-state"
                            : "add-state"
                        }`}
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          if (isProductInCart) {
                            removeFromCart(product.id);
                          } else {
                            addToCart(product);
                          }
                        }}
                      >
                        {isProductInCart ? "- REMOVE" : "+ ADD"}
                      </button>
                    </div>

                    <div className="product-information">
                      <div>
                        <span className="product-category">
                          {product.genderCategory}
                        </span>

                        <h3
                          onClick={() =>
                            navigate(`/product/${product.id}`)
                          }
                          style={{ cursor: "pointer" }}
                        >
                          {product.displayName}
                        </h3>
                      </div>

                      <strong>
                        ${Number(product.price).toFixed(2)}
                      </strong>
                      
                    </div>
                    
                  </article>
                );
              })}
              <div style={{ display: "flex", justifyContent: "center", width: "100%", marginTop: "3.5rem", marginBottom: "4rem" }}>
  <button
    onClick={() => navigate("/shop")}
    className="orvex-cta-button"
    style={{
      backgroundColor: "transparent",
      color: "#ffffff",
      padding: "1rem 2.5rem",
      border: "1px solid rgba(255, 255, 255, 0.3)",
      cursor: "pointer",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "0.9rem",
      fontWeight: "500",
      letterSpacing: "3px",
      textTransform: "uppercase",
      transition: "all 0.3s ease",
      borderRadius: "0px" // Sharp, architectural edges
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.backgroundColor = "#352d04";
      e.currentTarget.style.color = "#000000";
      e.currentTarget.style.borderColor = "#944e0c";
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.backgroundColor = "transparent";
      e.currentTarget.style.color = "#91660b";
      e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.3)";
    }}
  >
    Explore Collection
  </button>
</div>

            </div>
          )}

          {/* ================= BRAND STATEMENT ================= */}
          <section
            className="statement-section"
            id="about"
          >
            <div className="statement-number">02</div>

            <div className="statement-content">
              <span className="section-label">
                OUR PHILOSOPHY
              </span>

              <h2>
                LESS,
                <br />
                <span>BETTER.</span>
              </h2>

              <p>
                We believe great style does not need to shout.
                Every piece in our collection is selected for its
                balance of form, function and enduring character.
              </p>

              <button className="text-button">
                DISCOVER OUR STORY →
              </button>
            </div>

            <div className="statement-stats">
              <div>
                <strong>100%</strong>
                <span>
                  CURATED
                  <br />
                  DESIGN
                </span>
              </div>

              <div>
                <strong>24</strong>
                <span>
                  ESSENTIAL
                  <br />
                  PIECES
                </span>
              </div>

              <div>
                <strong>01</strong>
                <span>
                  UNIQUE
                  <br />
                  VISION
                </span>
              </div>
            </div>
          </section>

          {/* ================= FEATURE STRIP ================= */}
          <section className="feature-strip">
            <div>
              <span>01</span>
              <strong>PREMIUM DESIGN</strong>
              <p>Carefully selected silhouettes.</p>
            </div>

            <div>
              <span>02</span>
              <strong>TIMELESS STYLE</strong>
              <p>Designed beyond seasons.</p>
            </div>

            <div>
              <span>03</span>
              <strong>CURATED QUALITY</strong>
              <p>Every piece has a purpose.</p>
            </div>
          </section>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        className="luxury-footer"
        id="contact"
      >
        <div className="footer-brand">
          <div
            className="brand"
            onClick={() => navigate("/")}
            style={{ cursor: "pointer" }}
          >
            ATELIER
            <span>NOIR</span>
          </div>

          <p>
            Modern essentials for a considered wardrobe.
          </p>
        </div>

        <div className="footer-column">
          <h4>SHOP</h4>
          <Link to="/shop?category=men">Men</Link>
          <Link to="/shop?category=women">Women</Link>
          <Link to="/shop">New Arrivals</Link>
        </div>

        <div className="footer-column">
          <h4>COMPANY</h4>
          <a href="#about">About</a>
          <a href="#contact">Contact</a>
          <a href="#contact">Journal</a>
        </div>

        <div className="footer-column">
          <h4>FOLLOW</h4>
          <a href="#contact">Instagram</a>
          <a href="#contact">Pinterest</a>
          <a href="#contact">Facebook</a>
        </div>

        <div className="footer-bottom">
          <span>© 2026 ATELIER NOIR</span>
          <span>DESIGNED FOR THE MODERN ERA</span>
        </div>
      </footer>

      {/* ================= SEARCH DROPDOWN OVERLAY ================= */}
      {isSearchOpen && (
        <div className="search-overlay-bar">
          <input
            type="text"
            placeholder="Search the collection..."
            value={isSearchInput}
            onChange={(e) =>
              setIsSearchInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (
                e.key === "Enter" &&
                isSearchInput.trim()
              ) {
                navigate(
                  `/shop?search=${encodeURIComponent(
                    isSearchInput.trim()
                  )}`
                );

                setIsSearchOpen(false);
              }
            }}
            autoFocus
          />

          <button
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
          >
            ✕
          </button>
        </div>
      )}

      {/* ================= AUTHENTICATION MODAL ================= */}
      {showAuthModal && (
        <div
          className="auth-modal-backdrop"
          onClick={resetAuthForm}
        >
          <div
            className="auth-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-modal"
              onClick={resetAuthForm}
              aria-label="Close account modal"
            >
              ✕
            </button>

            {user ? (
              /* ================= LOGGED IN ACCOUNT ================= */
              <div className="auth-logged-in">
                <h3>ATELIER PROFILE</h3>

                <p className="welcome-tag">
                  Welcome back,{" "}
                  <strong>{user.name}</strong>
                </p>

                <div className="account-details-box">
                  <p>
                    <strong>Email:</strong>{" "}
                    {user.email}
                  </p>

                  <p>
                    <strong>Status:</strong>{" "}
                    Premium Member
                  </p>
                </div>

                <button
                  className="outline-button full-width"
                  onClick={() => {
                    setUser(null);
                    setShowAuthModal(false);
                  }}
                >
                  SIGN OUT OF ACCOUNT
                </button>
              </div>
            ) : (
              /* ================= AUTH FORM ================= */
              <div className="auth-form-wrapper">
                <h3>
                  {authView === "login"
                    ? "SIGN IN"
                    : "CREATE ACCOUNT"}
                </h3>

                <p className="auth-subtitle">
                  {authView === "login"
                    ? "Access your saved wardrobe and custom orders."
                    : "Join Atelier Noir to complete purchases and track orders."}
                </p>

                {authError && (
                  <div className="auth-error-banner">
                    {authError}
                  </div>
                )}

                <form
                  onSubmit={handleAuthSubmit}
                  className="auth-luxury-form"
                >
                  {authView === "signup" && (
                    <div className="form-group">
                      <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) =>
                          setUsername(e.target.value)
                        }
                        required
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="form-group">
                    <input
                      type="password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="outline-button full-width margin-top"
                  >
                    {authView === "login"
                      ? "LOG IN"
                      : "REGISTER"}
                  </button>
                </form>

                <div className="auth-toggle-footer">
                  {authView === "login" ? (
                    <p>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("signup");
                          setAuthError("");
                        }}
                      >
                        Create One
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{" "}
                      <button
                        type="button"
                        onClick={() => {
                          setAuthView("login");
                          setAuthError("");
                        }}
                      >
                        Sign In
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}