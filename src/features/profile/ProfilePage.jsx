import React, { useEffect, useMemo, useState } from 'react';
import './ProfilePage.css';
import AccountNavigation from './AccountNavigation';
import withLayout from '../../layouts/HOC/withLayout';
import { useAddress } from '../../hooks/useAddress';
import { useUser } from '../../hooks/useUser';

const emptyAddress = {
  addressType: 'shipping',
  streetAddress: '',
  city: '',
  state: '',
  postalCode: '',
  country: '',
  isDefault: false
};

const editableUserFields = ['firstName', 'lastName', 'email', 'profilePictureUrl'];

const getInitials = (user) => {
  const first = user?.firstName?.[0] || user?.username?.[0] || '';
  const last = user?.lastName?.[0] || '';
  return `${first}${last}`.toUpperCase() || 'U';
};

const UserProfileDetails = () => {
  const { user, getCurrentUser, updateProfile, loading, error, clearError } = useUser();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    profilePictureUrl: ''
  });
  const [status, setStatus] = useState('');

  useEffect(() => {
    getCurrentUser().catch(() => {});
  }, [getCurrentUser]);

  useEffect(() => {
    if (!user) return;

    setFormData({
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      profilePictureUrl: user.profilePictureUrl || ''
    });
  }, [user]);

  const displayName = useMemo(() => {
    const fullName = `${user?.firstName || ''} ${user?.lastName || ''}`.trim();
    return fullName || user?.username || 'Your profile';
  }, [user]);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
    setStatus('');
    clearError();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatus('');

    const payload = editableUserFields.reduce((nextPayload, field) => {
      nextPayload[field] = formData[field]?.trim() || '';
      return nextPayload;
    }, {});

    try {
      await updateProfile(payload);
      setStatus('Profile updated successfully.');
    } catch {
      setStatus('');
    }
  };

  return (
    <section className="profile-panel" aria-labelledby="profile-heading">
      <div className="profile-panel-header">
        <div className="profile-avatar">
          {formData.profilePictureUrl ? (
            <img src={formData.profilePictureUrl} alt={displayName} />
          ) : (
            <span>{getInitials(user)}</span>
          )}
        </div>
        <div>
          <h2 id="profile-heading">Your Profile</h2>
          <p>{user?.username || user?.email || 'Manage your account details'}</p>
        </div>
      </div>

      <dl className="profile-summary">
        <div>
          <dt>Name</dt>
          <dd>{displayName}</dd>
        </div>
        <div>
          <dt>Email</dt>
          <dd>{user?.email || 'Not provided'}</dd>
        </div>
        <div>
          <dt>Role</dt>
          <dd>{user?.role || 'USER'}</dd>
        </div>
      </dl>

      <form className="profile-form" onSubmit={handleSubmit}>
        <label>
          First name
          <input name="firstName" type="text" value={formData.firstName} onChange={handleFieldChange} required />
        </label>
        <label>
          Last name
          <input name="lastName" type="text" value={formData.lastName} onChange={handleFieldChange} required />
        </label>
        <label>
          Email
          <input name="email" type="email" value={formData.email} onChange={handleFieldChange} required />
        </label>
        <label>
          Profile picture URL
          <input name="profilePictureUrl" type="url" value={formData.profilePictureUrl} onChange={handleFieldChange} />
        </label>

        {error && <p className="profile-message error-message">{error}</p>}
        {status && <p className="profile-message success-message">{status}</p>}

        <div className="profile-actions">
          <button type="submit" disabled={loading.updateProfile}>
            {loading.updateProfile ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      </form>
    </section>
  );
};

const AddressManager = () => {
  const {
    addresses,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    getAddresses,
    addAddress,
    editAddress,
    removeAddress,
    clearErrorState
  } = useAddress();
  const [showForm, setShowForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  const [addressForm, setAddressForm] = useState(emptyAddress);
  const [status, setStatus] = useState('');

  const isSaving = createLoading || updateLoading;

  const openNewAddressForm = () => {
    setAddressForm(emptyAddress);
    setEditingAddressId(null);
    setShowForm(true);
    setStatus('');
    clearErrorState();
  };

  const openEditAddressForm = (address) => {
    setAddressForm({
      addressType: address.addressType || 'shipping',
      streetAddress: address.streetAddress || '',
      city: address.city || '',
      state: address.state || '',
      postalCode: address.postalCode || '',
      country: address.country || '',
      isDefault: Boolean(address.isDefault)
    });
    setEditingAddressId(address.id);
    setShowForm(true);
    setStatus('');
    clearErrorState();
  };

  const handleAddressChange = (event) => {
    const { name, value, type, checked } = event.target;
    setAddressForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value
    }));
    setStatus('');
    clearErrorState();
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingAddressId(null);
    setAddressForm(emptyAddress);
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
    <section className="profile-panel" aria-labelledby="addresses-heading">
      <div className="profile-section-title">
        <div>
          <h2 id="addresses-heading">Your Addresses</h2>
          <p>{addresses.length} saved {addresses.length === 1 ? 'address' : 'addresses'}</p>
        </div>
        <button type="button" onClick={openNewAddressForm}>Add Address</button>
      </div>

      {loading && <p className="profile-message">Loading addresses...</p>}
      {error && <p className="profile-message error-message">{error}</p>}
      {status && <p className="profile-message success-message">{status}</p>}

      {showForm && (
        <form className="profile-form address-form" onSubmit={handleSaveAddress}>
          <label>
            Address type
            <select name="addressType" value={addressForm.addressType} onChange={handleAddressChange}>
              <option value="shipping">Shipping</option>
              <option value="billing">Billing</option>
            </select>
          </label>
          <label>
            Street address
            <input name="streetAddress" type="text" value={addressForm.streetAddress} onChange={handleAddressChange} required />
          </label>
          <label>
            City
            <input name="city" type="text" value={addressForm.city} onChange={handleAddressChange} required />
          </label>
          <label>
            State
            <input name="state" type="text" value={addressForm.state} onChange={handleAddressChange} required />
          </label>
          <label>
            Postal code
            <input name="postalCode" type="text" value={addressForm.postalCode} onChange={handleAddressChange} required />
          </label>
          <label>
            Country
            <input name="country" type="text" value={addressForm.country} onChange={handleAddressChange} required />
          </label>
          <label className="checkbox-row">
            <input name="isDefault" type="checkbox" checked={addressForm.isDefault} onChange={handleAddressChange} />
            Set as default {addressForm.addressType} address
          </label>

          <div className="profile-actions">
            <button type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save Address'}</button>
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
                <button type="button" onClick={() => openEditAddressForm(address)}>Edit</button>
                <button type="button" className="danger-button" disabled={deleteLoading} onClick={() => handleDeleteAddress(address.id)}>
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </div>
    </section>
  );
};

const ProfilePage = () => (
  <div className="manage-containers">
    <AccountNavigation />
    <main className="side-container profile-page-content">
      <UserProfileDetails />
      <AddressManager />
    </main>
  </div>
);

export default withLayout(ProfilePage);
