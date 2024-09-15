import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Heading,
} from '@chakra-ui/react';
import { loginUser } from '../api/UserService';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await loginUser({ username, password });
      console.log('Login successful:', result);
      // Handle successful login (e.g., store token, redirect)
      localStorage.setItem('token', result.token);
    } catch (error) {
      console.error('Login error:', error.message);
      // Handle login error (e.g., show error message)
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
