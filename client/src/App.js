import './App.css';
import {
  ChakraProvider,
  Heading,
  Box,
  Container,
  Center,
} from '@chakra-ui/react';
import AudioRecorder from './AudioRecorder';

function App() {
  return (
    <ChakraProvider>
      <div className="App">
        <Container>
          <Heading mt={10} mb={1} textAlign="center">
            Welcome to Blabbr 📣
          </Heading>
          <Box mb={10} textAlign={'center'}>
            From raw thoughts ⚙️ to captivating blog posts 🎯
          </Box>
          <AudioRecorder />
        </Container>
      </div>
    </ChakraProvider>
  );
}

export default App;
