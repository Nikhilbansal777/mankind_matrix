// Initial mock data based on existing products
let mockProducts = [
  {
    id: 1,
    name: "SpectraForce X Series",
    description: "High-performance graphics cards for gaming and creative professionals.",
    price: "799",
    stock: 50,
    category: "GPUs",
    imageUrl: "https://via.placeholder.com/300x200.png?text=SpectraForce+X+GPU"
  },
  {
    id: 2,
    name: "NovaCore Vision",
    description: "Professional GPUs for workstations, 3D rendering, and CAD applications.",
    price: "999",
    stock: 30,
    category: "GPUs",
    imageUrl: "https://via.placeholder.com/300x200.png?text=NovaCore+Vision"
  },
  {
    id: 3,
    name: "QuantumMind Systems",
    description: "AI supercomputing systems for deep learning and AI model training.",
    price: "2499",
    stock: 15,
    category: "AI Hardware",
    imageUrl: "https://via.placeholder.com/300x200.png?text=QuantumMind+Systems"
  },
  {
    id: 4,
    name: "EdgeNexus Platform",
    description: "AI-powered edge computing solutions for autonomous machines, robotics, and IoT devices.",
    price: "1299",
    stock: 25,
    category: "AI Hardware",
    imageUrl: "https://via.placeholder.com/300x200.png?text=EdgeNexus+Platform"
  },
  {
    id: 5,
    name: "HyperLink Connect",
    description: "High-speed Ethernet and InfiniBand network interconnects for enterprise and cloud environments.",
    price: "499",
    stock: 100,
    category: "Networking",
    imageUrl: "https://via.placeholder.com/300x200.png?text=HyperLink+Connect"
  }
];

// Get all products
export const getAllProducts = () => {
  return Promise.resolve(mockProducts);
};

// Get product by ID
export const getProductById = (id) => {
  const product = mockProducts.find(p => p.id === id);
  return Promise.resolve(product);
};

// Create new product
export const createProduct = (productData) => {
  const newProduct = {
    ...productData,
    id: Math.max(...mockProducts.map(p => p.id)) + 1
  };
  mockProducts.push(newProduct);
  return Promise.resolve(newProduct);
};

// Update product
export const updateProduct = (id, productData) => {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts[index] = { ...mockProducts[index], ...productData };
    return Promise.resolve(mockProducts[index]);
  }
  return Promise.reject(new Error('Product not found'));
};

// Delete product
export const deleteProduct = (id) => {
  const index = mockProducts.findIndex(p => p.id === id);
  if (index !== -1) {
    mockProducts = mockProducts.filter(p => p.id !== id);
    return Promise.resolve(true);
  }
  return Promise.reject(new Error('Product not found'));
}; 