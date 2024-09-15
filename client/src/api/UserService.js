import axios from 'axios';

const registerUser = async (userData) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/register`,
      userData
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

const loginUser = async (credentials) => {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_URL}/api/login`,
      credentials
    );
    return response.data;
  } catch (error) {
    if (error.response) {
      throw new Error(error.response.data.error || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export { registerUser, loginUser };
