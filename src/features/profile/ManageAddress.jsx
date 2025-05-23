import React, { useState, useEffect } from 'react';
import './ManageAddress.css'; // For the layout of the address page
import AccountNavigation from './AccountNavigation'; // Import the shared navigation
import withLayout from '../../layouts/HOC/withLayout';

const ManageAddressesPage = () => {
  const [addresses, setAddresses] = useState(() => {
    const storedAddresses = localStorage.getItem('addresses');
    return storedAddresses ? JSON.parse(storedAddresses) : [];
  });
  const [showForm, setShowForm] = useState(false);
  const [currentAddress, setCurrentAddress] = useState({
    name: '',
    street: '',
    city: '',
    state: '',
    zipcode: '',
    country: '',
    isDefault: false,
  });
  const [editIndex, setEditIndex] = useState(-1);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  const validateAddress = (address) => {
    if (!address.name || !address.street || !address.city || !address.state || !address.zipcode || !address.country) {
      alert('Please fill in all required fields');
      return false;
    }
    if (address.country === 'United States' && !/^\d{5}(-\d{4})?$/.test(address.zipcode)) {
      alert('Please enter a valid ZIP code (12345 or 12345-6789)');
      return false;
    }
    return true;
  };

  const saveAddress = (address) => {
    if (!validateAddress(address)) {
      return;
    }

    const updatedAddresses = [...addresses];
    if (editIndex >= 0) {
      updatedAddresses[editIndex] = address;
    } else {
      updatedAddresses.push(address);
    }

    if (address.isDefault) {
      updatedAddresses.forEach((addr, idx) => {
        if (editIndex !== idx) {
          addr.isDefault = false;
        }
      });
    }

    if (updatedAddresses.length === 1) {
      updatedAddresses[0].isDefault = true;
    }

    setAddresses(updatedAddresses);
    setShowForm(false);
    setEditIndex(-1);
    setCurrentAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      isDefault: false,
    });
  };

  const editAddressHandler = (index) => {
    setEditIndex(index);
    setCurrentAddress(addresses[index]);
    setShowForm(true);
  };

  const deleteAddressHandler = (index) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const wasDefault = addresses[index].isDefault;
      const updatedAddresses = addresses.filter((_, i) => i !== index);
      if (wasDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      setAddresses(updatedAddresses);
    }
  };

  const setDefaultAddressHandler = (index) => {
    const updatedAddresses = addresses.map((address, idx) => ({
      ...address,
      isDefault: idx === index,
    }));
    setAddresses(updatedAddresses);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setCurrentAddress(prevAddress => ({
      ...prevAddress,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleAddAddressClick = () => {
    setCurrentAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      isDefault: false,
    });
    setEditIndex(-1);
    setShowForm(true);
  };

  const handleSaveAddress = (event) => {
    event.preventDefault();
    saveAddress(currentAddress);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditIndex(-1);
    setCurrentAddress({
      name: '',
      street: '',
      city: '',
      state: '',
      zipcode: '',
      country: '',
      isDefault: false,
    });
  };

  return (
    <div className="manage-addresses-container">
      <AccountNavigation />
      <div className="manage-addresses-content">
        <h2 className="address-content-header">Your Addresses</h2>
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
                    <button className="edit-btn" onClick={() => editAddressHandler(index)}>Edit</button>
                    <button className="delete-btn" onClick={() => deleteAddressHandler(index)}>Delete</button>
                    {!address.isDefault && (
                      <button className="default-btn" onClick={() => setDefaultAddressHandler(index)}>Set as Default</button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div id="address-form-container" className={showForm ? '' : 'hidden'}>
          <h3>{editIndex >= 0 ? 'Edit Address' : 'Add New Address'}</h3>
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
            <button type="submit">Save Address</button>
            <button type="button" id="cancel-btn" onClick={handleCancelForm}>Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withLayout(ManageAddressesPage);