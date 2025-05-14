import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { Modal, Button } from 'react-bootstrap';
import { getAllQuizzesBySubject } from '../../services/apiServices';
import { toast } from 'react-toastify';
import QuizView from '../Admin/QuizView';
import { useNavigate } from 'react-router-dom';
import NavBar from '../Navbar';

const Dashboard = () => {
  const [subjects, setSubjects] = useState([]);
  const [showSubjects, setShowSubjects] = useState(false);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        const subjectList = decoded?.id?.subjects || [];
        setSubjects(subjectList);
      } catch (err) {
        console.error('Invalid token:', err);
      }
    }
  }, []);

  const handleCardClick = () => setShowSubjects(true);

  const handleSubjectClick = async (subject) => {
    setSelectedSubject(subject);
    try {
      const quizzesData = await getAllQuizzesBySubject(subject.subjectId);
      localStorage.setItem('subjectId', quizzesData.subjectId);
      setQuizzes(quizzesData.quizzes);
      setShowSubjects(false);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
    }
  };

  const handleViewQuiz = (quiz) => setSelectedQuiz(quiz);
  const handleCloseSubjectsModal = () => setShowSubjects(false);
  const handleBackToDashboard = () => setSelectedQuiz(null);

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful');
    navigate("/");
  };

  return (
    <div>
      {/* Top Navbar */}
<NavBar onLogout={handleLogout} /> 
      {/* Main Layout */}
      <div className="container-fluid">
        <div className="row min-vh-100">
          {/* Sidebar */}
          <div className="col-md-2 bg-dark text-white p-3">
            <h5 className="text-center">User Panel</h5>
            <ul className="nav flex-column mt-4">
              <li className="nav-item mb-2">
                <a className="nav-link text-white" href="#">My Quizzes</a>
              </li>
              <li className="nav-item mb-2">
                <a className="nav-link text-white" href="#">Quiz History</a>
              </li>
              <li className="nav-item mb-2">
                <a className="nav-link text-white" href="#">Profile</a>
              </li>
            </ul>
          </div>

          {/* Main Content */}
          <div className="col-md-10 bg-light">
            <div className="container py-4">
              {selectedQuiz ? (
                <QuizView
  quiz={selectedQuiz}
  subjectId={selectedSubject?.subjectId}
  onBack={handleBackToDashboard}
/>

              ) : (
                <>
                  <div className="card mb-4 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">Dashboard Overview</h5>
                      <p className="card-text">Access your quizzes, view history, and manage profile.</p>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <div className="card text-white bg-primary shadow" onClick={handleCardClick} style={{ cursor: 'pointer' }}>
                        <div className="card-body">
                          <h6>Total Quizzes</h6>
                          <h4>10</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card text-white bg-success shadow" onClick={() => alert("You have completed 6 quizzes.")} style={{ cursor: 'pointer' }}>
                        <div className="card-body">
                          <h6>Completed Quizzes</h6>
                          <h4>6</h4>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-4 mb-3">
                      <div className="card text-white bg-warning shadow" onClick={() => alert("You have 2 upcoming quizzes.")} style={{ cursor: 'pointer' }}>
                        <div className="card-body">
                          <h6>Upcoming Quizzes</h6>
                          <h4>2</h4>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Modal for Subjects */}
                  <Modal show={showSubjects} onHide={handleCloseSubjectsModal}>
                    <Modal.Header closeButton>
                      <Modal.Title>Subjects</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                      <ul className="list-group">
                        {subjects.map((subject, index) => (
                          <li key={index} className="list-group-item list-group-item-action" onClick={() => handleSubjectClick(subject)} style={{ cursor: 'pointer' }}>
                            {subject.subjectName} ({subject.subjectId})
                          </li>
                        ))}
                      </ul>
                    </Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseSubjectsModal}>Close</Button>
                    </Modal.Footer>
                  </Modal>

                  {/* Quizzes Table */}
                  {selectedSubject && quizzes.length > 0 && (
                    <div className="card mt-4 shadow-sm">
                      <div className="card-body">
                        <h5 className="card-title">Quizzes for {selectedSubject.subjectName}</h5>
                        <table className="table table-bordered">
                          <thead>
                            <tr>
                              <th>Quiz Name</th>
                              <th>Status</th>
                              <th>Scheduled Date</th>
                              <th>Scheduled Time</th>
                              <th>Duration (Minutes)</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {quizzes.map((quiz, index) => (
                              <tr key={index}>
                                <td>{quiz.quizName}</td>
                                <td>{quiz.status}</td>
                                <td>{quiz.scheduledDate}</td>
                                <td>{quiz.scheduledTime}</td>
                                <td>{quiz.durationInMinutes}</td>
                                <td>
                                  <button className="btn btn-primary btn-sm" onClick={() => handleViewQuiz(quiz)}>
                                    View
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
