import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

const INITIAL_CART = [
  {
    id: "classic-leather-tote",
    name: "The Essential Leather Tote",
    price: 495,
    color: "Noir",
    quantity: 1,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuA1vJ1E2GJYCUnEuXNiR4m9KJhp3S3Zxjm1nNEZOEVjR3NJJdIqaNmweawVAAPRmrn-gl1pB4YVCEeb74m7zcLcXafQu4NcAjyljw1UaN78FurFpiymF_nnns-QIy-8YbGwOBprle-07LgcpJSnHiAY8d-3jvyUDf5ptJA4aOKm9WIV2q9uHfG3lwjQg99T234CHe5D66FNYbKKy0jqDQFYiBYJ2HNw0sgQvEVdm-oCEXZzSNFcIryu"
  },
  {
    id: "structure-top-handle",
    name: "Structured Crossbody",
    price: 350,
    color: "Ecru",
    quantity: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDScpoo6Z6lWvPBsbQfsjwnVNXcXJvKnGltC0xssLRFlJWONQ42xHjQlmQqmbg4U0gM__GcnGxzd8eKI7mCGXHTqcrn5EXgkZiOPBbNE42CnHWxSAQHJwCuJsfnKL5pww5wl2IG5_0Vw1UIIJgqiND3Bl370cg0hian8v0jHT7d7kt8tmNpcgIb8YLKxSO5h2SCqI5LXohGTyOpJ_mvUtSy6AHoV3iHr4YcgA26KXhio_SRyc_ztEzx"
  }
];

export function CartProvider({ children }) {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem('bagora_cart');
      return saved ? JSON.parse(saved) : INITIAL_CART;
    } catch {
      return INITIAL_CART;
    }
  });

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('bagora_wishlist');
      return saved ? JSON.parse(saved) : ["luxe-leather-carryall"];
    } catch {
      return ["luxe-leather-carryall"];
    }
  });

  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem('bagora_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem('bagora_wishlist', JSON.stringify(wishlist));
    } catch (e) {
      console.error(e);
    }
  }, [wishlist]);

  const showToast = (message, type = "info") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const addToCart = (product, color = "Standard", qty = 1) => {
    setCart((prev) => {
      const existingIdx = prev.findIndex(
        (item) => item.id === product.id && item.color === color
      );
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [
        ...prev,
        {
          id: product.id,
          name: product.name,
          price: product.price,
          color: color || (product.colors && product.colors[0]?.name) || "Standard",
          quantity: qty,
          image: product.image
        }
      ];
    });
    showToast(`Added "${product.name}" to your bag`, "success");
  };

  const removeFromCart = (id, color) => {
    setCart((prev) => prev.filter((item) => !(item.id === id && item.color === color)));
    showToast("Item removed from your bag", "info");
  };

  const updateQuantity = (id, color, delta) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.id === id && item.color === color) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean);
    });
  };

  const toggleWishlist = (productId) => {
    setWishlist((prev) => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast("Removed from wishlist", "info");
        return prev.filter((id) => id !== productId);
      } else {
        showToast("Saved to wishlist", "success");
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId) => wishlist.includes(productId);

  const applyPromo = (code) => {
    const trimmed = code.trim().toUpperCase();
    if (trimmed === "LUXE10" || trimmed === "BAGORA10") {
      setAppliedPromo({ code: trimmed, discountPercent: 10 });
      showToast("Promo code applied: 10% off your order!", "success");
      return { success: true, message: "10% off applied!" };
    } else if (trimmed === "WELCOME20") {
      setAppliedPromo({ code: trimmed, discountPercent: 20 });
      showToast("VIP code applied: 20% off!", "success");
      return { success: true, message: "20% off applied!" };
    } else {
      showToast("Invalid promo code. Try 'LUXE10'", "error");
      return { success: false, message: "Invalid promo code" };
    }
  };

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const discountAmount = appliedPromo
    ? Math.round((subtotal * appliedPromo.discountPercent) / 100)
    : 0;
  const delivery = 0; // Complimentary shipping
  const total = Math.max(0, subtotal - discountAmount + delivery);

  return (
    <CartContext.Provider
      value={{
        cart,
        wishlist,
        cartCount,
        subtotal,
        discountAmount,
        appliedPromo,
        delivery,
        total,
        promoCode,
        setPromoCode,
        applyPromo,
        addToCart,
        removeFromCart,
        updateQuantity,
        toggleWishlist,
        isInWishlist,
        toast,
        showToast
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
