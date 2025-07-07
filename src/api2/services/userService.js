import axios from 'axios';

const USER_API_BASE = 'http://localhost:8085/api/v1/users/users';

const userService = {
  getUser: (userId) => axios.get(`${USER_API_BASE}/${userId}`),
};

export default userService; 