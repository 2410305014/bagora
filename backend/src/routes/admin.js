import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/admin/stats - Luxury atelier dashboard metrics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await db.getStats();
    const orders = await db.getOrders();
    const products = await db.getProducts();

    // Top selling bags based on orders
    const itemCounts = {};
    for (const order of orders) {
      for (const item of order.items || []) {
        itemCounts[item.id] = (itemCounts[item.id] || 0) + (item.quantity || 1);
      }
    }

    const topSelling = Object.entries(itemCounts)
      .map(([id, quantitySold]) => {
        const prod = products.find((p) => p.id === id);
        return {
          id,
          name: prod ? prod.name : id,
          price: prod ? prod.price : 0,
          image: prod ? prod.image : '',
          quantitySold
        };
      })
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, 5);

    // Recent 5 orders
    const recentOrders = orders.slice(0, 5);

    res.json({
      success: true,
      data: {
        ...stats,
        topSelling,
        recentOrders
      }
    });
  } catch (error) {
    next(error);
  }
});

export default router;
