import { api } from '../client';

/**
 * Coupon Service
 * Handles all coupon-related API calls
 */
const couponService = {
  // Create a new coupon
  createCoupon: (couponData) => 
    api.coupon.post('/', {
      code: couponData.code,
      name: couponData.name,
      description: couponData.description,
      type: couponData.type,
      value: couponData.value,
      minimumOrderAmount: couponData.minimumOrderAmount,
      maxUsage: couponData.maxUsage,
      validFrom: couponData.validFrom,
      validTo: couponData.validTo,
      oneTimeUsePerUser: couponData.oneTimeUsePerUser
    }),

  // Update an existing coupon
  updateCoupon: (id, couponData) => 
    api.coupon.put(`/${id}`, {
      code: couponData.code,
      name: couponData.name,
      description: couponData.description,
      type: couponData.type,
      value: couponData.value,
      minimumOrderAmount: couponData.minimumOrderAmount,
      maxUsage: couponData.maxUsage,
      validFrom: couponData.validFrom,
      validTo: couponData.validTo,
      oneTimeUsePerUser: couponData.oneTimeUsePerUser
    }),

  // Deactivate a coupon
  deactivateCoupon: (id) => 
    api.coupon.delete(`/${id}`),

  // Get all active coupons with pagination
  getCoupons: ({ page = 0, size = 10, sort } = {}) =>
    api.coupon.get('/', {
      page,
      size,
      ...(sort && sort.length > 0 ? { sort } : {})
    }),

  // Get a single coupon by ID
  getCoupon: (id) => 
    api.coupon.get(`/${id}`),

  // Validate coupon code
  validateCoupon: (code) => 
    api.coupon.get('/validate', {
      code
    }),


};

export default couponService;
