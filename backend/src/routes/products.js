import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// GET /api/products - List products with rich filtering, search, and sorting
router.get('/', async (req, res, next) => {
  try {
    const { category, search, sortBy, isBestseller, isNewArrival, minPrice, maxPrice } = req.query;
    let products = await db.getProducts();

    // Filter by category
    if (category && category.toLowerCase() !== 'all') {
      const catLower = category.toLowerCase();
      products = products.filter((p) => {
        if (catLower === 'leather') {
          return p.category?.toLowerCase() === 'leather' || p.subtitle?.toLowerCase().includes('leather') || p.category?.toLowerCase() === 'totes';
        }
        if (catLower === 'mini') {
          return p.category?.toLowerCase() === 'mini' || p.name?.toLowerCase().includes('mini');
        }
        return p.category?.toLowerCase() === catLower;
      });
    }

    // Filter by search keyword
    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      products = products.filter((p) =>
        p.name.toLowerCase().includes(q) ||
        (p.subtitle && p.subtitle.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q)) ||
        (p.category && p.category.toLowerCase().includes(q))
      );
    }

    // Filter by bestseller
    if (isBestseller === 'true') {
      products = products.filter((p) => p.isBestseller);
    }

    // Filter by new arrival
    if (isNewArrival === 'true') {
      products = products.filter((p) => p.isNewArrival);
    }

    // Filter by price range
    if (minPrice) {
      products = products.filter((p) => p.price >= Number(minPrice));
    }
    if (maxPrice) {
      products = products.filter((p) => p.price <= Number(maxPrice));
    }

    // Sorting
    if (sortBy === 'price-low') {
      products.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      products.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      products.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    } else if (sortBy === 'newest') {
      products.sort((a, b) => (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0));
    }

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/products/:id - Single product details & related products
router.get('/:id', async (req, res, next) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found.`
      });
    }

    // Get related products from the same or similar category
    const allProducts = await db.getProducts();
    const related = allProducts
      .filter((p) => p.id !== product.id && (p.category === product.category || p.isBestseller))
      .slice(0, 4);

    res.json({
      success: true,
      data: {
        ...product,
        related
      }
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products/:id/reviews - Submit a customer review
router.post('/:id/reviews', async (req, res, next) => {
  try {
    const { author, rating, comment } = req.body;
    if (!comment || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Rating and comment are required.'
      });
    }

    const result = await db.addProductReview(req.params.id, {
      author,
      rating: Math.min(5, Math.max(1, Number(rating))),
      comment
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found.`
      });
    }

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully. Thank you for your feedback.',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/products - Admin create product
router.post('/', async (req, res, next) => {
  try {
    const { name, category, price, image } = req.body;
    if (!name || !category || !price) {
      return res.status(400).json({
        success: false,
        message: 'Name, category, and price are required.'
      });
    }

    const created = await db.addProduct(req.body);
    res.status(201).json({
      success: true,
      data: created
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/products/:id - Admin update product
router.put('/:id', async (req, res, next) => {
  try {
    const updated = await db.updateProduct(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found.`
      });
    }

    res.json({
      success: true,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/products/:id - Admin delete product
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await db.deleteProduct(req.params.id);
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: `Product with ID '${req.params.id}' not found.`
      });
    }

    res.json({
      success: true,
      message: 'Product removed from collection.'
    });
  } catch (error) {
    next(error);
  }
});

export default router;
