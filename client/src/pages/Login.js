import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { loginUser } from '../api/UserService';
import { useDispatch } from 'react-redux';
import { setToken } from '../store/authSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      const result = await loginUser({ username, password });
      dispatch(setToken(result.token));
      navigate('/record');
    } catch (error) {
      console.error('Login error:', error.message);
      setError(error.message || 'An error occurred during login');
    }
  };

  return (
    <Box
      width="400px"
      mx="auto"
      mt="50px"
      p={5}
      borderWidth={1}
      borderRadius="lg"
      boxShadow="md"
    >
      <Heading as="h3" size="lg" textAlign="center" mb={6}>
        Login
      </Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleLogin}>
        <Stack spacing={4}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
            />
          </FormControl>

          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
            />
          </FormControl>

          <Button colorScheme="teal" type="submit">
            Login
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default LoginForm;
