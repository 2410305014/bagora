// Bagora Luxury API Client
// Resilient: tries backend first, gracefully falls back to local data.
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function apiFetch(endpoint, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      headers: { 'Content-Type': 'application/json' },
      ...options
    });
    const json = await res.json();
    if (!res.ok) throw { status: res.status, ...json };
    return json;
  } catch (err) {
    // Network errors (backend offline) bubble up differently from API errors
    if (err && err.success === false) throw err;
    throw { offline: true, message: err.message || 'Backend unavailable' };
  }
}

// ——— Products ———

export async function getProducts(params = {}) {
  const query = new URLSearchParams();
  if (params.category) query.set('category', params.category);
  if (params.search) query.set('search', params.search);
  if (params.sortBy) query.set('sortBy', params.sortBy);
  if (params.isBestseller) query.set('isBestseller', 'true');
  if (params.isNewArrival) query.set('isNewArrival', 'true');
  const qs = query.toString();
  return apiFetch(`/products${qs ? '?' + qs : ''}`);
}

export async function getProductById(id) {
  return apiFetch(`/products/${id}`);
}

export async function addReview(productId, reviewData) {
  return apiFetch(`/products/${productId}/reviews`, {
    method: 'POST',
    body: JSON.stringify(reviewData)
  });
}

// ——— Categories ———

export async function getCategories() {
  return apiFetch('/categories');
}

export async function getAccessories() {
  return apiFetch('/categories/accessories');
}

// ——— Promos ———

export async function validatePromo(code, subtotal = 0) {
  return apiFetch('/promos/validate', {
    method: 'POST',
    body: JSON.stringify({ code, subtotal })
  });
}

// ——— Orders / Checkout ———

export async function createOrder(orderData) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData)
  });
}

export async function getOrderById(orderId) {
  return apiFetch(`/orders/${orderId}`);
}

// ——— Newsletter ———

export async function subscribeNewsletter(email) {
  return apiFetch('/newsletter/subscribe', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}

// ——— Admin Stats ———

export async function getAdminStats() {
  return apiFetch('/admin/stats');
}
