import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

export default function BottomNav() {
  const location = useLocation();
  const { cartCount, wishlist } = useCart();

  const navItems = [
    {
      name: "Home",
      path: "/",
      icon: "home",
      badge: null
    },
    {
      name: "Shop",
      path: "/handbags",
      icon: "grid_view",
      badge: null
    },
    {
      name: "Wish",
      path: "/handbags",
      icon: "favorite",
      badge: wishlist.length > 0 ? wishlist.length : null
    },
    {
      name: "Cart",
      path: "/cart",
      icon: "shopping_bag",
      badge: cartCount > 0 ? cartCount : null
    },
    {
      name: "Me",
      path: "/cart",
      icon: "person",
      badge: null
    }
  ];

  return (
    <nav
      className="md:hidden fixed bottom-0 w-full z-50 pb-safe bg-surface/95 backdrop-blur-xl shadow-[0_-1px_8px_rgba(0,0,0,0.04)] border-t border-surface-container"
      data-active-classes="text-primary"
    >
      <div className="flex justify-around items-center h-16 px-2 max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.name}
              to={item.path}
              aria-current={isActive ? "page" : undefined}
              className={`relative flex flex-col items-center justify-center w-14 h-14 transition-colors ${
                isActive ? "text-primary font-semibold" : "text-on-surface-variant hover:text-primary"
              }`}
            >
              <span
                className="material-symbols-outlined text-[24px]"
                style={{
                  fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0"
                }}
              >
                {item.icon}
              </span>
              <span className="font-label-caps text-[10px] tracking-wider mt-0.5 uppercase">
                {item.name}
              </span>

              {item.badge !== null && (
                <div className="absolute top-1.5 right-2 bg-secondary text-on-secondary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {item.badge}
                </div>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
