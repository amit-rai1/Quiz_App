import React, { useState } from 'react';
import UploadQuestions from './UploadQuestions';

const AdminLayout = () => {
  const [showUploadQuestions, setShowUploadQuestions] = useState(false);

  const handleCardClick = () => {
    setShowUploadQuestions(true);
  };

  const handleBackToDashboard = () => {
    setShowUploadQuestions(false);
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin">
            Quiz Portal
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
                <a className="nav-link" href="/dashboard">
                  Dashboard
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/quizzes">
                  Quizzes
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/subjects">
                  Subjects
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/students">
                  Students
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/logout">
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
          <h4 className="text-center mb-4">Quiz Portal</h4>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="/dashboard">
                Dashboard
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/quizzes">
                Quizzes
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/subjects">
                Subjects
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/students">
                Students
              </a>
            </li>
            <li className="nav-item mt-auto">
              <a className="nav-link text-white" href="/logout">
                Logout
              </a>
            </li>
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 p-4">
          {!showUploadQuestions ? (
            <div className="row">
              {/* Card for Upload Questions */}
              <div className="col-md-4">
                <div
                  className="card text-center"
                  style={{ cursor: 'pointer' }}
                  onClick={handleCardClick}
                >
                  <div className="card-body">
                    <h5 className="card-title">Upload Questions</h5>
                    <p className="card-text">
                      Click here to upload questions for quizzes.
                    </p>
                  </div>
                </div>
              </div>

              {/* Add more cards here if needed */}
            </div>
          ) : (
            <div>
              <button
                className="btn btn-secondary mb-3"
                onClick={handleBackToDashboard}
              >
                Back to Dashboard
              </button>
              <UploadQuestions />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;