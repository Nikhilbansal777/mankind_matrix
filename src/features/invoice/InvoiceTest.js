import React from 'react';
import { InvoiceGenerator } from './index';

const InvoiceTest = () => {
  // Sample order data
  const sampleOrderData = {
    customerName: 'Jane Smith',
    customerAddress: '789 Customer Street',
    customerCity: 'Los Angeles',
    customerCountry: 'USA',
    customerEmail: 'jane.smith@example.com',
    items: [
      {
        id: 1,
        name: 'Premium Product A',
        quantity: 2,
        price: 199.99
      },
      {
        id: 2,
        name: 'Standard Product B',
        quantity: 1,
        price: 149.99
      },
      {
        id: 3,
        name: 'Basic Product C',
        quantity: 3,
        price: 49.99
      }
    ],
    paymentMethod: 'Credit Card (Visa ending in 4242)'
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <InvoiceGenerator orderData={sampleOrderData} />
    </div>
  );
};

export default InvoiceTest; 