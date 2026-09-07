import { useMemo, useState } from "react";
import { useClothingApi } from "../hooks/useClothingApi";

export default function AdminDashboard() {
  const { products, loading, error } = useClothingApi();

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("All");
  const [hiddenProducts, setHiddenProducts] = useState([]);

  // Hide/remove product from admin inventory view
  const toggleProductVisibility = (id) => {
    setHiddenProducts((current) => {
      if (current.includes(id)) {
        return current.filter((productId) => productId !== id);
      }

      return [...current, id];
    });
  };

  // Visible products
  const activeProducts = products.filter(
    (product) => !hiddenProducts.includes(product.id)
  );

  // Filter inventory
  const filteredProducts = useMemo(() => {
    return activeProducts.filter((product) => {
      const matchesSearch = product.title
        .toLowerCase()
        .includes(search.toLowerCase());

      const matchesGender =
        gender === "All" ||
        product.genderCategory === gender;

      return matchesSearch && matchesGender;
    });
  }, [activeProducts, search, gender]);

  // Statistics
  const totalProducts = products.length;

  const menProducts = products.filter(
    (product) => product.genderCategory === "Men"
  ).length;

  const womenProducts = products.filter(
    (product) => product.genderCategory === "Women"
  ).length;

  const averagePrice =
    products.length > 0
      ? products.reduce(
          (total, product) => total + product.price,
          0
        ) / products.length
      : 0;

  if (loading) {
    return (
      <div className="dashboard-state">
        <h2>Loading admin dashboard...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-state error">
        <h2>Dashboard Error</h2>
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">

      {/* Header */}
      <header className="dashboard-header">

        <div>
          <p className="eyebrow">ADMIN PORTAL</p>

          <h1>Store Dashboard</h1>

          <p>
            Manage your clothing catalog and monitor
            store performance.
          </p>
        </div>

        <div className="admin-badge">
          ADMIN
        </div>

      </header>

      {/* Statistics */}
      <section className="stats-grid">

        <div className="stat-card">
          <span className="stat-label">
            Total Products
          </span>

          <strong>
            {totalProducts}
          </strong>

          <small>
            Products in catalog
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Men's Collection
          </span>

          <strong>
            {menProducts}
          </strong>

          <small>
            Men's products
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Women's Collection
          </span>

          <strong>
            {womenProducts}
          </strong>

          <small>
            Women's products
          </small>
        </div>

        <div className="stat-card">
          <span className="stat-label">
            Average Price
          </span>

          <strong>
            ${averagePrice.toFixed(2)}
          </strong>

          <small>
            Across all products
          </small>
        </div>

      </section>

      {/* Management */}
      <section className="admin-content">

        <div className="admin-toolbar">

          <div>
            <h2>Product Inventory</h2>
            <p>
              Manage products currently available
              in your catalog.
            </p>
          </div>

          <button
            className="add-product-button"
            onClick={() =>
              alert("Add product functionality coming soon!")
            }
          >
            + Add Product
          </button>

        </div>

        {/* Search and filters */}
        <div className="admin-filters">

          <input
            type="text"
            placeholder="Search inventory..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

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

        {/* Inventory table */}
        <div className="inventory-table-wrapper">

          <table className="inventory-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>Category</th>
                <th>Price</th>
                <th>Product ID</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.map((product) => (

                <tr key={product.id}>

                  <td>
                    <div className="admin-product">

                      <img
                        src={product.image}
                        alt={product.title}
                      />

                      <div>
                        <strong>
                          {product.displayName}
                        </strong>

                        <small>
                          {product.title}
                        </small>
                      </div>

                    </div>
                  </td>

                  <td>
                    <span className="category-badge">
                      {product.genderCategory}
                    </span>
                  </td>

                  <td>
                    <strong>
                      ${product.price.toFixed(2)}
                    </strong>
                  </td>

                  <td>
                    #{product.id}
                  </td>

                  <td>

                    <button
                      className="delete-button"
                      onClick={() =>
                        toggleProductVisibility(product.id)
                      }
                    >
                      Remove
                    </button>

                  </td>

                </tr>

              ))}

            </tbody>

          </table>

          {filteredProducts.length === 0 && (
            <div className="empty-state">
              <h3>No products found</h3>
              <p>
                Try changing your search or category filter.
              </p>
            </div>
          )}

        </div>

      </section>

    </div>
  );
}