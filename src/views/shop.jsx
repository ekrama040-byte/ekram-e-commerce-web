import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useClothingApi } from "../hooks/useClothingApi";
import { useCart } from "../context/CartContext";

// Cache-busting inline import selector guarantees styles load instantly
import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useClothingApi } from "../hooks/useClothingApi";
import { useCart } from "../context/CartContext";

function Shop() {
  const navigate = useNavigate();
  const { products, loading, error } = useClothingApi();
  const { cart, addToCart, removeFromCart } = useCart();

  const [searchParams, setSearchParams] = useSearchParams();

  const [search, setSearch] = useState("");

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchInput, setIsSearchInput] = useState("");

  const [user, setUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const [authView, setAuthView] = useState("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");

  const category =
    searchParams.get("category") || "all";

  const sort =
    searchParams.get("sort") || "featured";

  const searchUrlParam =
    searchParams.get("search") || "";

  /* =========================================================
     CART COUNT
  ========================================================= */

  const totalCartItems = useMemo(() => {
    return cart.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }, [cart]);

  /* =========================================================
     FILTER / SEARCH / SORT
  ========================================================= */

  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    const activeSearchTerm = (
      search || searchUrlParam
    )
      .toLowerCase()
      .trim();

    return [...products]
      .filter((product) => {
        const targetCategory =
          category.toLowerCase();

        const productCategory = (
          product.genderCategory || ""
        ).toLowerCase();

        const title = (
          product.title ||
          product.displayName ||
          ""
        ).toLowerCase();

        const matchesCategory =
          targetCategory === "all" ||
          productCategory === targetCategory;

        const matchesSearch =
          !activeSearchTerm ||
          title.includes(activeSearchTerm);

        return (
          matchesCategory &&
          matchesSearch
        );
      })
      .sort((a, b) => {
        if (sort === "price-low-high") {
          return (
            Number(a.price) -
            Number(b.price)
          );
        }

        if (sort === "price-high-low") {
          return (
            Number(b.price) -
            Number(a.price)
          );
        }

        return 0;
      });
  }, [
    products,
    category,
    sort,
    search,
    searchUrlParam,
  ]);

  /* =========================================================
     CATEGORY
  ========================================================= */

  const handleCategoryChange = (
    newCategory
  ) => {
    const params = {
      category: newCategory,
      sort,
    };

    if (searchUrlParam) {
      params.search = searchUrlParam;
    }

    setSearchParams(params);
  };

  /* =========================================================
     SORT
  ========================================================= */

  const handleSortChange = (newSort) => {
    const params = {
      category,
      sort: newSort,
    };

    if (searchUrlParam) {
      params.search = searchUrlParam;
    }

    setSearchParams(params);
  };

  /* =========================================================
     AUTH
  ========================================================= */

  const resetAuthForm = () => {
    setUsername("");
    setEmail("");
    setPassword("");
    setAuthError("");
    setShowAuthModal(false);
  };

  const handleAuthSubmit = (e) => {
    e.preventDefault();
    setAuthError("");

    if (authView === "signup") {
      if (
        !username.trim() ||
        !email.trim() ||
        !password
      ) {
        setAuthError(
          "All fields are required."
        );
        return;
      }

      const normalizedEmail =
        email.trim().toLowerCase();

      const existingUser =
        localStorage.getItem(
          `user_${normalizedEmail}`
        );

      if (existingUser) {
        setAuthError(
          "An account with this email already exists. Please sign in."
        );
        return;
      }

      const newUser = {
        username: username.trim(),
        email: normalizedEmail,
        password,
      };

      localStorage.setItem(
        `user_${normalizedEmail}`,
        JSON.stringify(newUser)
      );

      setUser({
        name: newUser.username,
        email: newUser.email,
      });

      resetAuthForm();
      return;
    }

    if (
      !email.trim() ||
      !password
    ) {
      setAuthError(
        "Please fill in all fields."
      );
      return;
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const savedUserRaw =
      localStorage.getItem(
        `user_${normalizedEmail}`
      );

    if (!savedUserRaw) {
      setAuthError(
        "No account found with this email. Please sign up."
      );
      return;
    }

    try {
      const savedUser =
        JSON.parse(savedUserRaw);

      if (
        savedUser.password !== password
      ) {
        setAuthError(
          "Incorrect password. Please try again."
        );
        return;
      }

      setUser({
        name: savedUser.username,
        email: savedUser.email,
      });

      resetAuthForm();
    } catch {
      setAuthError(
        "Unable to load your account."
      );
    }
  };

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div style={styles.loadingPage}>
        <div style={styles.loadingText}>
          LOADING COLLECTION...
        </div>
      </div>
    );
  }

  /* =========================================================
     ERROR
  ========================================================= */

  if (error) {
    return (
      <div style={styles.loadingPage}>
        <h2 style={{ color: "#eeeade" }}>
          Error loading products
        </h2>

        <p style={{ color: "#77746d" }}>
          {error}
        </p>

        <button
          style={styles.goldButton}
          onClick={() => navigate("/")}
        >
          BACK HOME
        </button>
      </div>
    );
  }

  /* =========================================================
     PAGE
  ========================================================= */

  return (
    <div style={styles.page}>

      {/* =====================================================
          NAVBAR
      ===================================================== */}

      <nav style={styles.navbar}>

        <div
          style={styles.brand}
          onClick={() => navigate("/")}
        >
          ATELIER
          <span>NOIR</span>
        </div>

        <div style={styles.navLinks}>

          <button
            style={styles.navLink}
            onClick={() => navigate("/")}
          >
            HOME
          </button>

          <button
            style={{
              ...styles.navLink,
              color: "#c5ae59",
            }}
            onClick={() =>
              navigate("/shop")
            }
          >
            COLLECTION
          </button>

          <a
            href="#about"
            style={styles.navLink}
          >
            ABOUT
          </a>

          <a
            href="#contact"
            style={styles.navLink}
          >
            CONTACT
          </a>

        </div>

        <div style={styles.navIcons}>

          <button
            style={styles.iconButton}
            onClick={() =>
              setIsSearchOpen(
                !isSearchOpen
              )
            }
          >
            ⌕
          </button>

          <button
            style={styles.iconButton}
            onClick={() =>
              setShowAuthModal(true)
            }
          >
            {user ? "●" : "♙"}
          </button>

          <button
            style={{
              ...styles.iconButton,
              position: "relative",
            }}
            onClick={() =>
              navigate("/cart")
            }
          >
            🛒

            {totalCartItems > 0 && (
              <span
                style={styles.cartBadge}
              >
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </nav>

      {/* =====================================================
          SEARCH BAR
      ===================================================== */}

      {isSearchOpen && (
        <div style={styles.searchBar}>

          <input
            autoFocus
            value={isSearchInput}
            onChange={(e) =>
              setIsSearchInput(
                e.target.value
              )
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const value =
                  isSearchInput.trim();

                setSearch(value);

                const params = {
                  category,
                  sort,
                };

                if (value) {
                  params.search = value;
                }

                setSearchParams(params);
                setIsSearchOpen(false);
              }
            }}
            placeholder="SEARCH THE COLLECTION..."
            style={
              styles.searchBarInput
            }
          />

          <button
            style={styles.searchClose}
            onClick={() =>
              setIsSearchOpen(false)
            }
          >
            ×
          </button>

        </div>
      )}

      {/* =====================================================
          SHOP HERO
      ===================================================== */}

      <section style={styles.shopHero}>

        <div>
          <span style={styles.label}>
            THE COLLECTION
          </span>

          <h1 style={styles.heroTitle}>
            ALL
            <br />
            <span>ESSENTIALS.</span>
          </h1>
        </div>

        <p style={styles.heroDescription}>
          Carefully selected pieces that
          balance contemporary design
          with timeless sophistication.
        </p>

      </section>

      {/* =====================================================
          SHOP CONTENT
      ===================================================== */}

      <div style={styles.shopLayout}>

        {/* SIDEBAR */}

        <aside style={styles.sidebar}>

          <span style={styles.sidebarHeading}>
            CATEGORIES
          </span>

          <div style={styles.categoryList}>

            {[
              "all",
              "men",
              "women",
            ].map((cat) => (

              <button
                key={cat}
                onClick={() =>
                  handleCategoryChange(
                    cat
                  )
                }
                style={{
                  ...styles.categoryButton,
                  color:
                    category === cat
                      ? "#c5ae59"
                      : "#77746d",
                  borderBottom:
                    category === cat
                      ? "1px solid #81723c"
                      : "1px solid transparent",
                }}
              >
                {cat.toUpperCase()}
              </button>

            ))}

          </div>

          <div
            style={styles.sidebarDivider}
          />

          <span
            style={styles.productCount}
          >
            {
              filteredAndSortedProducts.length
            }{" "}
            PRODUCTS
          </span>

        </aside>

        {/* PRODUCTS */}

        <main style={styles.productsArea}>

          {/* TOOLBAR */}

          <div style={styles.toolbar}>

            <input
              value={
                search || searchUrlParam
              }
              onChange={(e) => {
                const value =
                  e.target.value;

                setSearch(value);

                const params = {
                  category,
                  sort,
                };

                if (value.trim()) {
                  params.search =
                    value.trim();
                }

                setSearchParams(params);
              }}
              placeholder="Search products..."
              style={styles.searchInput}
            />

            <select
              value={sort}
              onChange={(e) =>
                handleSortChange(
                  e.target.value
                )
              }
              style={styles.sortSelect}
            >
              <option value="featured">
                FEATURED
              </option>

              <option value="price-low-high">
                PRICE: LOW TO HIGH
              </option>

              <option value="price-high-low">
                PRICE: HIGH TO LOW
              </option>
            </select>

          </div>

          {/* =================================================
              PRODUCT GRID
          ================================================= */}

          {filteredAndSortedProducts.length ===
          0 ? (

            <div style={styles.empty}>
              <span style={styles.label}>
                COLLECTION
              </span>

              <h2>
                NO PRODUCTS FOUND
              </h2>

              <p>
                Try another search or
                category.
              </p>
            </div>

          ) : (

            <div style={styles.productGrid}>

              {filteredAndSortedProducts.map(
                (product, index) => {

                  const isProductInCart =
                    cart.some(
                      (item) =>
                        item.id ===
                        product.id
                    );

                  return (

                    <article
                      key={product.id}
                      style={
                        styles.productCard
                      }
                    >

                      {/* IMAGE */}

                      <div
                        style={
                          styles.imageBox
                        }
                      >

                        <span
                          style={
                            styles.productNumber
                          }
                        >
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                        <img
                          src={
                            product.image
                          }
                          alt={
                            product.title
                          }
                          onClick={() =>
                            navigate(
                              `/product/${product.id}`
                            )
                          }
                          style={
                            styles.productImage
                          }
                          onMouseEnter={(
                            e
                          ) => {
                            e.currentTarget.style.transform =
                              "scale(1.04)";
                          }}
                          onMouseLeave={(
                            e
                          ) => {
                            e.currentTarget.style.transform =
                              "scale(1)";
                          }}
                        />

                        <button
                          style={
                            styles.addButton
                          }
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();

                            if (
                              isProductInCart
                            ) {
                              removeFromCart(
                                product.id
                              );
                            } else {
                              addToCart(
                                product
                              );
                            }
                          }}
                        >
                          {isProductInCart
                            ? "- REMOVE"
                            : "+ ADD"}
                        </button>

                      </div>

                      {/* INFORMATION */}

                      <div
                        style={
                          styles.productInfo
                        }
                      >

                        <div>

                          <span
                            style={
                              styles.productCategory
                            }
                          >
                            {(
                              product.genderCategory ||
                              "COLLECTION"
                            ).toUpperCase()}
                          </span>

                          <h3
                            style={
                              styles.productName
                            }
                            onClick={() =>
                              navigate(
                                `/product/${product.id}`
                              )
                            }
                          >
                            {product.displayName ||
                              product.title}
                          </h3>

                        </div>

                        <strong
                          style={
                            styles.price
                          }
                        >
                          $
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </strong>

                      </div>

                    </article>
                  );
                }
              )}

            </div>
          )}

        </main>

      </div>

      {/* =====================================================
          ABOUT
      ===================================================== */}

      <section
        id="about"
        style={styles.about}
      >

        <div style={styles.aboutNumber}>
          02
        </div>

        <div>

          <span style={styles.label}>
            OUR PHILOSOPHY
          </span>

          <h2 style={styles.aboutTitle}>
            LESS,
            <br />
            <span>BETTER.</span>
          </h2>

          <p style={styles.aboutText}>
            We believe great style does
            not need to shout. Every piece
            is selected for its balance of
            form, function and enduring
            character.
          </p>

        </div>

      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}

      <footer
        id="contact"
        style={styles.footer}
      >

        <div>
          <div style={styles.footerBrand}>
            ATELIER
            <span>NOIR</span>
          </div>

          <p style={styles.footerText}>
            Modern essentials for a
            considered wardrobe.
          </p>
        </div>

        <div>
          <span style={styles.footerHeading}>
            SHOP
          </span>

          <button
            style={styles.footerLink}
            onClick={() =>
              handleCategoryChange(
                "men"
              )
            }
          >
            MEN
          </button>

          <button
            style={styles.footerLink}
            onClick={() =>
              handleCategoryChange(
                "women"
              )
            }
          >
            WOMEN
          </button>

          <button
            style={styles.footerLink}
            onClick={() =>
              navigate("/shop")
            }
          >
            COLLECTION
          </button>
        </div>

        <div>
          <span style={styles.footerHeading}>
            COMPANY
          </span>

          <a
            href="#about"
            style={styles.footerLink}
          >
            ABOUT
          </a>

          <a
            href="#contact"
            style={styles.footerLink}
          >
            CONTACT
          </a>
        </div>

        <div>
          <span style={styles.footerHeading}>
            FOLLOW
          </span>

          <a
            href="#contact"
            style={styles.footerLink}
          >
            INSTAGRAM
          </a>

          <a
            href="#contact"
            style={styles.footerLink}
          >
            PINTEREST
          </a>
        </div>

      </footer>

      {/* =====================================================
          ACCOUNT MODAL
      ===================================================== */}

      {showAuthModal && (

        <div
          style={styles.modalOverlay}
          onClick={resetAuthForm}
        >

          <div
            style={styles.modal}
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            <button
              style={styles.modalClose}
              onClick={resetAuthForm}
            >
              ×
            </button>

            {user ? (

              <>

                <span style={styles.label}>
                  ATELIER NOIR
                </span>

                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  WELCOME BACK
                </h2>

                <p
                  style={
                    styles.modalUser
                  }
                >
                  {user.name}
                </p>

                <p
                  style={
                    styles.modalEmail
                  }
                >
                  {user.email}
                </p>

                <button
                  style={
                    styles.fullButton
                  }
                  onClick={() => {
                    setUser(null);
                    setShowAuthModal(
                      false
                    );
                  }}
                >
                  SIGN OUT
                </button>

              </>

            ) : (

              <>

                <span style={styles.label}>
                  ATELIER NOIR
                </span>

                <h2
                  style={
                    styles.modalTitle
                  }
                >
                  {authView === "login"
                    ? "SIGN IN"
                    : "CREATE ACCOUNT"}
                </h2>

                {authError && (
                  <div
                    style={
                      styles.authError
                    }
                  >
                    {authError}
                  </div>
                )}

                <form
                  onSubmit={
                    handleAuthSubmit
                  }
                >

                  {authView ===
                    "signup" && (
                    <input
                      type="text"
                      placeholder="USERNAME"
                      value={username}
                      onChange={(e) =>
                        setUsername(
                          e.target.value
                        )
                      }
                      style={
                        styles.formInput
                      }
                    />
                  )}

                  <input
                    type="email"
                    placeholder="EMAIL"
                    value={email}
                    onChange={(e) =>
                      setEmail(
                        e.target.value
                      )
                    }
                    style={
                      styles.formInput
                    }
                  />

                  <input
                    type="password"
                    placeholder="PASSWORD"
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    style={
                      styles.formInput
                    }
                  />

                  <button
                    type="submit"
                    style={
                      styles.fullButton
                    }
                  >
                    {authView === "login"
                      ? "SIGN IN"
                      : "CREATE ACCOUNT"}
                  </button>

                </form>

                <button
                  style={
                    styles.switchAuth
                  }
                  onClick={() => {
                    setAuthView(
                      authView === "login"
                        ? "signup"
                        : "login"
                    );
                    setAuthError("");
                  }}
                >
                  {authView === "login"
                    ? "CREATE A NEW ACCOUNT"
                    : "BACK TO SIGN IN"}
                </button>

              </>

            )}

          </div>

        </div>

      )}

    </div>
  );
}

