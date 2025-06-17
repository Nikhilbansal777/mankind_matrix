import { api } from '../client';
const userService = {
/**
   * Get all users
   * @returns {Promise<User[]>} Array of user 
   */
getUsers: () => 
    api.user.get('/auth/users'),
 /**
   * Get a single user by ID
   * @param {number} id - user ID
   * @returns {Promise<User>} user details
   */
 getUser: (id) => 
    api.user.get('/auth/users${id}'),
 /**
   * Create a new user
   * @param {UserInput} data - user data
   * @returns {Promise<User>} Created user
   */
 createUser: (data) => 
   api.user.post('/auth/register', {
     username: data.username,
     firstName: data.firstName,
     lastName: data.lastName,
     email:data.email,
     password : data.password,
   }),

   /**
   * user login 
   * @param {UserInput} data - user data
   * @returns {Promise<User>} user details
   */
 loginUser: (data) => 
   api.user.post('auth/login', {
     username: data.username,
     password : data.password,
   }),

  /**
   * logout user
   * @param {number} id - user ID to logout
   * @returns {Promise<void>}
   */
  logoutUser: (id) => 
   api.user.logout(`auth/logout/${id}`)
  











};
export default userService; 