import express from 'express';
import { db } from '../db.js';

const router = express.Router();

// POST /api/newsletter/subscribe - Subscribe to VIP Inner Circle
router.post('/subscribe', async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'A valid email address is required.'
      });
    }

    const result = await db.addSubscriber(email);

    if (result.alreadySubscribed) {
      return res.json({
        success: true,
        message: 'Welcome back! You are already a member of the Bagora Inner Circle.',
        data: result
      });
    }

    res.status(201).json({
      success: true,
      message: 'Welcome to the Bagora Inner Circle. Your invitation has been dispatched.',
      data: result
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/newsletter/concierge - Concierge inquiry submission
router.post('/concierge', async (req, res, next) => {
  try {
    const { name, email, phone, message, preferredContact } = req.body;
    if (!email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Email and inquiry message are required.'
      });
    }

    const inquiry = await db.addConciergeInquiry({
      name: name || 'Private Client',
      email,
      phone: phone || null,
      message,
      preferredContact: preferredContact || 'email'
    });

    res.status(201).json({
      success: true,
      message: 'Your concierge inquiry has been registered. An atelier representative will reach out within 24 hours.',
      data: inquiry
    });
  } catch (error) {
    next(error);
  }
});

export default router;
