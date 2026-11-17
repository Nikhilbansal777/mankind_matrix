import React, { useState } from 'react';
import './ProfilePage.css';
import AccountNavigation from './AccountNavigation';
import withLayout from '../../layouts/HOC/withLayout';
import { useAddress } from '../../hooks/useAddress';

const blankAddress = {
  addressType: 'shipping',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false
};

const ManageAddressesPage = () => {
  const {
    addresses,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    addAddress,
    editAddress,
    removeAddress,
    getAddresses,
    clearErrorState
  } = useAddress();
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(blankAddress);
  const [status, setStatus] = useState('');

  const openForm = (address = null) => {
    setEditingAddressId(address?.id || null);
    setAddressForm(address ? {
      addressType: address.addressType || 'shipping',
      streetAddress: address.streetAddress || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || '',
      isDefault: Boolean(address.isDefault)
    } : blankAddress);
    setShowForm(true);
    setStatus('');
    clearErrorState();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAddressId(null);
    setAddressForm(blankAddress);
  };

  const handleInputChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSaveAddress = async (event) => {
    event.preventDefault();
    const payload = {
      ...addressForm,
      streetAddress: addressForm.streetAddress.trim(),
      city: addressForm.city.trim(),
      state: addressForm.state.trim(),
      postalCode: addressForm.postalCode.trim(),
      country: addressForm.country.trim()
    };

    try {
      if (editingAddressId) {
        await editAddress(editingAddressId, payload);
        setStatus('Address updated successfully.');
      } else {
        await addAddress(payload);
        setStatus('Address added successfully.');
      }
      closeForm();
      getAddresses();
    } catch {
      setStatus('');
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (!window.confirm('Delete this address?')) return;

    try {
      await removeAddress(addressId);
      setStatus('Address deleted successfully.');
    } catch {
      setStatus('');
    }
  };

  return (
    <div className="manage-containers">
      <AccountNavigation />
      <main className="side-container">
        <section className="profile-panel">
          <div className="profile-section-title">
            <div>
              <h2>Your Addresses</h2>
              <p>{addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}</p>
            </div>
            <button type="button" onClick={() => openForm()}>Add Address</button>
          </div>

          {loading && <p className="profile-message">Loading addresses...</p>}
          {error && <p className="profile-message error-message">{error}</p>}
          {status && <p className="profile-message success-message">{status}</p>}

          {showForm && (
            <form className="profile-form address-form" onSubmit={handleSaveAddress}>
              <label>
                Address type
                <select name="addressType" value={addressForm.addressType} onChange={handleInputChange}>
                  <option value="shipping">Shipping</option>
                  <option value="billing">Billing</option>
                </select>
              </label>
              <label>
                Street address
                <input name="streetAddress" type="text" value={addressForm.streetAddress} onChange={handleInputChange} required />
              </label>
              <label>
                City
                <input name="city" type="text" value={addressForm.city} onChange={handleInputChange} required />
              </label>
              <label>
                State
                <input name="state" type="text" value={addressForm.state} onChange={handleInputChange} required />
              </label>
              <label>
                Postal code
                <input name="postalCode" type="text" value={addressForm.postalCode} onChange={handleInputChange} required />
              </label>
              <label>
                Country
                <input name="country" type="text" value={addressForm.country} onChange={handleInputChange} required />
              </label>
              <label className="checkbox-row">
                <input name="isDefault" type="checkbox" checked={addressForm.isDefault} onChange={handleInputChange} />
                Set as default {addressForm.addressType} address
              </label>
              <div className="profile-actions">
                <button type="submit" disabled={createLoading || updateLoading}>
                  {createLoading || updateLoading ? 'Saving...' : 'Save Address'}
                </button>
                <button type="button" className="secondary-button" onClick={closeForm}>Cancel</button>
              </div>
            </form>
          )}

          <div className="profile-address-list">
            {addresses.length === 0 && !loading ? (
              <div className="empty-state">No addresses saved. Add your first address.</div>
            ) : (
              addresses.map((address) => (
                <article key={address.id} className="profile-address-card">
                  <div>
                    <div className="address-card-header">
                      <h3>{address.addressType || 'Address'}</h3>
                      {address.isDefault && <span>Default</span>}
                    </div>
                    <p>{address.streetAddress}</p>
                    <p>{address.city}, {address.state} {address.postalCode}</p>
                    <p>{address.country}</p>
                  </div>
                  <div className="address-card-actions">
                    <button type="button" onClick={() => openForm(address)}>Edit</button>
                    <button type="button" className="danger-button" disabled={deleteLoading} onClick={() => handleDeleteAddress(address.id)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default withLayout(ManageAddressesPage);
