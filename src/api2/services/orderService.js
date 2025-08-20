import { api } from '../client';

/**
 * Order Service
 * Handles all order-related API calls
 */
const orderService = {
  // Create a new order
  createOrder: (orderData) => 
    api.order.post('/', orderData),

  // Get all orders with pagination and sorting
  getOrders: ({ page = 0, size = 10, sort } = {}) =>
    api.order.get('/', {
      page,
      size,
      ...(sort && sort.length > 0 ? { sort } : {})
    }),

  // Get a single order by ID
  getOrder: (orderId) => 
    api.order.get(`/${orderId}`),

  // Pay for an order
  payOrder: (orderId, paymentData = {}) =>
    api.order.post(`/${orderId}/pay`, paymentData)
};

export default orderService;
