import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import productsRouter from './routes/products.js';
import categoriesRouter from './routes/categories.js';
import promosRouter from './routes/promos.js';
import ordersRouter from './routes/orders.js';
import newsletterRouter from './routes/newsletter.js';
import adminRouter from './routes/admin.js';
import { errorHandler, notFoundHandler } from './middleware/errorHandler.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS for Vite dev server & production origins
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000'],
  credentials: true
}));

// Request body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// HTTP Request logging
app.use(morgan('dev'));

// Serve static assets & Luxury API Explorer UI
app.use(express.static(path.join(__dirname, 'public')));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Bagora Luxury Goods Atelier API',
    uptime: `${Math.round(process.uptime())}s`,
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Mount API Routes
app.use('/api/products', productsRouter);
app.use('/api/categories', categoriesRouter);
app.use('/api/promos', promosRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/newsletter', newsletterRouter);
app.use('/api/admin', adminRouter);

// Fallback to API documentation for root path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Centralized error handling
app.use(notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`⚜️  BAGORA LUXURY E-COMMERCE API SERVER ONLINE`);
  console.log(`   Local URL:    http://localhost:${PORT}`);
  console.log(`   API Explorer: http://localhost:${PORT}`);
  console.log(`   Health Check: http://localhost:${PORT}/api/health`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
});

export default app;
