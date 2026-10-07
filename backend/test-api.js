// Automated test script for all Bagora backend endpoints
const BASE = 'http://localhost:5000/api';

async function testEndpoint(name, fn) {
  try {
    const res = await fn();
    console.log(`✅ [PASS] ${name}:`, res);
  } catch (err) {
    console.error(`❌ [FAIL] ${name}:`, err.message || err);
  }
}

async function run() {
  console.log('--- TESTING BACKEND ENDPOINTS ---');

  // 1. Health
  await testEndpoint('GET /api/health', async () => {
    const res = await fetch(`${BASE}/health`);
    return await res.json();
  });

  // 2. Products List
  await testEndpoint('GET /api/products', async () => {
    const res = await fetch(`${BASE}/products`);
    const data = await res.json();
    return { count: data.count, firstItem: data.data[0]?.name };
  });

  // 3. Product by ID
  await testEndpoint('GET /api/products/classic-leather-tote', async () => {
    const res = await fetch(`${BASE}/products/classic-leather-tote`);
    const data = await res.json();
    return { id: data.data.id, name: data.data.name, price: data.data.price };
  });

  // 4. Categories
  await testEndpoint('GET /api/categories', async () => {
    const res = await fetch(`${BASE}/categories`);
    const data = await res.json();
    return { count: data.data.length, names: data.data.map(c => c.name) };
  });

  // 5. Accessories
  await testEndpoint('GET /api/categories/accessories', async () => {
    const res = await fetch(`${BASE}/categories/accessories`);
    const data = await res.json();
    return { count: data.data.length, items: data.data.map(a => a.name) };
  });

  // 6. Validate Promo Code
  await testEndpoint('POST /api/promos/validate (LUXE10)', async () => {
    const res = await fetch(`${BASE}/promos/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'LUXE10', subtotal: 500 })
    });
    return await res.json();
  });

  // 7. Newsletter Subscribe
  await testEndpoint('POST /api/newsletter/subscribe', async () => {
    const res = await fetch(`${BASE}/newsletter/subscribe`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: `test.client.${Date.now()}@bagora.luxury` })
    });
    return await res.json();
  });

  // 8. Create Order
  await testEndpoint('POST /api/orders', async () => {
    const res = await fetch(`${BASE}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items: [{ id: 'classic-leather-tote', quantity: 1, price: 495, color: 'Noir' }],
        customer: {
          name: 'Lady Genevieve',
          email: 'genevieve@couture.com',
          address: '42 Avenue Montaigne',
          city: 'Paris',
          postalCode: '75008',
          country: 'France'
        },
        promoCode: 'LUXE10',
        paymentMethod: 'Amex Centurion'
      })
    });
    const data = await res.json();
    return { orderId: data.data.id, total: data.data.total, status: data.data.status };
  });

  // 9. Admin Stats
  await testEndpoint('GET /api/admin/stats', async () => {
    const res = await fetch(`${BASE}/admin/stats`);
    const data = await res.json();
    return data.data;
  });

  console.log('--- ALL BACKEND TESTS COMPLETED ---');
}

run();
