import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_PRODUCTS } from '../data/initialProducts.js';
import { INITIAL_CATEGORIES, INITIAL_ACCESSORIES } from '../data/initialCategories.js';
import { INITIAL_PROMOS } from '../data/initialPromos.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '..', 'data', 'db.json');

// In-memory mutex queue to ensure atomic file writes
let writePromise = Promise.resolve();

async function readDb() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      const initialDb = {
        products: INITIAL_PRODUCTS,
        categories: INITIAL_CATEGORIES,
        accessories: INITIAL_ACCESSORIES,
        promos: INITIAL_PROMOS,
        orders: [
          {
            id: "BGR-10492-LUXE",
            createdAt: "2026-09-15T10:30:00Z",
            customer: {
              name: "Eleanor Vance",
              email: "eleanor.vance@vogue.fr",
              address: "14 Rue du Faubourg Saint-Honoré",
              city: "Paris",
              postalCode: "75008",
              country: "France"
            },
            items: [
              {
                id: "classic-leather-tote",
                name: "The Classic Tote",
                price: 495,
                color: "Noir",
                quantity: 1,
                image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDaoekvve_D0QYIFd1bQXLlkyeMIqTyA433JSaiyDFWAXfPeCmDvEVsQMlo0XCwWOc_nvstOU0kRIi4OIauXQgphiKN2nJmvtEUG0l76FE2-eKipc_dHRWCT7ss5kR_oLhZjb3EFA7XatDtfwR-sOp2uzixBFXltDRuWRVRWrcmK8TZtqY8gnP-IlAY956LCU3RwkBgUdKyKmYQ5iE2VmMX8qJccfFhd_GWSBbTq71nUerKlEos5FUl"
              }
            ],
            subtotal: 495,
            discount: 49.5,
            promoCode: "LUXE10",
            shipping: 0,
            total: 445.5,
            status: "Delivered",
            paymentMethod: "Credit Card (ending in 8842)",
            trackingNumber: "FEDEX-LUXE-94829104"
          }
        ],
        subscribers: [
          { email: "vip.collector@bagora.luxury", subscribedAt: "2026-09-01T12:00:00Z" }
        ],
        conciergeInquiries: []
      };
      await writeDb(initialDb);
      return initialDb;
    }
    throw error;
  }
}

async function writeDb(data) {
  writePromise = writePromise.then(async () => {
    const dir = path.dirname(DB_PATH);
    await fs.mkdir(dir, { recursive: true });
    const tempPath = `${DB_PATH}.tmp`;
    await fs.writeFile(tempPath, JSON.stringify(data, null, 2), 'utf-8');
    await fs.rename(tempPath, DB_PATH);
  });
  return writePromise;
}

