import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { useClothingApi } from "../hooks/useClothingApi";
import { useCart } from "../context/CartContext";

function Shop() {
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();

  const { products, loading, error } = useClothingApi();
  const { cart, addToCart, removeFromCart } = useCart();

  /* --------------------------------
     URL PARAMETERS
  -------------------------------- */
  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "featured";
  const searchUrlParam = searchParams.get("search") || "";

  /* --------------------------------
     SEARCH STATE
  -------------------------------- */
  const [search, setSearch] = useState(searchUrlParam);

  /* --------------------------------
     FILTER & SORT PRODUCTS
  -------------------------------- */
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) {
      return [];
    }

    const activeSearchTerm = (
      search || searchUrlParam
    )
      .trim()
      .toLowerCase();

    return products
      .filter((product) => {
        const targetCategory = category.toLowerCase();

        const productCategory = product.genderCategory
          ? String(product.genderCategory).toLowerCase()
          : "";

        const matchesCategory =
          targetCategory === "all" ||
          productCategory === targetCategory;

        const productTitle = String(
          product.title || product.displayName || ""
        ).toLowerCase();

        const matchesSearch =
          !activeSearchTerm ||
          productTitle.includes(activeSearchTerm);

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;

        if (sort === "price-low-high") {
          return priceA - priceB;
        }

        if (sort === "price-high-low") {
          return priceB - priceA;
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

  /* --------------------------------
     CATEGORY CHANGE
  -------------------------------- */
  const handleCategoryChange = (newCategory) => {
    const newParams = {
      category: newCategory,
      sort,
    };

    if (search.trim()) {
      newParams.search = search.trim();
    }

    setSearchParams(newParams);
  };

  /* --------------------------------
     SORT CHANGE
  -------------------------------- */
  const handleSortChange = (newSort) => {
    const newParams = {
      category,
      sort: newSort,
    };

    if (search.trim()) {
      newParams.search = search.trim();
    }

    setSearchParams(newParams);
  };

  /* --------------------------------
     SEARCH CHANGE
  -------------------------------- */
  const handleSearchChange = (event) => {
    const value = event.target.value;

    setSearch(value);

    const newParams = {
      category,
      sort,
    };

    if (value.trim()) {
      newParams.search = value.trim();
    }

    setSearchParams(newParams);
  };

  /* --------------------------------
     NAVIGATION
  -------------------------------- */
  const handleCartClick = () => {
    navigate("/cart");
  };

  const handleShopClick = () => {
    navigate("/shop");
  };

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`);
  };

  /* --------------------------------
     LOADING
  -------------------------------- */
  if (loading) {
    return (
      <div className="shop-loading">
        Loading products...
      </div>
    );
  }

  /* --------------------------------
     ERROR
  -------------------------------- */
  if (error) {
    return (
      <div className="shop-error">
        Error loading products: {error}
      </div>
    );
  }

  /* --------------------------------
     PAGE
  -------------------------------- */
  return (
    <div className="shop-page-wrapper">

      <style>{`
        .shop-page-wrapper {
          background-color: #000000;
          min-height: 100vh;
          font-family: inherit;
          color: #ffffff;
        }

        /* ================================
           NAVBAR
        ================================= */

        .luxury-navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px 4%;
          background: #000000;
          border-bottom: 1px solid #111111;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 100;
          height: 80px;
          box-sizing: border-box;
        }

        .luxury-navbar .brand {
          font-size: 1.2rem;
          letter-spacing: 4px;
          font-weight: 400;
          color: #ffffff;
        }

        .luxury-navbar .brand span {
          font-weight: 300;
          color: #666666;
          margin-left: 4px;
        }

        .luxury-navbar .nav-links {
          display: flex;
          gap: 30px;
        }

        .luxury-navbar .nav-links span {
          font-size: 0.8rem;
          letter-spacing: 2px;
          color: #666666;
          cursor: pointer;
          transition: color 0.3s;
        }

        .luxury-navbar .nav-links span:hover,
        .luxury-navbar .nav-links span.active-link {
          color: #ffffff;
        }

        .luxury-navbar .nav-icons {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .luxury-navbar .nav-icons button {
          background: none;
          border: none;
          color: #ffffff;
          font-size: 1.2rem;
          cursor: pointer;
          transition: color 0.3s;
          outline: none;
        }

        .luxury-navbar .nav-icons button:hover {
          color: #888888;
        }

        /* ================================
           SHOP LAYOUT
        ================================= */

        .shop-container {
          display: flex;
          padding: 120px 4% 60px 4%;
          gap: 40px;
          background-color: #000000;
          box-sizing: border-box;
        }

        /* ================================
           SIDEBAR
        ================================= */

        .shop-sidebar {
          width: 220px;
          flex-shrink: 0;
          position: sticky;
          top: 120px;
          height: fit-content;
        }

        .shop-sidebar h3 {
          font-size: 0.85rem;
          letter-spacing: 3px;
          text-transform: uppercase;
          margin-bottom: 25px;
          color: #ffffff;
          font-weight: 500;
        }

        .category-list {
          list-style: none !important;
          list-style-type: none !important;
          padding: 0 !important;
          margin: 0 !important;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .category-list li {
          list-style: none !important;
          list-style-type: none !important;
          padding: 0 !important;
          margin: 0 !important;
        }

        .category-list button {
          background: none;
          border: none;
          color: #555555;
          text-align: left;
          font-size: 0.8rem;
          letter-spacing: 2px;
          text-transform: uppercase;
          cursor: pointer;
          padding: 4px 0;
          transition: all 0.3s;
          outline: none;
          width: 100%;
        }

        .category-list button:hover,
        .category-list button.active {
          color: #ffffff;
          padding-left: 6px;
        }

        /* ================================
           CONTENT
        ================================= */

        .shop-content {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          gap: 30px;
          min-width: 0;
        }

        .shop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          border-bottom: 1px solid #111111;
          padding-bottom: 20px;
        }

        .search-input {
          background: transparent;
          border: 1px solid #222222;
          color: #ffffff;
          padding: 12px 20px;
          font-size: 0.85rem;
          letter-spacing: 1px;
          outline: none;
          width: 100%;
          max-width: 350px;
          box-sizing: border-box;
        }

        .search-input::placeholder {
          color: #555555;
        }

        .search-input:focus {
          border-color: #444444;
        }

        .sort-select {
          background: #000000;
          border: 1px solid #222222;
          color: #ffffff;
          padding: 12px 20px;
          font-size: 0.85rem;
          letter-spacing: 1px;
          outline: none;
          text-transform: uppercase;
          cursor: pointer;
        }

        .sort-select option {
          background: #000000;
          color: #ffffff;
        }

        /* ================================
           PRODUCTS GRID
        ================================= */

        .products-grid {
          display: grid;
          grid-template-columns: repeat(
            auto-fill,
            minmax(260px, 1fr)
          );
          gap: 40px 25px;
        }

        .product-card {
          display: flex;
          flex-direction: column;
          background-color: #000000;
          min-width: 0;
        }

        .product-image-wrapper {
          position: relative;
          width: 100%;
          overflow: hidden;
        }

        .product-card img {
          width: 100%;
          aspect-ratio: 3 / 4;
          object-fit: cover;
          background-color: #111111;
          filter: grayscale(15%);
          transition: all 0.4s ease;
          display: block;
        }

        .product-card:hover img {
          filter: grayscale(0%);
          transform: scale(1.01);
        }

        .product-info {
          padding-top: 15px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .product-info h4 {
          font-size: 0.85rem;
          font-weight: 400;
          letter-spacing: 1px;
          margin: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: #ffffff;
        }

        .product-info p {
          font-size: 0.85rem;
          color: #888888;
          margin: 0;
        }

        /* ================================
           CART
        ================================= */

        .cart-nav-btn {
          position: relative;
        }

        .cart-badge-counter {
          position: absolute;
          top: -6px;
          right: -8px;
          background-color: #ff3b30;
          color: #ffffff;
          font-size: 0.6rem;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          box-shadow: 0 0 0 2px #000000;
        }

        /* ================================
           ADD / REMOVE BUTTON
        ================================= */

        .action-toggle-btn {
          position: absolute;
          bottom: 15px;
          right: 15px;
          background-color: rgba(0, 0, 0, 0.85);
          color: #ffffff;
          border: 1px solid #222222;
          padding: 8px 16px;
          font-size: 0.7rem;
          letter-spacing: 1px;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.2s ease;
          backdrop-filter: blur(4px);
        }

        .action-toggle-btn.add-state:hover {
          background-color: #ffffff;
          color: #000000;
          border-color: #ffffff;
        }

        .action-toggle-btn.remove-state {
          border-color: #ff3b30 !important;
          color: #ff3b30 !important;
        }

        .action-toggle-btn.remove-state:hover {
          background-color: #ff3b30 !important;
          color: #ffffff !important;
        }

        /* ================================
           NO PRODUCTS
        ================================= */

        .no-products {
          padding: 60px 20px;
          text-align: center;
          color: #666666;
          letter-spacing: 1px;
        }

        /* ================================
           LOADING / ERROR
        ================================= */

        .shop-loading,
        .shop-error {
          min-height: 100vh;
          background-color: #000000;
          color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }

        /* ================================
           MOBILE
        ================================= */

        @media (max-width: 768px) {
          .luxury-navbar {
            padding: 20px;
          }

          .luxury-navbar .nav-links {
            gap: 15px;
          }

          .shop-container {
            flex-direction: column;
            padding: 110px 20px 40px;
          }

          .shop-sidebar {
            width: 100%;
            position: static;
          }

          .category-list {
            flex-direction: row;
            flex-wrap: wrap;
          }

          .category-list li {
            width: auto;
          }

          .shop-toolbar {
            flex-direction: column;
            align-items: stretch;
          }

          .search-input {
            max-width: none;
          }

          .products-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
            gap: 25px 15px;
          }
        }

        @media (max-width: 480px) {
          .luxury-navbar .brand {
            font-size: 1rem;
            letter-spacing: 3px;
          }

          .luxury-navbar .nav-links {
            gap: 10px;
          }

          .luxury-navbar .nav-links span {
            font-size: 0.7rem;
          }

          .products-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>

      {/* ================================
          NAVBAR
      ================================= */}

      <nav className="luxury-navbar">

        <div className="brand">
          SHOP<span>STORE</span>
        </div>

        <div className="nav-links">

          <span
            className="active-link"
            onClick={handleShopClick}
          >
            SHOP
          </span>

          <span onClick={handleCartClick}>
            CART
          </span>

        </div>

        <div className="nav-icons">

          <button
            type="button"
            className="cart-nav-btn"
            onClick={handleCartClick}
            aria-label="Open cart"
          >
            🛒

            {cart.length > 0 && (
              <span className="cart-badge-counter">
                {cart.length}
              </span>
            )}

          </button>

        </div>

      </nav>

      {/* ================================
          SHOP CONTAINER
      ================================= */}

      <div className="shop-container">

        {/* SIDEBAR */}

        <aside className="shop-sidebar">

          <h3>
            Categories
          </h3>

          <ul className="category-list">

            {["all", "men", "women"].map((item) => (
              <li key={item}>

                <button
                  type="button"
                  className={
                    category.toLowerCase() === item
                      ? "active"
                      : ""
                  }
                  onClick={() =>
                    handleCategoryChange(item)
                  }
                >
                  {item}
                </button>

              </li>
            ))}

          </ul>

        </aside>

        {/* MAIN CONTENT */}

        <main className="shop-content">

          {/* TOOLBAR */}

          <div className="shop-toolbar">

            <input
              type="search"
              className="search-input"
              placeholder="SEARCH PRODUCTS..."
              value={search}
              onChange={handleSearchChange}
              aria-label="Search products"
            />

            <select
              value={sort}
              onChange={(event) =>
                handleSortChange(event.target.value)
              }
              className="sort-select"
              aria-label="Sort products"
            >

              <option value="featured">
                Featured
              </option>

              <option value="price-low-high">
                Price: Low to High
              </option>

              <option value="price-high-low">
                Price: High to Low
              </option>

            </select>

          </div>

          {/* PRODUCT RESULTS */}

          {filteredAndSortedProducts.length === 0 ? (

            <div className="no-products">
              No products found matching your criteria.
            </div>

          ) : (

            <div className="products-grid">

              {filteredAndSortedProducts.map((product) => {

                const isProductInCart = cart.some(
                  (item) => item.id === product.id
                );

                const productTitle =
                  product.displayName ||
                  product.title ||
                  "Product";

                const productPrice =
                  Number(product.price) || 0;

                return (
                  <article
                    className="product-card"
                    key={product.id}
                  >

                    <div className="product-image-wrapper">

                      <img
                        src={product.image}
                        alt={productTitle}
                        onClick={() =>
                          handleProductClick(product.id)
                        }
                        style={{
                          cursor: "pointer",
                        }}
                      />

                      <button
                        type="button"
                        className={`action-toggle-btn ${
                          isProductInCart
                            ? "remove-state"
                            : "add-state"
                        }`}
                        onClick={() => {

                          if (isProductInCart) {
                            removeFromCart(product.id);
                          } else {
                            addToCart(product);
                          }

                        }}
                      >
                        {isProductInCart
                          ? "- REMOVE"
                          : "+ ADD"}
                      </button>

                    </div>

                    <div className="product-info">

                      <h4>
                        {productTitle}
                      </h4>

                      <p>
                        ${productPrice.toFixed(2)}
                      </p>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </main>

      </div>

    </div>
  );
}

export default Shop;