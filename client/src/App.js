import './App.css';
import { ChakraProvider, Container } from '@chakra-ui/react';
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import AudioRecorder from './pages/AudioRecorder';
import Login from './pages/Login';
import Register from './pages/Register';
import Header from './components/Header';
import { selectIsAuthenticated, logout } from './store/authSlice';

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  const ProtectedRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <ChakraProvider>
      <Router>
        <div className="App">
          <Header isLoggedIn={isAuthenticated} />
          <Container>
            <Routes>
              <Route
                path="/"
                element={isAuthenticated ? <Navigate to="/record" /> : <Home />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/record"
                element={
                  <ProtectedRoute>
                    <AudioRecorder />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </Container>
        </div>
      </Router>
    </ChakraProvider>
  );
}

export default App;
