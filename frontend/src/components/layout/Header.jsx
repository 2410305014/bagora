import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import SearchModal from '../common/SearchModal';

export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const { cartCount, wishlist } = useCart();
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Handbags", path: "/handbags" },
    { name: "Cart", path: "/cart" }
  ];

  return (
    <>
      <header className="fixed top-0 w-full z-50 bg-surface/90 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] pt-safe">
        <div className="h-16 px-margin-mobile md:px-margin-desktop max-w-[1280px] mx-auto flex items-center justify-between">
          {/* Brand Logo & Name */}
          <Link to="/" className="flex items-center gap-stack-sm group">
            <img
              alt="Bagora Brand Logo"
              className="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              src="/assets/logo.png"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuCFTFAOZ3W1dAvGwfrbB1Jiw8zF4pKNWGS7WRiDYTbUBniN1XviH0SsKICEhJIRB5DetuSHt9vLBuY-181qzJzIMn7uTI4rheSVOjhP5Q6kyr9jUk_1p1gVxXYAL2lOIXk3ZFJJlWgst0jX82M7Msus1HdBTnk7ct59q8zOOsIpigIYPiSBijh69x0SHbhclQQY7-CBqR8uqxRO0tQIMOYobKPcuW9SWn-SvUz8byRRfA28St4IXta4";
              }}
            />
            <span className="font-headline text-2xl font-bold tracking-tight text-primary">
              Bagora
            </span>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`font-label-caps text-xs tracking-widest uppercase transition-colors hover:text-secondary relative py-1 ${
                    isActive ? "text-primary font-bold" : "text-on-surface-variant"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-[2px] bg-secondary"></span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-2 md:gap-4">
            {/* Search Trigger */}
            <button
              onClick={() => setSearchOpen(true)}
              aria-label="Search"
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface text-[22px]">search</span>
            </button>

            {/* Desktop Wishlist Link */}
            <Link
              to="/handbags"
              aria-label="Wishlist"
              className="hidden md:flex relative w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface text-[22px]">favorite_border</span>
              {wishlist.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-secondary rounded-full"></span>
              )}
            </Link>

            {/* Desktop Cart Link */}
            <Link
              to="/cart"
              aria-label="Shopping Cart"
              className="hidden md:flex relative w-10 h-10 items-center justify-center rounded-full hover:bg-surface-container transition-colors"
            >
              <span className="material-symbols-outlined text-on-surface text-[22px]">shopping_bag</span>
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 bg-secondary text-on-secondary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Profile Avatar */}
            <div className="flex items-center">
              <img
                alt="Profile"
                className="w-8 h-8 rounded-full object-cover ring-2 ring-surface-container-high cursor-pointer"
                src="/assets/profile.png"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://lh3.googleusercontent.com/aida-public/AB6AXuAygWRR1EG_b6H5Vdzdpe-EJMtzc9sHeWxlqMWEMnibHpQUGF-mw6snVrJ-1RkyIRCRfGMrc7c0WBNy0I3s86ABmO-5cXyPjBwgivAx0uQOWTuWiLi_EZHU7iJtP5Ef3bFJPF2XO6xbfwORruepFllzuT6UhUKUi0EWWN8QfCQz4Mra7ejs3VtEJooNyLaglQvxc1pgl-A7dE5MINShrYdeSnrPHd0749FHwJeLtk1xE9bgINMwmYY7";
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
