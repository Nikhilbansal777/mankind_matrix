import { api } from '../client';

const supplierService = {
  // Returns paginated list of active suppliers
  getAllSuppliers: (page = 0, size = 10) =>
    api.product.get('/suppliers', { page, size }),

  // Returns dashboard metrics for all active suppliers in one call
  getAdminSummary: () =>
    api.product.get('/suppliers/admin-summary'),

  // Returns dashboard metrics for a single supplier
  getSupplierDashboard: (id) =>
    api.product.get(`/suppliers/${id}/dashboard`),
};

export default supplierService;
