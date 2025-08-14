import { api } from '../client';

/**
 * Order Service
 * Handles all order-related API calls
 */
const orderService = {
  // Create a new order
  createOrder: (orderData) => 
    api.order.post('/orders', {
      shippingAddressId: orderData.shippingAddressId,
      shippingValue: orderData.shippingValue,
      couponCode: orderData.couponCode,
      notes: orderData.notes
    }),

  // Get all orders with pagination and sorting
  getOrders: ({ page = 0, size = 10, sort } = {}) =>
    api.order.get('/orders', {
      page,
      size,
      ...(sort && sort.length > 0 ? { sort } : {})
    }),

  // Get a single order by ID
  getOrder: (orderId) => 
    api.order.get(`/orders/${orderId}`)
};

export default orderService;
