// 
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import { useState, useMemo } from "react";
import { useClothingApi } from "../hooks/useClothingApi";

// Ensure you create a ProductDetails.css file!

export default function ProductDetails() {
  const { id } = useParams(); // 1. Correctly reading the unique /:id string parameter from the URL address path
  const navigate = useNavigate();
  const { products, loading, error } = useClothingApi();
  const { addToCart: globalAddToCart } = useCart(); // 2. Pulling the dynamic cart connection function from Context

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("M");
  const [activeImage, setActiveImage] = useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isSearchInput, setIsSearchInput] = useState("");
  const { cart, addToCart, removeFromCart } = useCart();
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
  

  // 3. Find target product profile matching the active URL route string safely
  const product = useMemo(() => {
    if (!products) return null;
    return products.find((item) => item.id === Number(id));
  }, [products, id]);

  if (loading) {
    return (
      <div className="details-state">
        <p>LOADING PRODUCT...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="details-state">
        <h2>Unable to load product</h2>
        <p>{error}</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="details-state">
        <h2>Product Not Found</h2>
        {/* 4. Corrected to smooth navigate redirection */}
        <button className="primary-button" onClick={() => navigate("/shop")}>
          RETURN TO COLLECTION
        </button>
      </div>
    );
  }

  const relatedProducts = products
    .filter((item) => item.id !== product.id && item.genderCategory === product.genderCategory)
    .slice(0, 3);

  const images = [
    product.image,
    product.image,
    product.image,
  ];

  const increaseQuantity = () => setQuantity((current) => current + 1);
  const decreaseQuantity = () => setQuantity((current) => (current > 1 ? current - 1 : 1));

  // 5. Connect the add logic directly into your operational cart provider
  const handleAddToCart = () => {
    // Adding the specific quantity chosen by the user
    for (let i = 0; i < quantity; i++) {
      globalAddToCart(product);
    }
    alert(`${quantity} × ${product.displayName || product.title} successfully added to your bag.`);
  };

  const buyNow = () => {
    // Add to cart and push straight into checkout route path instantly
    for (let i = 0; i < quantity; i++) {
      globalAddToCart(product);
    }
    navigate("/checkout");
  };

  return (
    <div className="product-details-page">

      {/* =====================================
          NAVIGATION
      ===================================== */}
      <nav className="luxury-navbar">
        <button className="details-back" onClick={() => navigate("/shop")}>
          ← BACK TO COLLECTION
        </button>

        <div className="brand" onClick={() => navigate("/")} style={{ cursor: "pointer" }}>
          ORVEX 
          <span>STUDIO</span>
        </div>

        <div className="nav-icons">
          <button
            aria-label="Search"
            onClick={() => setIsSearchOpen(!isSearchOpen)}
            className={isSearchOpen ? "active-icon" : ""}
          >
            ⌕
          </button>
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

      {/* =====================================
          BREADCRUMB
      ===================================== */}
      <div className="details-breadcrumb">
        <span onClick={() => navigate("/")} style={{ cursor: "pointer" }}>HOME</span>
        <b>/</b>
        <span onClick={() => navigate(`/shop?category=${product.genderCategory.toLowerCase()}`)} style={{ cursor: "pointer" }}>
          {product.genderCategory.toUpperCase()}
        </span>
        <b>/</b>
        <span>{(product.displayName || product.title).toUpperCase()}</span>
      </div>

      {/* =====================================
          PRODUCT MAIN
      ===================================== */}
      <main className="product-details-main">

        {/* LEFT - IMAGE GALLERY */}
        <section className="product-gallery">
          <div className="gallery-thumbnails">
            {images.map((image, index) => (
              <button
                key={index}
                className={activeImage === index ? "thumbnail active" : "thumbnail"}
                onClick={() => setActiveImage(index)}
              >
                <img src={image} alt={`${product.title} view ${index + 1}`} />
              </button>
            ))}
          </div>

          <div className="main-product-image">
            <span className="image-index">0{activeImage + 1} / 03</span>
            <img src={images[activeImage]} alt={product.title} />
            <div className="image-corner-label">ATELIER NOIR</div>
          </div>
        </section>

        {/* RIGHT - PRODUCT INFORMATION */}
        <section className="product-information-panel">
          <div className="product-detail-label">
            {product.genderCategory} / ESSENTIAL
          </div>

          <h1>{product.title}</h1>

          <div className="product-rating">
            <span className="stars">★★★★★</span>
            <span>4.8</span>
            <span className="review-count">/ 124 REVIEWS</span>
          </div>

          <div className="detail-price">${product.price.toFixed(2)}</div>
          <div className="price-note">Complimentary shipping on orders over $150</div>
          
          <div className="detail-divider"></div>

          {/* Description */}
          <div className="detail-description">
            <h3>THE PIECE</h3>
            <p>{product.description}</p>
          </div>

          {/* Size */}
          <div className="size-section">
            <div className="size-heading">
              <span>SELECT SIZE</span>
              <button>SIZE GUIDE</button>
            </div>

            <div className="size-options">
              {["XS", "S", "M", "L", "XL"].map((size) => (
                <button
                  key={size}
                  className={selectedSize === size ? "size-option selected" : "size-option"}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div className="quantity-section">
            <span>QUANTITY</span>
            <div className="quantity-selector">
              <button onClick={decreaseQuantity}>−</button>
              <span>{quantity}</span>
              <button onClick={increaseQuantity}>+</button>
            </div>
          </div>

          {/* Buttons */}
          <div className="detail-actions">
            <button className="detail-add-button" onClick={handleAddToCart}>
              ADD TO BAG
              <span>→</span>
            </button>

            <button className="detail-buy-button" onClick={buyNow}>
              BUY NOW
            </button>
          </div>

          {/* Service information */}
          <div className="service-information">
            <div>
              <span>01</span>
              <div>
                <strong>COMPLIMENTARY SHIPPING</strong>
                <p>Free standard delivery on qualifying orders.</p>
              </div>
            </div>

            <div>
              <span>02</span>
              <div>
                <strong>EASY RETURNS</strong>
                <p>Return within 30 days of delivery.</p>
              </div>
            </div>

            <div>
              <span>03</span>
              <div>
                <strong>SECURE CHECKOUT</strong>
                <p>Your payment information is protected.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* {/* RELATED PRODUCTS FOOTER COMPONENT */}
<section className="related-products-section" style={{ padding: "40px 5%", backgroundColor: "#0b0b0b", color: "#fff" }}>
  <h3 style={{ fontSize: "1.2rem", fontWeight: "600", letterSpacing: "2px", marginBottom: "24px", color: "#a5a5a5" }}>
    RELATED ESSENTIALS
  </h3>
  
  <div className="related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "24px" }}>
    {relatedProducts.map((item) => (
      <div 
        key={item.id} 
        className="related-card" 
        onClick={() => { navigate(`/product/${item.id}`); setQuantity(1); }}
        style={{ cursor: "pointer", backgroundColor: "#121212", padding: "16px", borderRadius: "4px", display: "flex", flexDirection: "column", gap: "12px" }}
      >
        {/* THIS PREVENTS THE IMAGE FROM STRETCHING MASSIVELY */}
        <div style={{ width: "100%", height: "240px", backgroundColor: "#fff", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "2px" }}>
          <img 
            src={item.image} 
            alt={item.title} 
            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", padding: "12px" }} 
          />
        </div>
        
        <h4 style={{ fontSize: "0.95rem", fontWeight: "400", margin: "0", color: "#fff", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
          {item.displayName || item.title}
        </h4>
        
        <strong style={{ fontSize: "1.1rem", fontWeight: "600", color: "#fff" }}>
          ${item.price.toFixed(2)}
        </strong>
      </div>
    ))}
  </div>
</section>
</div>
);
}
