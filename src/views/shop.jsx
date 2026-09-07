import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useClothingApi } from "../hooks/useClothingApi";
import { useCart } from "../Context/CartContext"; // Note: Capitalized 'Context' to match your folder structure!

function Shop() {
  const navigate = useNavigate();
  const { products, loading, error } = useClothingApi();
  const { cart, addToCart, removeFromCart } = useCart();

  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState("");

  const category = searchParams.get("category") || "all";
  const sort = searchParams.get("sort") || "featured";
  const searchUrlParam = searchParams.get("search") || "";

  /* --------------------------------
     DYNAMIC GLOBAL CART COUNT CALCULATOR
  -------------------------------- */
  const totalCartItems = useMemo(() => {
    if (!cart) return 0;
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  /* --------------------------------
     FILTER & SORT LOGIC
  -------------------------------- */
  const filteredAndSortedProducts = useMemo(() => {
    if (!products) return [];

    return products
      .filter((product) => {
        const targetCategory = category.toLowerCase();
        const productCategory = product.genderCategory ? product.genderCategory.toLowerCase() : "";
        const matchesCategory = targetCategory === "all" || productCategory === targetCategory;
        
        const activeSearchTerm = (search || searchUrlParam).toLowerCase();
        const matchesSearch = product.title 
          ? product.title.toLowerCase().includes(activeSearchTerm) 
          : false;

        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sort === "price-low-high") return a.price - b.price;
        if (sort === "price-high-low") return b.price - a.price;
        return 0; 
      });
  }, [products, category, sort, search, searchUrlParam]);

  if (loading) return <div className="shop-loading">Loading products...</div>;
  if (error) return <div className="shop-error">Error loading products: {error}</div>;

  return (
    <div className="shop-page-wrapper">
      
      {/* ==========================================================================
         INLINE STYLE SCOPE BLOCK (Pure CSS Inside the JSX)
         ========================================================================== */}
      <style>{`
        .shop-page-wrapper { background-color: #000000; min-height: 100vh; font-family: inherit; color: #ffffff; }
        
        /* Premium Minimal Header sync */
        .luxury-navbar { display: flex; justify-content: space-between; align-items: center; padding: 20px 4%; background: #000; border-bottom: 1px solid #111; position: fixed; top: 0; left: 0; width: 100%; z-index: 100; height: 80px; }
        .luxury-navbar .details-back-arrow { background: none; border: none; color: #fff; font-size: 0.8rem; letter-spacing: 2px; cursor: pointer; transition: color 0.3s; text-transform: uppercase; outline: none; }
        .luxury-navbar .details-back-arrow:hover { color: #888; }
        .luxury-navbar .brand { font-size: 1.2rem; letter-spacing: 4px; font-weight: 400; color: #fff; }
        .luxury-navbar .brand span { font-weight: 300; color: #666; margin-left: 4px; }
        
        /* Navbar basket metrics indicators */
        .cart-nav-btn { position: relative; background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; outline: none; }
        .cart-badge-counter { position: absolute; top: -6px; right: -8px; background-color: #ff3b30; color: #ffffff; font-size: 0.6rem; font-weight: 700; min-width: 16px; height: 16px; border-radius: 50%; display: flex; justify-content: center; align-items: center; box-shadow: 0 0 0 2px #000000; }

        /* Structural Page Body Layout */
        .shop-container { display: flex; padding: 120px 4% 60px 4%; gap: 40px; background-color: #000000; }
        
        /* Sidebar container removal of list bullets symbols */
        .shop-sidebar { width: 180px; flex-shrink: 0; position: sticky; top: 120px; height: fit-content; }
        .shop-sidebar h3 { font-size: 0.85rem; letter-spacing: 3px; text-transform: uppercase; margin-bottom: 25px; color: #ffffff; font-weight: 500; }
        .category-list { list-style: none !important; list-style-type: none !important; padding: 0 !important; margin: 0 !important; display: flex; flex-direction: column; gap: 15px; }
        .category-list li { list-style: none !important; list-style-type: none !important; padding: 0 !important; margin: 0 !important; }
        .category-list button { background: none; border: none; color: #444; text-align: left; font-size: 0.8rem; letter-spacing: 2px; text-transform: uppercase; cursor: pointer; padding: 4px 0; transition: all 0.3s; outline: none; width: 100%; }
        .category-list button:hover, .category-list button.active { color: #ffffff; padding-left: 6px; }

        /* Content window area and Grid components matrix formatting rules */
        .shop-content { flex-grow: 1; display: flex; flex-direction: column; gap: 30px; }
        .shop-toolbar { display: flex; justify-content: space-between; align-items: center; gap: 20px; border-bottom: 1px solid #111; padding-bottom: 20px; }
        .search-input { background: transparent; border: 1px solid #222; color: #ffffff; padding: 12px 20px; font-size: 0.85rem; letter-spacing: 1px; outline: none; width: 100%; max-width: 300px; }
        .sort-select { background: #000; border: 1px solid #222; color: #ffffff; padding: 12px 20px; font-size: 0.85rem; letter-spacing: 1px; outline: none; text-transform: uppercase; cursor: pointer; }
        
        .products-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 40px 25px; }
        .product-card { display: flex; flex-direction: column; background: #000000; }
        .product-image-wrapper { position: relative; width: 100%; overflow: hidden; }
        .product-card img { width: 100%; aspect-ratio: 3 / 4; object-fit: cover; background-color: #111; filter: grayscale(10%); transition: all 0.4s ease; }
        .product-card:hover img { filter: grayscale(0%); }
        .product-info { padding-top: 15px; display: flex; flex-direction: column; gap: 8px; }
        .product-info h4 { font-size: 0.85rem; font-weight: 400; letter-spacing: 1px; margin: 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; color: #fff; }
        .product-info p { font-size: 0.85rem; color: #888; margin: 0; }

        /* Dynamic toggle item actions button classes styles mapping */
        .action-toggle-btn { position: absolute; bottom: 15px; right: 15px; background-color: rgba(0, 0, 0, 0.85); color: #ffffff; border: 1px solid #222; padding: 8px 16px; font-size: 0.7rem; letter-spacing: 1px; text-transform: uppercase; cursor: pointer; transition: all 0.2s ease; backdrop-filter: blur(4px); }
        .action-toggle-btn.add-state:hover { background-color: #ffffff; color: #000000; border-color: #ffffff; }
        .action-toggle-btn.remove-state { border-color: #ff3b30 !important; color: #ff3b30 !important; }
        .action-toggle-btn.remove-state:hover { background-color: #ff3b30 !important; color: #ffffff !important; }
        
        .shop-loading, .shop-error, .no-products { display: flex; justify-content: center; align-items: center; width: 100%; min-height: 40vh; font-size: 0.85rem; letter-spacing: 2px; color: #555; text-transform: uppercase; }
      `}</style>

      {/* ==========================================================================
         TOP NAVBAR (With clean return back arrow navigation option)
         ========================================================================== */}
      <nav className="luxury-navbar">
        <button className="details-back-arrow" onClick={() => navigate("/")}>
          ← Back to Home
        </button>

        <div className="brand">
          ATELIER<span>NOIR</span>
        </div>

        <button className="cart-nav-btn" aria-label="Cart" onClick={() => navigate("/cart")}>
          🛒 
          {totalCartItems > 0 && <span className="cart-badge-counter">{totalCartItems}</span>}
        </button>
      </nav>

      {/* ==========================================================================
         MAIN LAYOUT GRID CONTAINER MODULE
         ========================================================================== */}
      <div className="shop-container">
        <aside className="shop-sidebar">
          <h3>Categories</h3>
          <ul className="category-list">
            {["all", "men", "women"].map((cat) => (
              <li key={cat}>
                <button
                  className={category === cat ? "active" : ""}
                  onClick={() => navigate(`/shop?category=${cat}&sort=${sort}`)}
                >
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="shop-content">
          <div className="shop-toolbar">
            <input
              type="text"
              placeholder="Search products..."
              value={search || searchUrlParam}
              onChange={(e) => setSearch(e.target.value)}
              className="search-input"
            />

            <select 
              value={sort} 
              onChange={(e) => navigate(`/shop?category=${category}&sort=${e.target.value}`)} 
              className="sort-select"
            >
              <option value="featured">Featured</option>
              <option value="price-low-high">Price: Low to High</option>
              <option value="price-high-low">Price: High to Low</option>
            </select>
          </div>

          {filteredAndSortedProducts.length === 0 ? (
            <p className="no-products">No products found matching criteria.</p>
          ) : (
            <div className="products-grid">
              {filteredAndSortedProducts.map((product) => {
                const isInCart = cart.some((item) => item.id === product.id);
                return (
                  <article className="product-card" key={product.id}>
                    <div className="product-image-wrapper">
                      <img src={product.image} alt={product.title} />
                      <button
                        className={`action-toggle-btn ${isInCart ? "remove-state" : "add-state"}`}
                        onClick={() => {
                          if (isInCart) {
                            removeFromCart(product.id);
                          } else {
                            addToCart({ ...product, quantity: 1 });
                          }
                        }}
                      >
                        {isInCart ? "Remove from Cart" : "Add to Cart"}
                      </button>
                    </div>
                    <div className="product-info">
                      <h4>{product.title}</h4>
                      <p>${product.price.toFixed(2)}</p>
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