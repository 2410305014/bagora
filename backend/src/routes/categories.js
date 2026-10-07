import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/categories - List all product categories with count
router.get('/', async (req, res, next) => {
  try {
    const categories = await db.getCategories();
    const products = await db.getProducts();

    // Dynamically calculate counts based on active products
    const categoriesWithCount = categories.map((cat) => {
      const count = products.filter(
        (p) => p.category?.toLowerCase() === cat.id.toLowerCase() || p.category?.toLowerCase() === cat.name.toLowerCase()
      ).length;
      return {
        ...cat,
        count: count || cat.count || 0
      };
    });

    res.json({
      success: true,
      count: categoriesWithCount.length,
      data: categoriesWithCount
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/categories/accessories - List luxury accessories
router.get('/accessories', async (req, res, next) => {
  try {
    const accessories = await db.getAccessories();
    res.json({
      success: true,
      count: accessories.length,
      data: accessories
    });
  } catch (error) {
    next(error);
  }
});

export default router;
