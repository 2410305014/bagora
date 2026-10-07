import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-primary-container text-on-primary py-16 px-margin-mobile md:px-margin-desktop border-t border-surface-container-high/10 pb-28 md:pb-16">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand Col */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2 mb-4">
            <span className="font-headline text-2xl font-bold tracking-tight text-on-primary">
              Bagora
            </span>
          </div>
          <p className="font-body-sm text-sm text-on-primary-container leading-relaxed">
            Quiet luxury crafted for the modern discerning individual. High-caliber materiality, ethical craftsmanship, and timeless silhouettes.
          </p>
        </div>

        {/* Collections */}
        <div>
          <h4 className="font-label-caps text-xs tracking-widest uppercase text-secondary-fixed mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 font-body-sm text-sm text-on-primary-container">
            <li><Link to="/handbags" className="hover:text-on-primary transition-colors">Totes & Carryalls</Link></li>
            <li><Link to="/handbags" className="hover:text-on-primary transition-colors">Crossbody & Minis</Link></li>
            <li><Link to="/handbags" className="hover:text-on-primary transition-colors">Clutches & Evening</Link></li>
            <li><Link to="/handbags" className="hover:text-on-primary transition-colors">The Woven Series</Link></li>
            <li><Link to="/handbags" className="hover:text-on-primary transition-colors">New Arrivals</Link></li>
          </ul>
        </div>

        {/* Client Services */}
        <div>
          <h4 className="font-label-caps text-xs tracking-widest uppercase text-secondary-fixed mb-4">
            Client Services
          </h4>
          <ul className="space-y-2.5 font-body-sm text-sm text-on-primary-container">
            <li><span className="hover:text-on-primary cursor-pointer transition-colors">Concierge Styling</span></li>
            <li><span className="hover:text-on-primary cursor-pointer transition-colors">Leather Care & Repair</span></li>
            <li><span className="hover:text-on-primary cursor-pointer transition-colors">Complimentary Shipping</span></li>
            <li><span className="hover:text-on-primary cursor-pointer transition-colors">30-Day Returns</span></li>
            <li><span className="hover:text-on-primary cursor-pointer transition-colors">Order Tracking</span></li>
          </ul>
        </div>

        {/* Craftsmanship */}
        <div>
          <h4 className="font-label-caps text-xs tracking-widest uppercase text-secondary-fixed mb-4">
            The Atelier
          </h4>
          <p className="font-body-sm text-sm text-on-primary-container mb-4 leading-relaxed">
            Every stitch is placed by certified master artisans in Tuscany using full-grain vegetable-tanned Italian leathers.
          </p>
          <div className="flex items-center gap-3 text-secondary">
            <span className="material-symbols-outlined text-[20px]">workspace_premium</span>
            <span className="font-label-caps text-xs tracking-widest uppercase text-on-primary">
              Lifetime Guarantee
            </span>
          </div>
        </div>
      </div>

      <div className="max-w-[1280px] mx-auto mt-12 pt-6 border-t border-surface-container-high/10 flex flex-col md:flex-row items-center justify-between text-xs text-on-primary-container gap-4">
        <p>© {new Date().getFullYear()} Bagora Atelier. All rights reserved.</p>
        <div className="flex gap-6">
          <span className="hover:text-on-primary cursor-pointer transition-colors">Privacy Policy</span>
          <span className="hover:text-on-primary cursor-pointer transition-colors">Terms of Service</span>
          <span className="hover:text-on-primary cursor-pointer transition-colors">Accessibility</span>
        </div>
      </div>
    </footer>
  );
}
