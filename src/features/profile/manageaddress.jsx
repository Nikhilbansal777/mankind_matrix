import React, { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import './manageaddress.css'; // For the layout of the address page
import AccountNavigation from './AccountNavigation'; // Import the shared navigation
import withLayout from '../../layouts/HOC/withLayout';

const ManageAddressesPage = () => {
  const addressManagerRef = useRef({
    addresses: JSON.parse(localStorage.getItem('addresses')) || [],
    selectedAddress: null,
    editIndex: -1,
    onAddressChange: null,
    toggleFormVisibility: null,
    editAddressUI: null,
    init: function() {
      // No direct DOM manipulation in React components
    },
    initEventListeners: function() {
      // Event listeners are handled by React's synthetic events
    },
    toggleFormVisibility: function(show) {
      this.isVisible = show;
      if (this.onToggleVisibility) {
        this.onToggleVisibility(show);
      }
    },
    saveAddress: function(address) {
      if (this.editIndex >= 0) {
        this.addresses[this.editIndex] = address;
      } else {
        this.addresses.push(address);
      }
      if (address.isDefault) {
        this.addresses.forEach((addr, idx) => {
          if (this.editIndex !== idx) {
            addr.isDefault = false;
          }
        });
      }
      if (this.addresses.length === 1) {
        this.addresses[0].isDefault = true;
      }
      this.saveToLocalStorage();
      if (this.onAddressChange) {
        this.onAddressChange([...this.addresses]); // Update state with a new array
      }
      this.toggleFormVisibility(false);
      this.editIndex = -1;
    },
    validateAddress: function(address) {
      if (!address.name || !address.street || !address.city || !address.state || !address.zipcode || !address.country) {
        alert('Please fill in all required fields');
        return false;
      }
      if (address.country === 'United States' && !/^\d{5}(-\d{4})?$/.test(address.zipcode)) {
        alert('Please enter a valid ZIP code (12345 or 12345-6789)');
        return false;
      }
      return true;
    },
    editAddress: function(index) {
      this.editIndex = index;
      const addressToEdit = this.addresses[index];
      if (this.onEditAddress) {
        this.onEditAddress(addressToEdit);
      }
      this.toggleFormVisibility(true);
    },
    deleteAddress: function(index) {
      if (window.confirm('Are you sure you want to delete this address?')) {
        const wasDefault = this.addresses[index].isDefault;
        this.addresses.splice(index, 1);
        if (wasDefault && this.addresses.length > 0) {
          this.addresses[0].isDefault = true;
        }
        this.saveToLocalStorage();
        if (this.onAddressChange) {
          this.onAddressChange([...this.addresses]); // Update state with a new array
        }
      }
    },
    setDefaultAddress: function(index) {
      this.addresses.forEach((address, idx) => {
        address.isDefault = (idx === index);
      });
      this.saveToLocalStorage();
      if (this.onAddressChange) {
        this.onAddressChange([...this.addresses]); // Update state with a new array
      }
    },
    clearForm: function() {
      if (this.onClearForm) {
        this.onClearForm();
      }
      this.editIndex = -1;
    },
    saveToLocalStorage: function() {
      localStorage.setItem('addresses', JSON.stringify(this.addresses));
    },
    getAllAddresses: function() {
      return [...this.addresses]; // Return a copy
    },
    isVisible: false,
    onToggleVisibility: null,
    onEditAddress: null,
    onClearForm: null,
  });

  const [showForm, setShowForm] = useState(false);
  const [addresses, setAddresses] = useState([]);
  const [currentAddress, setCurrentAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    isDefault: false,
  });
  const [editIndexState, setEditIndexState] = useState(-1);

  useEffect(() => {
    const initialAddresses = addressManagerRef.current.getAllAddresses();
    setAddresses(initialAddresses);

    addressManagerRef.current.onAddressChange = setAddresses;
    addressManagerRef.current.onToggleVisibility = setShowForm;
    addressManagerRef.current.onEditAddress = (address) => {
      setCurrentAddress(address);
      setEditIndexState(addressManagerRef.current.editIndex);
    };
    addressManagerRef.current.onClearForm = () => {
      setCurrentAddress({
        name: '',
        street: '',
        city: '',
        state: '',
        zipcode: '',
        country: '',
        isDefault: false,
      });
      setEditIndexState(-1);
    };
  }, []);

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCurrentAddress(prevAddress => ({
      ...prevAddress,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddressClick = () => {
    addressManagerRef.current.clearForm();
    addressManagerRef.current.toggleFormVisibility(true);
  };

  const handleEditAddress = (index) => {
    addressManagerRef.current.editAddress(index);
  };

  const handleDeleteAddress = (index) => {
    addressManagerRef.current.deleteAddress(index);
  };

  const handleSetDefaultAddress = (index) => {
    addressManagerRef.current.setDefaultAddress(index);
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();
    addressManagerRef.current.saveAddress(currentAddress);
  };

  const handleCancelForm = () => {
    addressManagerRef.current.clearForm();
    addressManagerRef.current.toggleFormVisibility(false);
  };

  return (
    <div className="manage-addresses-container">
      <AccountNavigation />
      <div className="manage-addresses-content">
        <h2>Your Addresses</h2>
        <div id="address-list-container" className={showForm ? 'hidden' : ''}>
          <button id="add-address-btn" onClick={handleAddAddressClick}>Add New Address</button>
          <div id="address-list">
            {addresses.length === 0 ? (
              <div className="empty-state">No addresses saved. Add your first address.</div>
            ) : (
              addresses.map((address, index) => (
                <div key={index} className={`address-card ${address.isDefault ? 'default-address' : ''}`}>
                  <div className="address-content">
                    <h3>{address.name} {address.isDefault && <span className="default-badge">Default</span>}</h3>
                    <p>{address.street}</p>
                    <p>{address.city}, {address.state} {address.zipcode}</p>
                    <p>{address.country}</p>
                  </div>
                  <div className="address-actions">
                    <button className="edit-btn" onClick={() => handleEditAddress(index)}>Edit</button>
                    <button className="delete-btn" onClick={() => handleDeleteAddress(index)}>Delete</button>
                    {!address.isDefault && (
                      <button className="default-btn" onClick={() => handleSetDefaultAddress(index)}>Set as Default</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div id="address-form-container" className={showForm ? '' : 'hidden'}>
          <h3>{editIndexState >= 0 ? 'Edit Address' : 'Add New Address'}</h3>
          <form id="address-form" onSubmit={handleSaveAddress}>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" value={currentAddress.name} onChange={handleInputChange} required />
            <label htmlFor="street">Street:</label>
            <input type="text" id="street" name="street" value={currentAddress.street} onChange={handleInputChange} required />
            <label htmlFor="city">City:</label>
            <input type="text" id="city" name="city" value={currentAddress.city} onChange={handleInputChange} required />
            <label htmlFor="state">State:</label>
            <input type="text" id="state" name="state" value={currentAddress.state} onChange={handleInputChange} required />
            <label htmlFor="zipcode">Zip Code:</label>
            <input type="text" id="zipcode" name="zipcode" value={currentAddress.zipcode} onChange={handleInputChange} required />
            <label htmlFor="country">Country:</label>
            <input type="text" id="country" name="country" value={currentAddress.country} onChange={handleInputChange} required />
            <div className="default-checkbox-container">
              <label htmlFor="isDefault">Set as Default:</label>
              <input type="checkbox" id="isDefault" name="isDefault" checked={currentAddress.isDefault} onChange={handleInputChange} />
            </div>
            
          </form>
          <div className="form-actions">
              <button type="submit">Saved Address</button>
              <button type="button" id="cancel-btn" onClick={handleCancelForm}>Cancel</button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(ManageAddressesPage);