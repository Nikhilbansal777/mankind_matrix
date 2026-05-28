// Mock user data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    role: 'customer',
    joinDate: '2024-01-15',
    lastLogin: '2024-03-20',
    purchaseHistory: [
      { id: 1, date: '2024-03-15', amount: 299.99, items: 3 },
      { id: 2, date: '2024-02-28', amount: 149.99, items: 2 }
    ]
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    role: 'customer',
    joinDate: '2024-02-01',
    lastLogin: '2024-03-19',
    purchaseHistory: [
      { id: 3, date: '2024-03-10', amount: 199.99, items: 1 }
    ]
  }
];

// Mock sales data
const salesData = {
  weekly: [
    { date: '2024-03-18', amount: 1250.99 },
    { date: '2024-03-19', amount: 980.50 },
    { date: '2024-03-20', amount: 1500.75 }
  ],
  monthly: [
    { month: 'Jan 2024', amount: 12500.99 },
    { month: 'Feb 2024', amount: 15800.50 },
    { month: 'Mar 2024', amount: 18900.75 }
  ],
  yearly: [
    { year: 2022, amount: 125000.99 },
    { year: 2023, amount: 158000.50 },
    { year: 2024, amount: 189000.75 }
  ]
};

export const getUserList = () => {
  return Promise.resolve(users);
};

export const getUserDetails = (userId) => {
  const user = users.find(u => u.id === userId);
  return Promise.resolve(user);
};

export const getSalesData = (period) => {
  return Promise.resolve(salesData[period]);
};

export const getPurchaseHistory = (userId) => {
  const user = users.find(u => u.id === userId);
  return Promise.resolve(user?.purchaseHistory || []);
}; 