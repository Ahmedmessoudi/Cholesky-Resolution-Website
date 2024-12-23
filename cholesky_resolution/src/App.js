import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Importez vos composants avec une majuscule (convention React)
import Dense from './Component/MatrixComponent_dense';
import Bande from './Component/MatrixComponent_bande';
import Diagonale from './Component/MatrixComponent_diagonale';

// Import des autres composants
import Home from './Component/home';
import About from './Component/About';

const App = () => {
  return (
    <div className="App-container">
      <Router>
        <nav className="navbar navbar-expand-lg navbar-light bg-light custom-navbar">
          <div className="container-fluid navbar-content">
            <div className="navbar-brand-container">
              <Link to="/" className="navbar-brand">
                Resolution Cholesky
              </Link>
            </div>
            
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
                <li className="nav-item">
                  <Link className="nav-link active" to="/">
                    Home
                  </Link>
                </li>
                <li className="nav-item dropdown">
                  <Link 
                    className="nav-link dropdown-toggle" 
                    to="#" 
                    role="button" 
                    data-bs-toggle="dropdown" 
                    aria-expanded="false"
                  >
                    Matrix
                  </Link>
                  <ul className="dropdown-menu">
                    <li>
                      <Link className="dropdown-item" to="/matrix/dense">
                        Matrix Dense
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/matrix/bande">
                        Matrix Bande
                      </Link>
                    </li>
                    <li>
                      <Link className="dropdown-item" to="/matrix/diagonale">
                        Matrix Diagonale
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/about">
                    About
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="page-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/matrix/dense" element={<Dense />} />
            <Route path="/matrix/bande" element={<Bande />} />
            <Route path="/matrix/diagonale" element={<Diagonale />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
};

export default App;