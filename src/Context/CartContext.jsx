// import { createContext, useContext, useEffect, useState } from "react";

// const CartContext = createContext();

// export function CartProvider({ children }) {
//   const [cartItems, setCartItems] = useState(() => {
//     const savedCart = localStorage.getItem("atelier-cart");

//     return savedCart ? JSON.parse(savedCart) : [];
//   });

//   useEffect(() => {
//     localStorage.setItem(
//       "atelier-cart",
//       JSON.stringify(cartItems)
//     );
//   }, [cartItems]);

//   const addToCart = (product) => {
//     setCartItems((currentItems) => {
//       const existingItem = currentItems.find(
//         (item) => item.id === product.id
//       );

//       if (existingItem) {
//         return currentItems.map((item) =>
//           item.id === product.id
//             ? {
//                 ...item,
//                 quantity: item.quantity + 1,
//               }
//             : item
//         );
//       }

//       return [
//         ...currentItems,
//         {
//           ...product,
//           quantity: 1,
//         },
//       ];
//     });
//   };

//   const removeFromCart = (productId) => {
//     setCartItems((currentItems) =>
//       currentItems.filter(
//         (item) => item.id !== productId
//       )
//     );
//   };

//   const updateQuantity = (productId, quantity) => {
//     if (quantity <= 0) {
//       removeFromCart(productId);
//       return;
//     }

//     setCartItems((currentItems) =>
//       currentItems.map((item) =>
//         item.id === productId
//           ? {
//               ...item,
//               quantity,
//             }
//           : item
//       )
//     );
//   };

//   const clearCart = () => {
//     setCartItems([]);
//   };

//   const cartCount = cartItems.reduce(
//     (total, item) => total + item.quantity,
//     0
//   );

//   const cartTotal = cartItems.reduce(
//     (total, item) =>
//       total + item.price * item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems,
//         cartCount,
//         cartTotal,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// export function useCart() {
//   return useContext(CartContext);
// }
import { createContext, useContext, useState, useEffect } from "react";

// 1. Create the base React Context container
const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    // Look for previous saved items inside local storage on system boot
    const savedCart = localStorage.getItem("atelier_cart_cache");
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Keep browser database sync updated whenever cart array shifts
  useEffect(() => {
    localStorage.setItem("atelier_cart_cache", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);
      
      if (existingItem) {
        // If product already in cart, increment quantity key
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      
      // Otherwise insert fresh cart item object profile
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

// 2. Export the matching hook that Shop.jsx is looking for
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be executed strictly within an active CartProvider");
  }
  return context;
}
