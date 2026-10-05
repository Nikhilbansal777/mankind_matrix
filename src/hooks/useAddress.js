import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect } from 'react';
import {
  fetchAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setSelectedAddress,
  clearSelectedAddress,
  clearError,
  selectAddresses,
  selectSelectedAddress,
  selectAddressesLoading,
  selectAddressesError,
  selectCreateAddressLoading,
  selectUpdateAddressLoading,
  selectDeleteAddressLoading,
  selectDefaultAddress,
  selectFirstThreeAddresses
} from '../redux/slices/addressSlice';

export const useAddress = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const addresses = useSelector(selectAddresses);
  const selectedAddress = useSelector(selectSelectedAddress);
  const loading = useSelector(selectAddressesLoading);
  const error = useSelector(selectAddressesError);
  const createLoading = useSelector(selectCreateAddressLoading);
  const updateLoading = useSelector(selectUpdateAddressLoading);
  const deleteLoading = useSelector(selectDeleteAddressLoading);
  const defaultAddress = useSelector(selectDefaultAddress);
  const firstThreeAddresses = useSelector(selectFirstThreeAddresses);

  // Actions
  const getAddresses = useCallback(async () => {
    try {
      console.log('useAddress: Dispatching fetchAddresses action');
      const result = await dispatch(fetchAddresses()).unwrap();
      console.log('useAddress: fetchAddresses result:', result);
    } catch (error) {
      console.error('Error fetching addresses:', error);
      // Don't throw the error, just log it
      // The component will handle the error state from Redux
    }
  }, [dispatch]);

  const addAddress = async (addressData) => {
    try {
      const result = await dispatch(createAddress(addressData)).unwrap();
      return result;
    } catch (error) {
      console.error('Error creating address:', error);
      throw error;
    }
  };

  const editAddress = async (id, addressData) => {
    try {
      const result = await dispatch(updateAddress({ id, addressData })).unwrap();
      return result;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };

  const removeAddress = async (id) => {
    try {
      await dispatch(deleteAddress(id)).unwrap();
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  };



  const selectAddress = (address) => {
    dispatch(setSelectedAddress(address));
  };

  const clearSelection = () => {
    dispatch(clearSelectedAddress());
  };

  const clearErrorState = () => {
    dispatch(clearError());
  };

  // Auto-fetch addresses on mount
  useEffect(() => {
    console.log('useAddress hook: Auto-fetching addresses on mount');
    getAddresses();
  }, [getAddresses]);

  return {
    // State
    addresses,
    selectedAddress,
    loading,
    error,
    createLoading,
    updateLoading,
    deleteLoading,
    defaultAddress,
    firstThreeAddresses,
    
    // Actions
    getAddresses,
    addAddress,
    editAddress,
    removeAddress,
    selectAddress,
    clearSelection,
    clearErrorState
  };
};
