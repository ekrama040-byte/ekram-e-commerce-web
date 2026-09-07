import { useMemo, useState } from "react";
import { useClothingApi } from "../hooks/useClothingApi";
import ApparelGridCard from "../components/ApparelGridCard";

export default function CustomerPortal() {
  const { products, loading, error } = useClothingApi();

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [cart, setCart] = useState([]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesGender =
        gender === "All" || product.genderCategory === gender;

      return matchesSearch && matchesGender;
    });
  }, [products, search, gender]);

  // Add product to cart
  const addToCart = (product) => {
    setCart((currentCart) => {
      const existingProduct = currentCart.find(
        (item) => item.id === product.id
      );

      if (existingProduct) {
        return currentCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...currentCart, { ...product, quantity: 1 }];
    });
  };

  // Increase quantity
  const increaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart.map((item) =>
        item.id === id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  // Decrease quantity
  const decreaseQuantity = (id) => {
    setCart((currentCart) =>
      currentCart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  // Remove item
  const removeFromCart = (id) => {
    setCart((currentCart) =>
      currentCart.filter((item) => item.id !== id)
    );
  };

  // Cart calculations
  const cartCount = cart.reduce(
    (total, item) => total + item.quantity,
    0
  );

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (loading) {
    return (
      <div className="dashboard-state">
        <h2>Loading products...</h2>
        <p>Please wait while we load the clothing catalog.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-state error">
        <h2>Unable to load products</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="customer-dashboard">

      {/* Header */}
      <header className="dashboard-header">
        <div>
          <p className="eyebrow">CUSTOMER PORTAL</p>
          <h1>Discover Your Style</h1>
          <p>
            Browse our latest collection and find something
            perfect for you.
          </p>
        </div>

        <div className="cart-summary">
          🛒 Cart
          <span>{cartCount}</span>
        </div>
      </header>

      {/* Search and filters */}
      <section className="catalog-controls">

        <input
          type="text"
          placeholder="Search clothing..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-buttons">
          <button
            className={gender === "All" ? "active" : ""}
            onClick={() => setGender("All")}
          >
            All
          </button>

          <button
            className={gender === "Men" ? "active" : ""}
            onClick={() => setGender("Men")}
          >
            Men
          </button>

          <button
            className={gender === "Women" ? "active" : ""}
            onClick={() => setGender("Women")}
          >
            Women
          </button>
        </div>
      </section>

      {/* Main content */}
      <div className="customer-layout">

        {/* Products */}
        <main className="products-section">

          <div className="section-heading">
            <h2>Latest Collection</h2>

            <span>
              {filteredProducts.length} products
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>Try changing your search or filter.</p>
            </div>
          ) : (
            <div className="product-grid">
              {filteredProducts.map((product) => (
                <ApparelGridCard
                  key={product.id}
                  product={product}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </div>
          )}

        </main>

        {/* Cart */}
        <aside className="cart-panel">

          <div className="cart-header">
            <h2>Your Cart</h2>
            <span>{cartCount} items</span>
          </div>

          {cart.length === 0 ? (
            <div className="empty-cart">
              <div className="cart-icon">🛒</div>
              <h3>Your cart is empty</h3>
              <p>
                Add some products from the collection.
              </p>
            </div>
          ) : (
            <>
              <div className="cart-items">

                {cart.map((item) => (
                  <div
                    className="cart-item"
                    key={item.id}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                    />

                    <div className="cart-item-info">

                      <h4>{item.displayName}</h4>

                      <p>
                        ${item.price.toFixed(2)}
                      </p>

                      <div className="quantity-controls">

                        <button
                          onClick={() =>
                            decreaseQuantity(item.id)
                          }
                        >
                          −
                        </button>

                        <span>{item.quantity}</span>

                        <button
                          onClick={() =>
                            increaseQuantity(item.id)
                          }
                        >
                          +
                        </button>

                      </div>

                    </div>

                    <button
                      className="remove-button"
                      onClick={() =>
                        removeFromCart(item.id)
                      }
                    >
                      ×
                    </button>
                  </div>
                ))}

              </div>

              <div className="cart-footer">

                <div className="cart-total">
                  <span>Total</span>
                  <strong>
                    ${cartTotal.toFixed(2)}
                  </strong>
                </div>

                <button
                  className="checkout-button"
                  onClick={() =>
                    alert("Checkout functionality coming soon!")
                  }
                >
                  Proceed to Checkout
                </button>

              </div>
            </>
          )}

        </aside>

      </div>
    </div>
  );
}