import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/promos/validate - Validate a discount promo code
router.post('/validate', async (req, res, next) => {
  try {
    const { code, subtotal } = req.body;
    if (!code || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: 'A promo code is required.'
      });
    }

    const promo = await db.getPromoByCode(code.trim());
    if (!promo) {
      return res.status(404).json({
        success: false,
        message: `Promo code "${code}" is invalid or expired. Try "LUXE10" for 10% off.`
      });
    }

    const currentSubtotal = Number(subtotal) || 0;
    if (promo.minSpend && currentSubtotal < promo.minSpend) {
      return res.status(400).json({
        success: false,
        message: `Promo code "${promo.code}" requires a minimum order value of $${promo.minSpend}.`
      });
    }

    const discountAmount = Math.round((currentSubtotal * promo.discountPercent) / 100);

    res.json({
      success: true,
      message: `Promo applied: ${promo.discountPercent}% off your order!`,
      data: {
        code: promo.code,
        discountPercent: promo.discountPercent,
        discountAmount,
        description: promo.description
      }
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/promos - List active promotions
router.get('/', async (req, res, next) => {
  try {
    const promos = await db.getPromos();
    res.json({
      success: true,
      count: promos.length,
      data: promos.filter((p) => p.active)
    });
  } catch (error) {
    next(error);
  }
});

export default router;
