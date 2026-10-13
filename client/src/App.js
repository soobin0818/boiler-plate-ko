import logo from './logo.svg';
import './App.css';

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";

import NavBar from './components/views/NavBar/NavBar';
import LandingPage from './components/views/LandingPage/LandingPage';
import LoginPage from './components/views/LoginPage/LoginPage';
import RegisterPage from './components/views/RegisterPage/RegisterPage';
import Footer from './components/views/Footer/Footer';

function App() {
  return (
    <>
    <NavBar />
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login"  element={<LoginPage />} />
          <Route path="/register"  element={<RegisterPage />} />
        </Routes>
      </div>
    </Router>
    <Footer />
    </>
  );
}

export default App;
