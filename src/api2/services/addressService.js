import { api } from '../client';
const userService = {
/**
   * Get all addresses
   * @returns {Promise<Address[]>} 
   */
getAddress: () => 
    api.addresses.get('/users/addresses'),

 /**
   * Get a specific address by ID
   * @param {number} id - address ID
   * @returns {Promise<Address>} address details
   */
 getAddress: (id) => 
    api.Address.get('/users${id}/address${id}'),

 /**
   * Create a new address
   * @param {UserInput} data - user address
   * @returns {Promise<Address>} Created address
   */
 createUser: (data) => 
    api.Address.post('/users/address', {
     addressType: data.Address,
     streetAddress: data.streetAddress,
     city: data.city,
     state: data.state,
     postalCode: data.postalCode,
     country: data.country
    }),


}
