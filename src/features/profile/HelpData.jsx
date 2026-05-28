// helpData.js
// Sample data for the Help component

export const faqCategories = [
  { id: 'general', name: 'General Questions' },
  { id: 'account', name: 'Account & Profile' },
  { id: 'payments', name: 'Payments & Billing' },
  { id: 'orders', name: 'Orders & Shipping' },
  { id: 'returns', name: 'Returns & Refunds' },
  { id: 'technical', name: 'Technical Support' }
];

export const faqData = {
  general: [
    {
      id: 'general-1',
      question: 'What is Mankind America?',
      answer: 'This is an online marketplace connecting consumers to Chipsets.'
    },
    {
      id: 'general-2',
      question: 'How do I contact customer support?',
      answer: 'You can reach our customer support team via email at support@mankindamerica.org, by phone at (123) 456-7890, or through the contact form on our website. Our support hours are Monday to Friday, 9 AM to 6 PM EST.'
    },
    {
      id: 'general-3',
      question: 'What are your business hours?',
      answer: 'Our online store is available 24/7. Our physical locations are open Monday to Saturday, 10 AM to 8 PM, and Sunday, 12 PM to 6 PM local time. Customer support is available Monday to Friday, 9 AM to 6 PM EST.'
    },
    {
      id: 'general-4',
      question: 'Do you have a loyalty program?',
      answer: 'No, we do not have a loyalty program at this time. However, we do offer seasonal promotions and discounts to our customers. Sign up for our newsletter to stay updated on the latest offers and exclusive deals.'
    }
  ],
  account: [
    {
      id: 'account-1',
      question: 'How do I create an account?',
      answer: 'To create an account, click the "Sign Up" button in the top right corner of our website. Enter your email address, create a password, and fill in your personal information. Once submitted, you\'ll receive a verification email to confirm your account.'
    },
    {
      id: 'account-2',
      question: 'How do I reset my password?',
      answer: 'If you forgot your password, click on the "Forgot Password" link on the login page. Enter the email address associated with your account, and we\'ll send you instructions to reset your password. For security reasons, password reset links expire after 24 hours.'
    },
    {
      id: 'account-3',
      question: 'How do I update my personal information?',
      answer: 'To update your personal information, log into your account and navigate to the "Profile" section. Here you can edit your name, contact information, address, and other details. Remember to click "Save Changes" when you\'re done.'
    },
    {
      id: 'account-4',
      question: 'Can I have multiple shipping addresses?',
      answer: 'Yes, you can save multiple shipping addresses in your account. Go to "Addresses" in your account settings to add, edit, or remove shipping addresses. You can select which address to use during checkout.'
    }
  ],
  payments: [
    {
      id: 'payments-1',
      question: 'What payment methods do you accept?',
      answer: 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, and Google Pay. For certain markets, we also offer buy-now-pay-later options like Klarna and Afterpay.'
    },
    {
      id: 'payments-2',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard SSL encryption to protect your payment information. We are PCI DSS compliant and never store your full credit card details on our servers. Our payment processing is handled by trusted third-party providers with robust security measures.'
    },
    {
      id: 'payments-3',
      question: 'When will I be charged for my order?',
      answer: 'Your payment method will be charged immediately upon completing your purchase. For pre-orders or limited designer collections, you\'ll be charged at the time of order placement, not when the item ships.'
    },
    {
      id: 'payments-4',
      question: 'Do you offer installment payment plans?',
      answer: 'Yes, we partner with several financing providers to offer installment payment options at checkout. Eligibility and terms depend on your location and credit history. Available options will be displayed during the checkout process.'
    }
  ],
  orders: [
    {
      id: 'orders-1',
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and navigating to "Order History." Click on the specific order to view its current status and tracking information. You\'ll also receive email updates with tracking details once your order ships.'
    },
    {
      id: 'orders-2',
      question: 'How long will shipping take?',
      answer: 'Standard shipping typically takes 3-5 business days within the continental US. Express shipping options (1-2 business days) are available at checkout for an additional fee. International shipping times vary by destination, generally 7-14 business days. Designer-direct items may have different shipping timelines clearly marked on the product page.'
    },
    {
      id: 'orders-3',
      question: 'Can I change or cancel my order?',
      answer: 'Orders can be modified or canceled within 1 hour of placement. After that window, our system begins processing your order for fulfillment. If you need to make changes after this period, please contact customer support immediately, though we cannot guarantee changes can be accommodated once processing has begun.'
    },
    {
      id: 'orders-4',
      question: 'Do you ship internationally?',
      answer: 'Yes, we ship to over 40 countries worldwide. International shipping rates and delivery times vary by destination. Please note that customers are responsible for any import duties, taxes, or customs fees that may apply when receiving international shipments. We provide estimated duties at checkout for transparency.'
    }
  ],
  returns: [
    {
      id: 'returns-1',
      question: 'What is your return policy?',
      answer: 'We offer a 30-day return policy for most items in new, unused condition with original packaging and tags. Designer-exclusive and limited edition pieces have specific return restrictions, which are noted on their product pages. Returns initiated after 30 days may be eligible for store credit at our discretion.'
    },
    {
      id: 'returns-2',
      question: 'How do I initiate a return?',
      answer: 'To start a return, log into your account, go to "Order History," select the order containing the item(s) you wish to return, and click "Return Items." Follow the instructions to generate a return shipping label and receive return authorization. Please do not send returns without completing this process first.'
    },
    {
      id: 'returns-3',
      question: 'When will I receive my refund?',
      answer: 'Once your return is received and inspected (usually within 3-5 business days), we\'ll process your refund. The funds will appear back in your original payment method within 7-10 business days, depending on your financial institution\'s processing times.'
    },
    {
      id: 'returns-4',
      question: 'Do I have to pay for return shipping?',
      answer: 'For defective items or shipping errors, return shipping is free. For preference-based returns (size, color, etc.), return shipping costs are the customer\'s responsibility unless otherwise noted in a promotion or loyalty program benefit. StyleHub Premium members receive free returns on all orders.'
    }
  ],
  technical: [
    {
      id: 'technical-1',
      question: 'Why isn\'t the website loading properly?',
      answer: 'If you\'re experiencing loading issues, try clearing your browser cache and cookies, ensure your browser is updated to the latest version, or try a different browser. If problems persist, check your internet connection or contact our technical support team for assistance.'
    },
    {
      id: 'technical-2',
      question: 'The item I want shows as out of stock. When will it be available?',
      answer: 'For out-of-stock items, you can click "Notify Me" on the product page to receive an email when the item is restocked. While we can\'t guarantee specific restock dates, most popular items are replenished within 2-4 weeks. Limited edition designer pieces may not be restocked once sold out.'
    },
    {
      id: 'technical-3',
      question: 'I can\'t log into my account. What should I do?',
      answer: 'If you\'re having trouble logging in, first try resetting your password. If that doesn\'t work, ensure you\'re using the correct email address, check for any typos, and make sure your caps lock is off. If problems persist, contact our support team who can investigate account access issues.'
    },
    {
      id: 'technical-4',
      question: 'Is your website compatible with mobile devices?',
      answer: 'Yes, our website is fully responsive and optimized for all devices, including smartphones and tablets. We support all major browsers (Chrome, Safari, Firefox, Edge) on both iOS and Android operating systems. Our StyleHub mobile app offers additional features and is available for download on iOS and Android app stores.'
    }
  ]
};

export const helpResources = [
  {
    title: "Style Guides",
    description: "Detailed guides on fashion trends, sustainability, and getting the most from StyleHub",
    link: "#guides",
    linkText: "View Guides"
  },
  {
    title: "Video Tutorials",
    description: "Watch step-by-step tutorials about navigating our platform and styling tips",
    link: "#tutorials",
    linkText: "Watch Now"
  },
  {
    title: "Community Forum",
    description: "Connect with other fashion enthusiasts to share styling tips and designer recommendations",
    link: "#forum",
    linkText: "Join Discussion"
  }
];

export const contactMethods = {
  email: "support@stylehub.com",
  phone: "(123) 456-7890",
  hours: "Monday to Friday, 9 AM to 6 PM EST",
  buttonText: "Contact Support"
};