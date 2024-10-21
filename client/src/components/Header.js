import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Flex, Spacer, Text, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Header = ({ isLoggedIn, onLogout }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <Box bg="gray.100" py={4}>
      <Flex maxW="container.lg" mx="auto" alignItems="center">
        <Text as={Link} to="/" ml={2} fontSize="2xl" fontWeight="bold">
          Blabbr
        </Text>
        <Spacer />
        <Box>
          {isLoggedIn ? (
            <>
              <Button as={Link} to="/stories" mr={2}>
                My Stories
              </Button>
              <Button as={Link} to="/record" mr={2}>
                Record
              </Button>
              <Button mr={2} onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button as={Link} to="/login" mr={2}>
                Login
              </Button>
              <Button as={Link} to="/register" mr={2}>
                Register
              </Button>
            </>
          )}
        </Box>
      </Flex>
    </Box>
  );
};

export default Header;