/* ============================================================
   INLINE STYLES — NO Shop.css NEEDED
============================================================ */

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0a0a09",
    color: "#eeeade",
    fontFamily:
      "Arial, Helvetica, sans-serif",
  },

  loadingPage: {
    minHeight: "100vh",
    background: "#0a0a09",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#c5ae59",
  },

  loadingText: {
    fontSize: "10px",
    letterSpacing: "4px",
  },

  navbar: {
    height: "70px",
    padding: "0 5.7%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottom:
      "1px solid #282722",
    background: "#0a0a09",
  },

  brand: {
    color: "#eeeade",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "5px",
    lineHeight: "1",
    cursor: "pointer",
  },

  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "32px",
  },

  navLink: {
    border: "none",
    background: "transparent",
    color: "#817f76",
    fontSize: "8px",
    letterSpacing: "2px",
    cursor: "pointer",
    textDecoration: "none",
  },

  navIcons: {
    display: "flex",
    gap: "7px",
  },

  iconButton: {
    width: "35px",
    height: "33px",
    border:
      "1px solid #302f2a",
    background: "#11110f",
    color: "#d7d2c5",
    cursor: "pointer",
  },

  cartBadge: {
    position: "absolute",
    top: "-7px",
    right: "-7px",
    width: "17px",
    height: "17px",
    borderRadius: "50%",
    background: "#c5ae59",
    color: "#111",
    fontSize: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  searchBar: {
    position: "fixed",
    top: "70px",
    left: 0,
    right: 0,
    zIndex: 100,
    padding: "15px 5.7%",
    background: "#11110f",
    borderBottom:
      "1px solid #81723c",
    display: "flex",
    gap: "10px",
  },

  searchBarInput: {
    flex: 1,
    height: "42px",
    background: "#0a0a09",
    border:
      "1px solid #302f2a",
    color: "#eeeade",
    padding: "0 14px",
    outline: "none",
  },

  searchClose: {
    width: "42px",
    background: "transparent",
    border:
      "1px solid #302f2a",
    color: "#eeeade",
    cursor: "pointer",
    fontSize: "18px",
  },

  shopHero: {
    padding:
      "65px 5.7% 50px",
    display: "flex",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: "40px",
  },

  label: {
    display: "block",
    color: "#968d70",
    fontSize: "8px",
    letterSpacing: "3px",
    marginBottom: "16px",
  },

  heroTitle: {
    margin: 0,
    fontSize: "48px",
    fontWeight: "300",
    lineHeight: "0.9",
    letterSpacing: "2px",
  },

  heroDescription: {
    maxWidth: "350px",
    margin: 0,
    color: "#6d6a62",
    fontSize: "11px",
    lineHeight: "1.8",
  },

  shopLayout: {
    display: "flex",
    gap: "30px",
    padding:
      "0 5.7% 80px",
  },

  sidebar: {
    width: "145px",
    flexShrink: 0,
  },

  sidebarHeading: {
    color: "#9c988d",
    fontSize: "8px",
    letterSpacing: "2px",
  },

  categoryList: {
    display: "flex",
    flexDirection: "column",
    marginTop: "15px",
  },

  categoryButton: {
    width: "100%",
    padding: "11px 0",
    textAlign: "left",
    background: "transparent",
    borderTop: "none",
    borderLeft: "none",
    borderRight: "none",
    fontSize: "8px",
    letterSpacing: "2px",
    cursor: "pointer",
  },

  sidebarDivider: {
    height: "1px",
    background: "#292824",
    margin:
      "25px 0 15px",
  },

  productCount: {
    color: "#504e48",
    fontSize: "7px",
    letterSpacing: "2px",
  },

  productsArea: {
    flex: 1,
    minWidth: 0,
  },

  toolbar: {
    display: "flex",
    gap: "12px",
    marginBottom: "18px",
  },

  searchInput: {
    flex: 1,
    height: "40px",
    boxSizing: "border-box",
    background: "#11110f",
    border:
      "1px solid #302f2a",
    color: "#eeeade",
    padding: "0 13px",
    outline: "none",
    fontSize: "10px",
  },

  sortSelect: {
    width: "185px",
    height: "40px",
    background: "#11110f",
    border:
      "1px solid #302f2a",
    color: "#aaa69b",
    padding: "0 12px",
    outline: "none",
    fontSize: "8px",
    letterSpacing: "1px",
  },

  productGrid: {
    display: "grid",
    gridTemplateColumns:
      "repeat(3, minmax(0, 1fr))",
    gap: "16px",
  },

  productCard: {
    background: "#151513",
    border:
      "1px solid #302f2b",
    overflow: "hidden",
    transition:
      "border-color 0.25s ease",
  },

  imageBox: {
    height: "355px",
    position: "relative",
    background: "#191917",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },

  productNumber: {
    position: "absolute",
    top: "13px",
    left: "14px",
    zIndex: 2,
    color: "#55534d",
    fontSize: "7px",
    letterSpacing: "2px",
  },

  productImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    padding: "18px",
    boxSizing: "border-box",
    cursor: "pointer",
    transition:
      "transform 0.35s ease",
  },

  addButton: {
    position: "absolute",
    right: "12px",
    bottom: "12px",
    height: "30px",
    minWidth: "70px",
    padding: "0 12px",
    background: "#10100e",
    border:
      "1px solid #81723c",
    color: "#c5ae59",
    fontSize: "7px",
    letterSpacing: "1px",
    cursor: "pointer",
  },

  productInfo: {
    minHeight: "75px",
    padding:
      "14px 17px",
    boxSizing: "border-box",
    borderTop:
      "1px solid #292824",
    display: "flex",
    alignItems: "center",
    justifyContent:
      "space-between",
    gap: "12px",
  },

  productCategory: {
    display: "block",
    color: "#81775d",
    fontSize: "6px",
    letterSpacing: "2px",
    marginBottom: "7px",
  },

  productName: {
    margin: 0,
    color: "#dedbd1",
    fontSize: "12px",
    fontWeight: "400",
    lineHeight: "1.3",
    cursor: "pointer",
  },

  price: {
    color: "#c5ae59",
    fontSize: "11px",
    fontWeight: "500",
    whiteSpace: "nowrap",
  },

  empty: {
    minHeight: "300px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    color: "#77746d",
  },

  about: {
    margin:
      "0 5.7% 80px",
    padding:
      "70px 8%",
    display: "grid",
    gridTemplateColumns:
      "100px 1fr",
    gap: "30px",
    background: "#11110f",
    borderTop:
      "1px solid #292824",
    borderBottom:
      "1px solid #292824",
  },

  aboutNumber: {
    color: "#81723c",
    fontSize: "8px",
    letterSpacing: "2px",
  },

  aboutTitle: {
    margin: 0,
    fontSize: "52px",
    lineHeight: "0.9",
    fontWeight: "300",
  },

  aboutText: {
    maxWidth: "500px",
    color: "#6d6a62",
    fontSize: "11px",
    lineHeight: "1.8",
    marginTop: "25px",
  },

  footer: {
    padding:
      "55px 5.7% 40px",
    display: "grid",
    gridTemplateColumns:
      "2fr 1fr 1fr 1fr",
    gap: "40px",
    borderTop:
      "1px solid #292824",
  },

  footerBrand: {
    color: "#eeeade",
    fontSize: "16px",
    fontWeight: "700",
    letterSpacing: "5px",
  },

  footerText: {
    color: "#55534d",
    fontSize: "9px",
    lineHeight: "1.7",
    maxWidth: "230px",
  },

  footerHeading: {
    display: "block",
    color: "#81775d",
    fontSize: "7px",
    letterSpacing: "2px",
    marginBottom: "15px",
  },

  footerLink: {
    display: "block",
    marginBottom: "9px",
    background: "transparent",
    border: "none",
    padding: 0,
    color: "#6d6a62",
    textDecoration: "none",
    fontSize: "8px",
    letterSpacing: "1px",
    cursor: "pointer",
  },

  modalOverlay: {
    position: "fixed",
    inset: 0,
    zIndex: 500,
    background:
      "rgba(0,0,0,0.82)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
  },

  modal: {
    position: "relative",
    width: "100%",
    maxWidth: "410px",
    padding: "45px",
    boxSizing: "border-box",
    background: "#11110f",
    border:
      "1px solid #81723c",
  },

  modalClose: {
    position: "absolute",
    right: "15px",
    top: "12px",
    background: "transparent",
    border: "none",
    color: "#aaa69b",
    fontSize: "20px",
    cursor: "pointer",
  },

  modalTitle: {
    margin:
      "0 0 20px",
    fontSize: "28px",
    fontWeight: "300",
    letterSpacing: "2px",
  },

  modalUser: {
    color: "#c5ae59",
    fontSize: "14px",
  },

  modalEmail: {
    color: "#6d6a62",
    fontSize: "10px",
    marginBottom: "25px",
  },

  formInput: {
    display: "block",
    width: "100%",
    height: "42px",
    boxSizing: "border-box",
    marginBottom: "12px",
    padding: "0 13px",
    background: "#0a0a09",
    border:
      "1px solid #302f2a",
    color: "#eeeade",
    outline: "none",
    fontSize: "10px",
  },

  fullButton: {
    width: "100%",
    height: "42px",
    marginTop: "5px",
    background: "transparent",
    border:
      "1px solid #81723c",
    color: "#c5ae59",
    cursor: "pointer",
    fontSize: "8px",
    letterSpacing: "2px",
  },

  goldButton: {
    padding: "12px 25px",
    background: "transparent",
    border:
      "1px solid #81723c",
    color: "#c5ae59",
    cursor: "pointer",
    letterSpacing: "2px",
    fontSize: "8px",
  },

  switchAuth: {
    display: "block",
    margin:
      "20px auto 0",
    background: "transparent",
    border: "none",
    color: "#77746d",
    cursor: "pointer",
    fontSize: "8px",
    letterSpacing: "1px",
  },

  authError: {
    marginBottom: "15px",
    padding: "10px",
    background: "#261313",
    border:
      "1px solid #633030",
    color: "#d58a8a",
    fontSize: "9px",
  },
};

export default Shop;