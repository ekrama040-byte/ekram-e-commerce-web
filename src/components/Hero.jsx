import { useClothingApi } from "../hooks/useClothingApi";
import { useNavigate } from "react-router-dom";

export default function Hero() {
  const { products, loading } = useClothingApi();

  const heroProduct = products[0];
  const navigate = useNavigate();

  return (
    <section className="hero">

      {/* Background decoration */}
      <div className="hero-glow"></div>

      <div className="hero-content">

        <div className="hero-copy">

          <span className="hero-label">
            NEW SEASON / 2026 COLLECTION
          </span>

          <h1>
            ELEGANCE
            <br />
            <span>ENGINEERED</span>
          </h1>

          <p className="hero-description">
            Discover refined essentials designed for
            modern living. Premium silhouettes,
            timeless materials and effortless style.
          </p>

          <div className="hero-actions">

            <button className="primary-button" onClick={() => navigate("../views/shop.jsx")}>
               EXPLORE COLLECTION
               <span>-</span>
             </button>

            <button className="secondary-button">
              EXPLORE LOOKBOOK
            </button>

          </div>

          <div className="hero-metrics">

            <div>
              <strong>01</strong>
              <span>NEW<br />COLLECTION</span>
            </div>

            <div>
              <strong>24</strong>
              <span>CURATED<br />PIECES</span>
            </div>

            <div>
              <strong>∞</strong>
              <span>TIMELESS<br />STYLE</span>
            </div>

          </div>

        </div>

        <div className="hero-product">

          <div className="hero-product-frame">

            {loading ? (
              <div className="hero-loading">
                Loading collection...
              </div>
            ) : heroProduct ? (
              <>
                <img
                  src={heroProduct.image}
                  alt={heroProduct.title}
                />

                <div className="hero-product-info">
                  <span>FEATURED PIECE</span>

                  <h3>
                    {heroProduct.displayName}
                  </h3>

                  <p>
                    ${heroProduct.price.toFixed(2)}
                  </p>
                </div>
              </>
            ) : (
              <div className="hero-loading">
                No product available
              </div>
            )}

          </div>

          <div className="hero-side-text">
            <span>01 / 03</span>
            <span>FEATURED</span>
          </div>

        </div>

      </div>

      <div className="hero-bottom-line">
        <span>SCROLL TO DISCOVER</span>
        <span>↓</span>
      </div>

    </section>
  );
}