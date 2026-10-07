import React from 'react';
import { useCart } from '../../context/CartContext';

export default function Toast() {
  const { toast } = useCart();

  if (!toast) return null;

  const bgStyle =
    toast.type === 'success'
      ? 'bg-primary text-on-primary border-secondary/40'
      : toast.type === 'error'
      ? 'bg-error text-on-error border-error-container'
      : 'bg-surface-container-highest text-on-surface border-outline-variant';

  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 animate-slide-up max-w-sm w-[90%]">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md ${bgStyle}`}>
        <span className="material-symbols-outlined text-[20px] text-secondary">
          {toast.type === 'success' ? 'check_circle' : toast.type === 'error' ? 'error' : 'info'}
        </span>
        <span className="font-body-sm text-sm font-medium flex-1 truncate">
          {toast.message}
        </span>
      </div>
    </div>
  );
}
