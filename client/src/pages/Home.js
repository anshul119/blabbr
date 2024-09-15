import React from 'react';
import { Heading, Box, Stack, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <>
      <Heading mt={10} mb={1} textAlign="center">
        Welcome to Blabbr 📣
      </Heading>
      <Box mb={10} textAlign={'center'}>
        From raw thoughts ⚙️ to captivating blog posts 🎯
      </Box>
      <Stack direction="row" spacing={4} justify="center">
        <Link to="/login">
          <Button colorScheme="teal">Login</Button>
        </Link>
        <Link to="/register">
          <Button colorScheme="blue">Register</Button>
        </Link>
      </Stack>
    </>
  );
}

export default Home;
