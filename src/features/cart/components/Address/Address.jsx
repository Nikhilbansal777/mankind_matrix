import React, { useState, useEffect } from 'react';
import { Plus, MapPin, Home, Building, MoreHorizontal, Edit, Trash2, Star, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { useAddress } from '../../../../hooks/useAddress';
import AddressForm from './AddressForm';
import './Address.css';

const Address = ({ onAddressSelect, selectedAddressId }) => {
  const {
    addresses,
    firstThreeAddresses,
    loading,
    error,
    createLoading,
    addAddress,
    editAddress,
    removeAddress,
    clearErrorState,
    getAddresses
  } = useAddress();

  const [showAllAddresses, setShowAllAddresses] = useState(false);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [showAddressActions, setShowAddressActions] = useState(null);

  // Auto-fetch addresses on mount
  useEffect(() => {
    console.log('Address component mounted, fetching addresses...');
    getAddresses();
  }, [getAddresses]);

  // Auto-select address when addresses are loaded
  useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      // First, try to find a default address
      const defaultAddresses = addresses.filter(addr => addr.isDefault);
      
      if (defaultAddresses.length > 0) {
        // If multiple defaults, select the first one
        const selectedDefault = defaultAddresses[0];
        console.log('Auto-selecting default address:', selectedDefault);
        
        if (defaultAddresses.length > 1) {
          console.warn(`Multiple default addresses found (${defaultAddresses.length}). Selected the first one.`);
        }
        
        onAddressSelect && onAddressSelect(selectedDefault);
      } else {
        // If no default address, select the first one
        console.log('Auto-selecting first address (no default):', addresses[0]);
        onAddressSelect && onAddressSelect(addresses[0]);
      }
    }
  }, [addresses, selectedAddressId, onAddressSelect]);

  // Update local selection state when selectedAddressId changes
  useEffect(() => {
    if (selectedAddressId && addresses.length > 0) {
      const selectedAddr = addresses.find(addr => addr.id === selectedAddressId);
      if (selectedAddr) {
        console.log('Address selection updated:', selectedAddr);
      }
    }
  }, [selectedAddressId, addresses]);

  const handleCreateAddress = async (addressData) => {
    try {
      await addAddress(addressData);
      setShowAddressForm(false);
      clearErrorState();
    } catch (error) {
      console.error('Failed to create address:', error);
    }
  };

  const handleEditAddress = async (addressData) => {
    try {
      await editAddress(editingAddress.id, addressData);
      setShowAddressForm(false);
      setEditingAddress(null);
      clearErrorState();
    } catch (error) {
      console.error('Failed to update address:', error);
    }
  };

  const handleDeleteAddress = async (addressId) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      try {
        await removeAddress(addressId);
        setShowAddressActions(null);
      } catch (error) {
        console.error('Failed to delete address:', error);
      }
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      // First, update all addresses to remove default flag
      const updatePromises = addresses.map(addr => 
        editAddress(addr.id, { ...addr, isDefault: false })
      );
      await Promise.all(updatePromises);
      
      // Then, set the selected address as default
      const addressToUpdate = addresses.find(addr => addr.id === addressId);
      if (addressToUpdate) {
        await editAddress(addressId, { ...addressToUpdate, isDefault: true });
      }
      
      setShowAddressActions(null);
    } catch (error) {
      console.error('Failed to set default address:', error);
    }
  };

  const openEditForm = (address) => {
    setEditingAddress(address);
    setShowAddressForm(true);
    setShowAddressActions(null);
  };

  const openCreateForm = () => {
    setEditingAddress(null);
    setShowAddressForm(true);
  };

  const closeForm = () => {
    setShowAddressForm(false);
    setEditingAddress(null);
    clearErrorState();
  };

  const getAddressTypeIcon = (type) => {
    switch (type?.toLowerCase()) {
      case 'shipping':
        return <Home size={16} />;
      case 'billing':
        return <Building size={16} />;
      case 'home':
        return <Home size={16} />;
      case 'work':
        return <Building size={16} />;
      default:
        return <MapPin size={16} />;
    }
  };

  const getAddressTypeLabel = (type) => {
    switch (type?.toLowerCase()) {
      case 'shipping':
        return 'Shipping';
      case 'billing':
        return 'Billing';
      case 'home':
        return 'Home';
      case 'work':
        return 'Work';
      default:
        return type || 'Other';
    }
  };

  const formatAddress = (address) => {
    return `${address.streetAddress}, ${address.city}, ${address.state} ${address.postalCode}, ${address.country}`;
  };

  const displayedAddresses = showAllAddresses ? addresses : firstThreeAddresses;
  const hasMoreAddresses = addresses.length > 3;

  if (loading) {
    return (
      <div className="address-section">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Loading addresses...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="address-section">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={clearErrorState} className="retry-button">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="address-section">
      <div className="section-header">
        <MapPin className="section-icon" />
        <h2>Delivery Address</h2>
        <button 
          className="add-address-button"
          onClick={openCreateForm}
          disabled={createLoading}
        >
          <Plus size={16} />
          Add Address
        </button>
      </div>
      


      {!addresses || addresses.length === 0 ? (
        <div className="no-addresses">
          <MapPin size={48} className="no-addresses-icon" />
          <p>No addresses found</p>
          <p className="no-addresses-subtitle">Add your first address to get started</p>
          <button 
            className="primary-button"
            onClick={openCreateForm}
          >
            <Plus size={16} />
            Add Your First Address
          </button>
        </div>
      ) : (
        <div className="addresses-list">
          {displayedAddresses.map((address) => (
            <div 
              key={address.id} 
              className={`address-card ${selectedAddressId === address.id ? 'selected' : ''} ${address.isDefault ? 'default' : ''}`}
              onClick={() => {
                console.log('Address card clicked:', address);
                onAddressSelect && onAddressSelect(address);
              }}
            >
              <div className="address-check">
                <Check size={16} />
              </div>
              <div className="address-content">
                <div className="address-header">
                  <div className="address-type">
                    {getAddressTypeIcon(address.addressType)}
                    <span className="type-label">{getAddressTypeLabel(address.addressType)}</span>
                    {address.isDefault && (
                      <span className="default-badge">
                        <Star size={12} />
                        Default
                      </span>
                    )}
                  </div>
                  
                  <div className="address-actions">
                    <button
                      className="action-button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowAddressActions(showAddressActions === address.id ? null : address.id);
                      }}
                    >
                      <MoreHorizontal size={16} />
                    </button>
                    
                    {showAddressActions === address.id && (
                      <div className="actions-dropdown">
                        <button
                          className="action-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEditForm(address);
                          }}
                        >
                          <Edit size={14} />
                          Edit
                        </button>
                        
                        {!address.isDefault && (
                          <button
                            className="action-item"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSetDefault(address.id);
                            }}
                          >
                            <Star size={14} />
                            Set as Default
                          </button>
                        )}
                        
                        <button
                          className="action-item delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteAddress(address.id);
                          }}
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="address-details">
                  <p className="address-text">{formatAddress(address)}</p>
                </div>
              </div>
            </div>
          ))}
          
          {hasMoreAddresses && (
            <div className="show-more-addresses">
              <button
                className="show-more-button"
                onClick={() => setShowAllAddresses(!showAllAddresses)}
              >
                {showAllAddresses ? (
                  <>
                    <ChevronUp size={16} />
                    Show Less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} />
                    Show {addresses.length - 3} More Addresses
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Address Form Modal */}
      {showAddressForm && (
        <AddressForm
          address={editingAddress}
          onSave={editingAddress ? handleEditAddress : handleCreateAddress}
          onCancel={closeForm}
          isEditing={!!editingAddress}
        />
      )}
    </div>
  );
};

export default Address;
