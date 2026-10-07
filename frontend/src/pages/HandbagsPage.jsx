import React, { useState, useEffect, useMemo } from 'react';
import { PRODUCTS } from '../data/products';
import ProductCard from '../components/common/ProductCard';
import { getProducts } from '../services/api';

export default function HandbagsPage() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured', 'price-low', 'price-high', 'rating'
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [allProducts, setAllProducts] = useState(PRODUCTS);

  const categories = ['All', 'Leather', 'Mini', 'Totes', 'Crossbody'];

  // Fetch products from backend on mount, fallback to local data
  useEffect(() => {
    getProducts()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setAllProducts(res.data);
        }
      })
      .catch(() => {});
  }, []);

  // Handbag items (including the 6 main showcase items from handbags_bagora)
  const handbagItems = useMemo(() => {
    let items = allProducts.filter((p) => {
      if (activeCategory === 'All') return true;
      if (activeCategory === 'Leather') return p.category === 'Leather' || p.subtitle?.includes('Leather') || p.category === 'Totes';
      if (activeCategory === 'Mini') return p.category === 'Mini' || p.name.includes('Mini');
      return p.category.toLowerCase() === activeCategory.toLowerCase();
    });

    if (sortBy === 'price-low') {
      items.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      items.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      items.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return items;
  }, [activeCategory, sortBy, allProducts]);

  return (
    <main className="relative w-full pt-16 bg-background min-h-screen">
      <div className="flex flex-col w-full pb-32 max-w-[1280px] mx-auto">
        {/* Header Section */}
        <div className="px-margin-mobile md:px-margin-desktop pt-6 pb-4">
          <div className="flex items-baseline justify-between mb-2">
            <h1 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-background">
              Handbags
            </h1>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              {handbagItems.length} Items
            </span>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-[340px]">
            Discover our collection of premium crafted handbags for every occasion.
          </p>
        </div>

        {/* Filter & Sort Bar (Sticky) */}
        <div className="sticky top-16 z-40 bg-background/95 backdrop-blur-md px-margin-mobile md:px-margin-desktop py-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] mb-6 flex justify-between items-center border-y border-surface-container/50">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pr-2">
            <button
              onClick={() => setActiveCategory('All')}
              className="flex items-center gap-1 px-3 py-1.5 bg-surface-container rounded-full text-on-surface font-title-sm text-xs md:text-sm shrink-0 hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">filter_list</span>
              Filter
            </button>
            <div className="flex gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`whitespace-nowrap px-4 py-1.5 rounded-full font-body-sm text-xs md:text-sm transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-on-primary font-medium'
                      : 'bg-surface text-on-surface border border-outline-variant hover:border-primary'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Menu */}
          <div className="relative shrink-0">
            <button
              onClick={() => setShowSortDropdown(!showSortDropdown)}
              aria-label="Sort"
              className="flex items-center justify-center w-10 h-10 bg-surface-container rounded-full text-on-surface hover:bg-surface-container-high transition-colors"
            >
              <span className="material-symbols-outlined text-[20px]">swap_vert</span>
            </button>

            {showSortDropdown && (
              <div className="absolute right-0 top-12 w-48 bg-surface-container-lowest rounded-xl shadow-xl border border-outline-variant/30 py-2 z-50 animate-fade-in">
                <button
                  onClick={() => { setSortBy('featured'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-body-sm hover:bg-surface-container ${sortBy === 'featured' ? 'font-bold text-secondary' : 'text-primary'}`}
                >
                  Featured
                </button>
                <button
                  onClick={() => { setSortBy('price-low'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-body-sm hover:bg-surface-container ${sortBy === 'price-low' ? 'font-bold text-secondary' : 'text-primary'}`}
                >
                  Price: Low to High
                </button>
                <button
                  onClick={() => { setSortBy('price-high'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-body-sm hover:bg-surface-container ${sortBy === 'price-high' ? 'font-bold text-secondary' : 'text-primary'}`}
                >
                  Price: High to Low
                </button>
                <button
                  onClick={() => { setSortBy('rating'); setShowSortDropdown(false); }}
                  className={`w-full text-left px-4 py-2 text-xs font-body-sm hover:bg-surface-container ${sortBy === 'rating' ? 'font-bold text-secondary' : 'text-primary'}`}
                >
                  Customer Rating
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="px-margin-mobile md:px-margin-desktop grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {handbagItems.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              showRating={true}
              showQuickAdd={true}
            />
          ))}
        </div>

        {/* Load More Button */}
        <div className="flex justify-center mt-12 mb-8 px-margin-mobile md:px-margin-desktop">
          <button
            onClick={() => setActiveCategory('All')}
            className="w-full max-w-sm py-4 bg-surface text-on-surface border border-outline-variant rounded-full font-title-sm text-title-sm hover:bg-surface-container transition-colors active:scale-98"
          >
            View All Handbags
          </button>
        </div>
      </div>
    </main>
  );
}
