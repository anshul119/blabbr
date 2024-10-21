import React, { useState } from 'react';
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
import { registerUser } from '../api/UserService';

const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  // Usage in a React component
  const handleRegistration = async (e) => {
    e.preventDefault();
    setError(''); // Clear any previous errors
    try {
      const result = await registerUser({ username, email, password });
      console.log('Registration successful:', result);
      // Handle successful registration (e.g., show success message, redirect)
    } catch (error) {
      console.error('Registration error:', error.message);
      setError(error.message || 'An error occurred during registration');
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
        Register
      </Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      <form onSubmit={handleRegistration}>
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

          <FormControl id="email" isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
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
            Register
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default RegisterForm;
