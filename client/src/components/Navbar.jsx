import React from 'react';

import { useNavigate } from 'react-router-dom';

const NavBar = ({ onLogout, isAdmin }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      localStorage.removeItem('token');
      navigate('/');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container-fluid">
        <a className="navbar-brand" href={isAdmin ? "/admin" : "/"}>
          <img
            src="/public/images/logo.png"
            alt="Quiz Portal Logo"
            style={{ height: "60px", marginRight: "10px" }}
          />
          {isAdmin ? "Admin Dashboard" : "Quiz Portal"}
        </a>
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
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <a className="nav-link" href={isAdmin ? "/dashboard" : "/"}>
                Home
              </a>
            </li>
            <li className="nav-item">
              <button className="btn btn-outline-light ms-3" onClick={handleLogout}>
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;