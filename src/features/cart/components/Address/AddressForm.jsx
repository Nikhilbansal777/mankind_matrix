import React, { useState, useEffect, useRef } from 'react';
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
  const [suggestions, setSuggestions] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState('');

  const searchTimeoutRef = useRef(null);
  const searchRequestRef = useRef(null);

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

  const countryCodeMap = {
    us: 'USA',
    ca: 'CA',
    gb: 'UK',
    au: 'AU',
    de: 'DE',
    fr: 'FR',
    jp: 'JP',
    br: 'BR'
  };

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

  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (searchRequestRef.current) {
        searchRequestRef.current.abort();
      }
    };
  }, []);

  const searchAddress = async (query) => {
    if (!query || query.trim().length < 3) {
      setSuggestions([]);
      setSearchError('');
      setIsSearching(false);
      return;
    }

    const apiKey = process.env.REACT_APP_GEOAPIFY_API_KEY;

    if (!apiKey) {
      console.error('Geoapify API key is not configured');
      setSearchError('Address search is currently unavailable.');
      setSuggestions([]);
      setIsSearching(false);
      return;
    }

    if (searchRequestRef.current) {
      searchRequestRef.current.abort();
    }

    const controller = new AbortController();
    searchRequestRef.current = controller;

    try {
      setIsSearching(true);
      setSearchError('');

      const response = await fetch(
        `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(
          query
        )}&format=json&limit=5&apiKey=${apiKey}`,
        {
          signal: controller.signal
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch address suggestions');
      }

      const data = await response.json();

      setSuggestions(data.results || []);
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Address autocomplete error:', error);
        setSuggestions([]);
        setSearchError('Unable to load address suggestions.');
      }
    } finally {
      if (searchRequestRef.current === controller) {
        setIsSearching(false);
        searchRequestRef.current = null;
      }
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }

    if (name === 'streetAddress') {
      setSearchError('');

      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }

      if (!value || value.trim().length < 3) {
        if (searchRequestRef.current) {
          searchRequestRef.current.abort();
          searchRequestRef.current = null;
        }

        setSuggestions([]);
        setIsSearching(false);
        return;
      }

      searchTimeoutRef.current = setTimeout(() => {
        searchAddress(value);
      }, 400);
    }
  };

  const handleSuggestionSelect = (suggestion) => {
    const countryCode = suggestion.country_code
      ? suggestion.country_code.toLowerCase()
      : '';

    const mappedCountry =
      countryCodeMap[countryCode] || formData.country;

    const streetAddress =
      suggestion.address_line1 ||
      [suggestion.housenumber, suggestion.street]
        .filter(Boolean)
        .join(' ') ||
      suggestion.formatted ||
      '';

    setFormData(prev => ({
      ...prev,
      streetAddress,
      city:
        suggestion.city ||
        suggestion.town ||
        suggestion.village ||
        suggestion.county ||
        '',
      state:
        suggestion.state ||
        suggestion.state_code ||
        '',
      postalCode: suggestion.postcode || '',
      country: mappedCountry
    }));

    setSuggestions([]);
    setSearchError('');

    setErrors(prev => ({
      ...prev,
      streetAddress: '',
      city: '',
      state: '',
      postalCode: '',
      country: ''
    }));
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
          <div className="form-group address-autocomplete">
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
              placeholder="Start typing your address"
              className={errors.streetAddress ? 'error' : ''}
              autoComplete="off"
            />

            {isSearching && (
              <span className="address-search-status">
                Searching addresses...
              </span>
            )}

            {!isSearching && suggestions.length > 0 && (
              <div className="address-suggestions">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={`${suggestion.place_id || suggestion.formatted}-${index}`}
                    type="button"
                    className="address-suggestion-item"
                    onClick={() => handleSuggestionSelect(suggestion)}
                  >
                    <MapPin size={16} />

                    <span>
                      {suggestion.formatted ||
                        suggestion.address_line1}
                    </span>
                  </button>
                ))}
              </div>
            )}

            {searchError && (
              <span className="error-message">
                {searchError}
              </span>
            )}

            {errors.streetAddress && (
              <span className="error-message">
                {errors.streetAddress}
              </span>
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
                <span className="error-message">
                  {errors.city}
                </span>
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
                <span className="error-message">
                  {errors.state}
                </span>
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
                <span className="error-message">
                  {errors.postalCode}
                </span>
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
                  <option
                    key={country.value}
                    value={country.value}
                  >
                    {country.label}
                  </option>
                ))}
              </select>

              {errors.country && (
                <span className="error-message">
                  {errors.country}
                </span>
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
              {isEditing ? (
                <>
                  <Edit size={16} /> Update
                </>
              ) : (
                <>
                  <Save size={16} /> Save
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default AddressForm;