export const db = {
  // PRODUCTS
  async getProducts() {
    const data = await readDb();
    return data.products || [];
  },

  async getProductById(id) {
    const data = await readDb();
    return (data.products || []).find((p) => p.id === id);
  },

  async addProduct(newProduct) {
    const data = await readDb();
    const id = newProduct.id || newProduct.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const product = {
      ...newProduct,
      id,
      rating: newProduct.rating || 5.0,
      reviewsCount: newProduct.reviewsCount || 0,
      reviews: newProduct.reviews || [],
      createdAt: new Date().toISOString()
    };
    data.products.push(product);
    await writeDb(data);
    return product;
  },

  async updateProduct(id, updates) {
    const data = await readDb();
    const idx = data.products.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    data.products[idx] = { ...data.products[idx], ...updates, updatedAt: new Date().toISOString() };
    await writeDb(data);
    return data.products[idx];
  },

  async deleteProduct(id) {
    const data = await readDb();
    const initialLen = data.products.length;
    data.products = data.products.filter((p) => p.id !== id);
    if (data.products.length !== initialLen) {
      await writeDb(data);
      return true;
    }
    return false;
  },

  async addProductReview(productId, review) {
    const data = await readDb();
    const product = data.products.find((p) => p.id === productId);
    if (!product) return null;

    if (!product.reviews) product.reviews = [];
    const newReview = {
      id: `rev-${Date.now()}`,
      author: review.author || 'Verified Client',
      rating: Number(review.rating) || 5,
      date: new Date().toISOString().split('T')[0],
      comment: review.comment || ''
    };
    product.reviews.unshift(newReview);
    product.reviewsCount = product.reviews.length;
    
    // Recalculate average rating
    const sum = product.reviews.reduce((acc, r) => acc + r.rating, 0);
    product.rating = Number((sum / product.reviews.length).toFixed(1));

    await writeDb(data);
    return { product, review: newReview };
  },

  // CATEGORIES & ACCESSORIES
  async getCategories() {
    const data = await readDb();
    return data.categories || [];
  },

  async getAccessories() {
    const data = await readDb();
    return data.accessories || [];
  },

  // PROMOS
  async getPromos() {
    const data = await readDb();
    return data.promos || [];
  },

  async getPromoByCode(code) {
    if (!code) return null;
    const data = await readDb();
    const normalized = code.trim().toUpperCase();
    return (data.promos || []).find((p) => p.code.toUpperCase() === normalized && p.active);
  },

  // ORDERS
  async getOrders() {
    const data = await readDb();
    return data.orders || [];
  },

  async getOrderById(id) {
    const data = await readDb();
    return (data.orders || []).find((o) => o.id === id);
  },

  async createOrder(orderData) {
    const data = await readDb();
    const randomSuffix = Math.floor(100000 + Math.random() * 900000);
    const orderId = `BGR-${randomSuffix}-LUXE`;
    
    const newOrder = {
      id: orderId,
      createdAt: new Date().toISOString(),
      customer: orderData.customer || {
        name: "Valued Client",
        email: "client@bagora.luxury"
      },
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      promoCode: orderData.promoCode || null,
      shipping: Number(orderData.shipping) || 0,
      total: Number(orderData.total) || 0,
      status: "Atelier Crafting",
      paymentMethod: orderData.paymentMethod || "Credit Card (White Glove Escrow)",
      trackingNumber: `CARRIER-BGR-${randomSuffix}`
    };

    data.orders.unshift(newOrder);

    // Update stock levels for purchased items
    for (const item of newOrder.items) {
      const prod = data.products.find((p) => p.id === item.id);
      if (prod && typeof prod.stock === 'number') {
        prod.stock = Math.max(0, prod.stock - (item.quantity || 1));
      }
    }

    await writeDb(data);
    return newOrder;
  },

  async updateOrderStatus(id, status) {
    const data = await readDb();
    const order = (data.orders || []).find((o) => o.id === id);
    if (!order) return null;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    await writeDb(data);
    return order;
  },

  // SUBSCRIBERS
  async getSubscribers() {
    const data = await readDb();
    return data.subscribers || [];
  },

  async addSubscriber(email) {
    const data = await readDb();
    if (!data.subscribers) data.subscribers = [];
    const normalized = email.trim().toLowerCase();
    const exists = data.subscribers.some((s) => s.email === normalized);
    if (exists) {
      return { email: normalized, alreadySubscribed: true };
    }
    const subscriber = {
      email: normalized,
      subscribedAt: new Date().toISOString()
    };
    data.subscribers.push(subscriber);
    await writeDb(data);
    return { email: normalized, alreadySubscribed: false };
  },

  // CONCIERGE INQUIRIES
  async addConciergeInquiry(inquiry) {
    const data = await readDb();
    if (!data.conciergeInquiries) data.conciergeInquiries = [];
    const newInquiry = {
      id: `INQ-${Date.now()}`,
      createdAt: new Date().toISOString(),
      ...inquiry
    };
    data.conciergeInquiries.push(newInquiry);
    await writeDb(data);
    return newInquiry;
  },

  // STATS
  async getStats() {
    const data = await readDb();
    const orders = data.orders || [];
    const products = data.products || [];
    const totalRevenue = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    return {
      totalRevenue: Number(totalRevenue.toFixed(2)),
      totalOrders: orders.length,
      totalProducts: products.length,
      totalSubscribers: (data.subscribers || []).length,
      averageOrderValue: orders.length > 0 ? Number((totalRevenue / orders.length).toFixed(2)) : 0
    };
  }
};
