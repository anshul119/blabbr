import './App.css';
import { ChakraProvider, Container } from '@chakra-ui/react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import AudioRecorder from './pages/AudioRecorder';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Container>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/record" element={<AudioRecorder />} />
            </Routes>
          </Container>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
