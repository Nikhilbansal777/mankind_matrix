import React, { useState, useEffect } from 'react';
import { Tag, CheckCircle, AlertCircle } from 'lucide-react';
import { useCoupons } from '../../../../hooks/useCoupons';
import './CouponInput.css';

/**
 * Reusable Coupon Input Component
 * Handles coupon validation, application, and removal
 */
const CouponInput = ({ 
  subtotal, 
  onCouponApplied, 
  onCouponRemoved,
  className = '',
  disabled = false 
}) => {
  const { 
    validateCoupon: validateCouponCode, 
    validatedCoupon, 
    loading: couponLoading, 
    error: couponError,
    clearValidatedCoupon,
    resetError
  } = useCoupons();
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);
  const [localError, setLocalError] = useState('');

  // Handle coupon code application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setLocalError('Please enter a coupon code');
      return;
    }

    try {
      await validateCouponCode(couponCode.trim());
    } catch (error) {
      console.error('Error validating coupon:', error);
      setLocalError('Invalid coupon code');
    }
  };

  // Handle coupon code removal
  const handleRemoveCoupon = () => {
    // Reset all local state
    setCouponCode('');
    setCouponApplied(false);
    setAppliedCoupon(null);
    setLocalError('');
    
    // Clear the validated coupon state and any errors
    clearValidatedCoupon();
    resetError();
    
    // Notify parent component that coupon was removed
    if (onCouponRemoved) {
      onCouponRemoved();
    }
  };

  // Handle coupon validation result from Redux
  useEffect(() => {
    if (validatedCoupon && validatedCoupon.id) {
      const coupon = validatedCoupon;
      
      // Check if coupon is active
      if (!coupon.isActive) {
        setLocalError('This coupon is no longer active');
        setCouponApplied(false);
        setAppliedCoupon(null);
        onCouponRemoved?.();
        return;
      }

      // Check if coupon has expired
      const now = new Date();
      const validFrom = new Date(coupon.validFrom);
      const validTo = new Date(coupon.validTo);
      
      if (now < validFrom || now > validTo) {
        setLocalError('This coupon is not valid at this time');
        setCouponApplied(false);
        setAppliedCoupon(null);
        onCouponRemoved?.();
        return;
      }

      // Check minimum order amount
      if (coupon.minimumOrderAmount && subtotal < coupon.minimumOrderAmount) {
        setLocalError(`Minimum order amount of $${coupon.minimumOrderAmount} required`);
        setCouponApplied(false);
        setAppliedCoupon(null);
        onCouponRemoved?.();
        return;
      }

      // Check usage limits
      if (coupon.maxUsage && coupon.currentUsage >= coupon.maxUsage) {
        setLocalError('This coupon has reached its usage limit');
        setCouponApplied(false);
        setAppliedCoupon(null);
        onCouponRemoved?.();
        return;
      }

      // Apply the coupon
      setCouponApplied(true);
      setAppliedCoupon(coupon);
      setLocalError('');
      
      // Notify parent component
      onCouponApplied?.(coupon);
    }
  }, [validatedCoupon, subtotal, onCouponApplied, onCouponRemoved]);

  // Handle when validated coupon is cleared externally
  useEffect(() => {
    if (!validatedCoupon || !validatedCoupon.id) {
      // Reset local state when validated coupon is cleared
      setCouponApplied(false);
      setAppliedCoupon(null);
      setLocalError('');
    }
  }, [validatedCoupon]);

  // Calculate discount amount based on coupon type
  const calculateDiscountAmount = () => {
    if (!appliedCoupon) return 0;
    
    if (appliedCoupon.type === 'PERCENTAGE') {
      return (subtotal * appliedCoupon.value) / 100;
    } else if (appliedCoupon.type === 'FIXED') {
      return Math.min(appliedCoupon.value, subtotal);
    }
    return 0;
  };

  const currentDiscountAmount = calculateDiscountAmount();

  return (
    <div className={`coupon-input-container ${className}`}>
      
      <div className="coupon-header">
        <Tag className="coupon-icon" />
        <span>Apply Coupon</span>
      </div>
      
      <div className="coupon-input-group">
        <input
          type="text"
          placeholder="Enter coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
          disabled={couponApplied || couponLoading || disabled}
          className="coupon-input"
        />
        {!couponApplied ? (
          <button
            type="button"
            onClick={handleApplyCoupon}
            disabled={couponLoading || disabled}
            className="apply-coupon-btn"
          >
            {couponLoading ? 'Validating...' : 'Apply'}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleRemoveCoupon}
            disabled={disabled}
            className="remove-coupon-btn"
          >
            Remove
          </button>
        )}
      </div>
      
      {(localError || couponError) && (
        <div className="coupon-error">
          <AlertCircle className="error-icon" />
          {localError || couponError}
        </div>
      )}
      
      {couponApplied && appliedCoupon && (
        <div className="coupon-success">
          <CheckCircle className="success-icon" />
          <div className="coupon-details">
            <span>Coupon applied: {appliedCoupon.code}</span>
            <span className="coupon-description">{appliedCoupon.description}</span>
            <span className="coupon-value">
              {appliedCoupon.type === 'PERCENTAGE' 
                ? `${appliedCoupon.value}% off` 
                : `$${appliedCoupon.value} off`}
            </span>
            <span className="coupon-discount">
              Discount: -${currentDiscountAmount.toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CouponInput;
