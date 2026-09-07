import { Routes, Route } from "react-router-dom";

import Home from "./views/Home";
import Shop from "./views/Shop";
import ProductDetails from "./views/ProductDetails";
import Checkout from "./views/Checkout";
import PaymentPage from "./views/PaymentPage";

import Cart from "./views/Cart";
import OrderConfirmation from "./views/OrderConfirmation";

import "./App.css";

function App() {
  return (
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
  );
}

export default App;

