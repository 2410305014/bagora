# Bagora Luxury E-Commerce — React Frontend

This directory contains the production-grade React application converted from the **Google Stitch** design files, adhering to the **"Quiet Luxury"** design specification.

## Tech Stack
- **Framework**: React 18 + Vite
- **Routing**: React Router DOM v6
- **Styling**: Tailwind CSS configured with custom Bagora tokens (`DESIGN.md`)
- **Typography**: Playfair Display (Headlines/Display) & Inter (UI/Body)
- **Icons**: Material Symbols Outlined (with optical size and fill variation support)
- **State Management**: React Context (`CartContext`) for cart items, quantities, promo codes, and wishlist

---

## Directory Architecture

```
frontend/
├── index.html                 # Main HTML with font imports & meta tags
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration
├── tailwind.config.js         # Bagora Quiet Luxury color, font, and spacing tokens
├── postcss.config.js          # PostCSS configuration
├── public/
│   └── assets/                # High-res brand logos, model headshots, and hero photography
└── src/
    ├── main.jsx               # React entry point with BrowserRouter
    ├── App.jsx                # Layout wrapper, routing, toasts, navigation
    ├── index.css              # Tailwind layers, scrollbar hiding, and smooth animations
    ├── context/
    │   └── CartContext.jsx    # Cart & Wishlist state, quantity steppers, promo calculation
    ├── data/
    │   └── products.js        # Normalized product dataset with colorways, galleries, and reviews
    ├── components/
    │   ├── layout/
    │   │   ├── Header.jsx     # Sticky header with brand logo, search modal trigger, and avatar
    │   │   ├── BottomNav.jsx  # Mobile 5-tab bar with live cart/wishlist badge counts
    │   │   └── Footer.jsx     # Luxury editorial footer & brand story
    │   └── common/
    │       ├── ProductCard.jsx# Reusable product card with wishlist toggle & quick-add
    │       ├── SearchModal.jsx# Instant search dialog with keyword tags and live filtering
    │       └── Toast.jsx      # Feedback toast for cart actions and promotions
    └── pages/
        ├── HomePage.jsx       # Hero, Category slider, Bestsellers, The Woven Series, New Arrivals
        ├── HandbagsPage.jsx   # Catalog listing, sticky category filter chips (All/Leather/Mini), sort menu
        ├── ProductDetailPage.jsx # Multi-image gallery carousel, color switcher, info tabs, "Complete the Look"
        └── CartPage.jsx       # Real-time cart items, quantity stepper, promo code (LUXE10), order summary
```

---

## Getting Started

### Development
```bash
npm install
npm run dev
```
The application will launch at `http://localhost:5173/`.

### Production Build
```bash
npm run build
```
Creates an optimized production bundle in `dist/`.

---

## Converted Pages & Routes

1. **Home (`/`)**: Converted from `home_bagora/code.html` and `bagora_luxury_handbag_app/code.html`.
2. **Handbags Catalog (`/handbags`)**: Converted from `handbags_bagora/code.html`.
3. **Product Detail (`/product/:id`)**: Converted from `luxe_leather_carryall_bagora/code.html` (supporting dynamic ID navigation).
4. **Shopping Bag (`/cart`)**: Converted from `my_cart_bagora/code.html`.
