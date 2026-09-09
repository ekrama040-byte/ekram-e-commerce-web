import { Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import Shop from "./views/Shop";
import ProductDetails from "./views/ProductDetails";
import Checkout from "./views/Checkout";
import PaymentPage from "./views/PaymentPage";

import Cart from "./views/Cart";
import OrderConfirmation from "./views/OrderConfirmation";
import { CartProvider } from './context/CartContext'; 
import "./App.css";

function App() {
  return (
    // 1. Wrap your entire routing system here
    <CartProvider>
      <Routes>

        {/* HOME */}
        <Route
          path="/"
          element={<Home />}
        />

        {/* SHOP */}
        <Route
          path="/shop"
          element={<Shop />}
        />

        {/* PRODUCT */}
        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />

        {/* CART */}
        <Route
          path="/cart"
          element={<Cart />}
        />

        {/* CHECKOUT */}
        <Route
          path="/checkout"
          element={<Checkout />}
        />

        {/* PAYMENT */}
        <Route
          path="/payment"
          element={<PaymentPage />}
        />

        {/* ORDER CONFIRMATION */}
        <Route
          path="/order-confirmation"
          element={<OrderConfirmation />}
        />

      </Routes>
    </CartProvider> // 2. Don't forget to close it here
  );
}

export default App;
