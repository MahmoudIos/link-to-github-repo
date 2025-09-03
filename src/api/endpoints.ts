// Centralized API endpoints following REST conventions

export const endpoints = {
  // Vendor endpoints
  vendors: {
    list: '/api/v1/vendors',
    create: '/api/v1/vendors',
    getById: (id: string) => `/api/v1/vendors/${id}`,
    update: (id: string) => `/api/v1/vendors/${id}`,
    delete: (id: string) => `/api/v1/vendors/${id}`,
  },
  
  // Product endpoints (nested under vendors)
  products: {
    list: (vendorId: string) => `/api/v1/vendors/${vendorId}/products`,
    create: (vendorId: string) => `/api/v1/vendors/${vendorId}/products`,
    update: (vendorId: string) => `/api/v1/vendors/${vendorId}/products`,
    getById: (vendorId: string, id: string) => `/api/v1/vendors/${vendorId}/products/${id}`,
    delete: (vendorId: string, id: string) => `/api/v1/vendors/${vendorId}/products/${id}`,
    
    // Legacy endpoints for backwards compatibility (if needed)
    listAll: '/api/v1/products',
    getAllById: (id: string) => `/api/v1/products/${id}`,
  },

  // Assessment Analysis endpoints
  assessmentAnalysis: {
    analyze: (assessmentId: string) => `/api/v1/assessmentanalysis/${assessmentId}/analyze`,
    results: (assessmentId: string) => `/api/v1/assessmentanalysis/${assessmentId}/results`,
    notImplemented: (assessmentId: string) => `/api/v1/assessmentanalysis/${assessmentId}/not-implemented`,
    updateStatus: (assessmentId: string) => `/api/v1/assessmentanalysis/${assessmentId}/update-status`,
  }
} as const;