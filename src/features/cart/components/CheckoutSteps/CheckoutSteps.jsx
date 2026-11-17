import React from 'react';
import { CHECKOUT_STEPS } from '../../utils/constants';
import './CheckoutSteps.css';

const CheckoutSteps = ({ currentStep }) => {
  const steps = [
    { id: CHECKOUT_STEPS.CART, label: 'Cart', number: 1 },
    { id: CHECKOUT_STEPS.DELIVERY, label: 'Delivery', number: 2 },
    { id: CHECKOUT_STEPS.PAYMENT, label: 'Payment', number: 3 },
    { id: CHECKOUT_STEPS.CONFIRMATION, label: 'Confirmation', number: 4 }
  ];

  const getStepStatus = (stepId) => {
    const stepIndex = steps.findIndex(step => step.id === stepId);
    const currentIndex = steps.findIndex(step => step.id === currentStep);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return '';
  };

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div className={`step ${getStepStatus(step.id)}`}>
            <div className="step-number">{step.number}</div>
            <div className="step-label">{step.label}</div>
          </div>
          {index < steps.length - 1 && <div className="step-divider"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default CheckoutSteps;
