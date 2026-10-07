import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/orders - Place a new luxury purchase order
router.post('/', async (req, res, next) => {
  try {
    const { items, customer, promoCode, paymentMethod } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your shopping bag is empty. Please add items before placing an order.'
      });
    }

    // Verify and calculate item prices against database
    const allProducts = await db.getProducts();
    const allAccessories = await db.getAccessories();
    const catalog = [...allProducts, ...allAccessories];

    let calculatedSubtotal = 0;
    const verifiedItems = items.map((item) => {
      const found = catalog.find((p) => p.id === item.id);
      const unitPrice = found ? found.price : Number(item.price) || 0;
      const quantity = Math.max(1, Number(item.quantity) || 1);
      calculatedSubtotal += unitPrice * quantity;

      return {
        id: item.id,
        name: found ? found.name : item.name || 'Luxury Leather Good',
        price: unitPrice,
        color: item.color || 'Standard',
        quantity,
        image: found ? found.image : item.image || ''
      };
    });

    // Verify promo code if supplied
    let discount = 0;
    let validPromo = null;
    if (promoCode) {
      validPromo = await db.getPromoByCode(promoCode);
      if (validPromo) {
        discount = Math.round((calculatedSubtotal * validPromo.discountPercent) / 100);
      }
    }

    const shipping = 0; // Complimentary white-glove carbon neutral shipping
    const total = Math.max(0, calculatedSubtotal - discount + shipping);

    const order = await db.createOrder({
      items: verifiedItems,
      customer: customer || {
        name: "Valued Client",
        email: "client@bagora.luxury",
        address: "Private Residence"
      },
      subtotal: calculatedSubtotal,
      discount,
      promoCode: validPromo ? validPromo.code : null,
      shipping,
      total,
      paymentMethod: paymentMethod || "White-Glove Payment / Credit Card"
    });

    res.status(201).json({
      success: true,
      message: 'Your bespoke luxury order has been received and is now being crafted.',
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders/:id - Lookup order by tracking / order ID
router.get('/:id', async (req, res, next) => {
  try {
    const order = await db.getOrderById(req.params.id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found. Please check your order tracking reference.`
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/orders - List all orders (Admin or order history)
router.get('/', async (req, res, next) => {
  try {
    const orders = await db.getOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/orders/:id/status - Update order fulfillment status
router.patch('/:id/status', async (req, res, next) => {
  try {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status field is required.'
      });
    }

    const updated = await db.updateOrderStatus(req.params.id, status);
    if (!updated) {
      return res.status(404).json({
        success: false,
        message: `Order '${req.params.id}' not found.`
      });
    }

    res.json({
      success: true,
      message: `Order status updated to "${status}".`,
      data: updated
    });
  } catch (error) {
    next(error);
  }
});

export default router;
