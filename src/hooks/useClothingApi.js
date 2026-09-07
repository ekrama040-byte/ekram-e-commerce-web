import { useState, useEffect } from "react";

export function useClothingApi() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadCatalogData() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          "https://fakestoreapi.com/products"
        );

        if (!response.ok) {
          throw new Error(
            "Network response failed to fetch products."
          );
        }

        const items = await response.json();

        const clothingItems = items
          .filter(
            (item) =>
              item.category === "men's clothing" ||
              item.category === "women's clothing"
          )
          .map((item) => ({
            ...item,

            displayName: item.title
              .split(" ")
              .slice(0, 3)
              .join(" "),

            genderCategory:
              item.category === "men's clothing"
                ? "Men"
                : "Women",
          }));

        setProducts(clothingItems);
      } catch (err) {
        console.error(
          "Critical error connecting to product API:",
          err
        );

        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadCatalogData();
  }, []);

  return {
    products,
    loading,
    error,
  };
}