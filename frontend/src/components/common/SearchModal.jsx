import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PRODUCTS } from '../../data/products';

export default function SearchModal({ isOpen, onClose }) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  if (!isOpen) return null;

  const filtered = query.trim()
    ? PRODUCTS.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase()) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(query.toLowerCase()))
      )
    : [];

  const handleSelectProduct = (id) => {
    onClose();
    navigate(`/product/${id}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface-container-lowest w-full max-w-lg rounded-2xl shadow-2xl border border-outline-variant/30 overflow-hidden">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-surface-container">
          <span className="material-symbols-outlined text-on-surface-variant mr-2">search</span>
          <input
            type="text"
            placeholder="Search handbags, totes, clutches..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-primary text-base font-body-md outline-none placeholder:text-on-surface-variant"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-on-surface-variant hover:text-primary mr-2"
            >
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-label-caps tracking-wider text-on-surface-variant hover:text-primary uppercase py-1 px-2"
          >
            Cancel
          </button>
        </div>

        {/* Quick Suggestion Tags */}
        {!query && (
          <div className="p-4">
            <p className="text-xs font-label-caps uppercase tracking-wider text-on-surface-variant mb-3">
              Popular Searches
            </p>
            <div className="flex flex-wrap gap-2">
              {['Tote Bag', 'Luxe Carryall', 'Crossbody', 'Mini', 'Leather'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-3 py-1.5 rounded-full bg-surface-container text-xs font-body-sm text-on-surface hover:bg-primary hover:text-on-primary transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        {query && (
          <div className="max-h-80 overflow-y-auto p-3 divide-y divide-surface-container">
            {filtered.length > 0 ? (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleSelectProduct(item.id)}
                  className="flex items-center gap-3 p-2 rounded-xl hover:bg-surface-container cursor-pointer transition-colors"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-12 h-12 rounded-lg object-cover bg-surface-container"
                  />
                  <div className="flex-1">
                    <h4 className="font-title-sm text-sm text-primary">{item.name}</h4>
                    <p className="text-xs text-on-surface-variant">{item.category} • ${item.price}</p>
                  </div>
                  <span className="material-symbols-outlined text-on-surface-variant text-[18px]">
                    arrow_forward_ios
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-on-surface-variant text-sm">
                No products found for "{query}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
