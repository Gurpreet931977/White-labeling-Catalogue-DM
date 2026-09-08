import { db } from './database.js';

function parseRequestBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        resolve({});
      }
    });
  });
}

function sendJson(res, statusCode, data) {
  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export function thcApiPlugin() {
  return {
    name: 'thc-api-backend-plugin',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || '';

        // Only intercept /api routes
        if (!url.startsWith('/api')) {
          return next();
        }

        try {
          const method = req.method;
          const cleanUrl = url.split('?')[0];

          // 1. Health Check
          if (cleanUrl === '/api/health' && method === 'GET') {
            return sendJson(res, 200, {
              status: 'online',
              system: 'Velour Backend Database Engine',
              version: '2.0.0',
              timestamp: new Date().toISOString()
            });
          }

          // 2. Customer Auth Login / Signup
          if (cleanUrl === '/api/auth/customer-login' && method === 'POST') {
            const body = await parseRequestBody(req);
            const user = db.createOrUpdateCustomer(body);
            return sendJson(res, 200, {
              success: true,
              user,
              token: `thc_cust_${Date.now()}`
            });
          }

          // 3. Admin Auth Login
          if (cleanUrl === '/api/auth/admin-login' && method === 'POST') {
            const body = await parseRequestBody(req);
            const isValid = db.verifyAdmin(body.pin || body.password);
            if (isValid) {
              return sendJson(res, 200, {
                success: true,
                role: 'admin',
                token: `thc_admin_${Date.now()}`
              });
            } else {
              return sendJson(res, 401, {
                success: false,
                message: 'Invalid Admin PIN or Password. Default PIN is 7788.'
              });
            }
          }

          // 4. Get Orders
          if (cleanUrl === '/api/orders' && method === 'GET') {
            const orders = db.getOrders();
            return sendJson(res, 200, { success: true, orders });
          }

          // 5. Create Order
          if (cleanUrl === '/api/orders' && method === 'POST') {
            const body = await parseRequestBody(req);
            const newOrder = db.createOrder(body);
            return sendJson(res, 201, { success: true, order: newOrder });
          }

          // 6. Update Order Status (/api/orders/:id/status)
          const orderStatusMatch = cleanUrl.match(/^\/api\/orders\/([^/]+)\/status$/);
          if (orderStatusMatch && (method === 'PATCH' || method === 'POST')) {
            const orderId = orderStatusMatch[1];
            const body = await parseRequestBody(req);
            const updated = db.updateOrderStatus(orderId, body.status);
            if (updated) {
              return sendJson(res, 200, { success: true, order: updated });
            } else {
              return sendJson(res, 404, { success: false, message: 'Order not found' });
            }
          }

          // 7. Get Menu Stock Overrides
          if (cleanUrl === '/api/menu/stock' && method === 'GET') {
            const stock = db.getMenuStock();
            return sendJson(res, 200, { success: true, stock });
          }

          // 8. Toggle Item Stock (/api/menu/:id/stock)
          const menuStockMatch = cleanUrl.match(/^\/api\/menu\/([^/]+)\/stock$/);
          if (menuStockMatch && (method === 'PATCH' || method === 'POST')) {
            const itemId = menuStockMatch[1];
            const updatedStock = db.toggleItemStock(itemId);
            return sendJson(res, 200, { success: true, stock: updatedStock });
          }

          // 9. Get Stats & Analytics
          if (cleanUrl === '/api/stats' && method === 'GET') {
            const stats = db.getStats();
            return sendJson(res, 200, { success: true, stats });
          }

          // Route not matched
          return sendJson(res, 404, { error: 'API Route Not Found' });
        } catch (err) {
          console.error('API Middleware Error:', err);
          return sendJson(res, 500, { error: 'Internal Server Error', details: err.message });
        }
      });
    }
  };
}
