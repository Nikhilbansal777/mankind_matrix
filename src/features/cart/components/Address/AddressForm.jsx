import React, { useState, useEffect } from 'react';
import { X, Save, Edit, MapPin, Hash, Globe } from 'lucide-react';
import './AddressForm.css';

const AddressForm = ({ 
  address = null, 
  onSave, 
  onCancel, 
  isEditing = false 
}) => {
  const [formData, setFormData] = useState({
    streetAddress: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'USA',
    isDefault: false
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (address) {
      setFormData({
        streetAddress: address.streetAddress || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || 'USA',
        isDefault: address.isDefault || false
      });
    }
  }, [address]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.streetAddress.trim()) {
      newErrors.streetAddress = 'Street address is required';
    }
    
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }
    
    if (!formData.state.trim()) {
      newErrors.state = 'State is required';
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal code is required';
    }
    
    if (!formData.country) {
      newErrors.country = 'Country is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSave(formData);
    }
  };



  const countries = [
    { value: 'USA', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'UK', label: 'United Kingdom' },
    { value: 'AU', label: 'Australia' },
    { value: 'DE', label: 'Germany' },
    { value: 'FR', label: 'France' },
    { value: 'JP', label: 'Japan' },
    { value: 'BR', label: 'Brazil' }
  ];

  return (
    <div className="address-form-overlay">
      <div className="address-form-modal">
        <div className="form-header">
          <h2>{isEditing ? 'Edit Address' : 'Add New Address'}</h2>
          <button 
            type="button" 
            className="close-button"
            onClick={onCancel}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="address-form">
          {/* Street Address */}
          <div className="form-group">
            <label htmlFor="streetAddress">
              <MapPin size={16} />
              Street Address
            </label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              placeholder="Enter street address"
              className={errors.streetAddress ? 'error' : ''}
            />
            {errors.streetAddress && (
              <span className="error-message">{errors.streetAddress}</span>
            )}
          </div>

          {/* City and State Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="city">
                <MapPin size={16} />
                City
              </label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter city"
                className={errors.city ? 'error' : ''}
              />
              {errors.city && (
                <span className="error-message">{errors.city}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="state">
                <MapPin size={16} />
                State/Province
              </label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                placeholder="Enter state"
                className={errors.state ? 'error' : ''}
              />
              {errors.state && (
                <span className="error-message">{errors.state}</span>
              )}
            </div>
          </div>

          {/* Postal Code and Country Row */}
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">
                <Hash size={16} />
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                placeholder="Enter postal code"
                className={errors.postalCode ? 'error' : ''}
              />
              {errors.postalCode && (
                <span className="error-message">{errors.postalCode}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="country">
                <Globe size={16} />
                Country
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleChange}
                className={errors.country ? 'error' : ''}
              >
                <option value="">Select Country</option>
                {countries.map(country => (
                  <option key={country.value} value={country.value}>
                    {country.label}
                  </option>
                ))}
              </select>
              {errors.country && (
                <span className="error-message">{errors.country}</span>
              )}
            </div>
          </div>

          {/* Default Address Checkbox */}
          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isDefault"
                checked={formData.isDefault}
                onChange={handleChange}
              />
              <span className="checkmark"></span>
              Set as default address
            </label>
          </div>

          {/* Form Actions */}
          <div className="form-actions">
            <button
              type="button"
              className="cancel-button"
              onClick={onCancel}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="save-button"
            >
              {isEditing ? <><Edit size={16} /> Update</> : <><Save size={16} /> Save</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
