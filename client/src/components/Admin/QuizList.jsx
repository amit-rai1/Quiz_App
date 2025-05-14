import React, { useEffect, useState } from 'react';
import { getAllQuizzesBySubject } from '../../services/apiServices';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import NavBar from '../Navbar';

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [subject, setSubject] = useState('');
  
  const { subjectId } = useParams(); // Get subjectId from the URL
  const navigate = useNavigate(); // Initialize useNavigate

  
  useEffect(() => {
    async function fetchQuizList() {
      try {
        const data = await getAllQuizzesBySubject(subjectId);
  
        setSubject(data.subject);
        setQuizzes(data.quizzes);
        lcalSotorage.setItem('subjectId', data.subjectId);
      } catch (error) {
        console.error("Error in fetchQuizList:", error);
        toast.error('Failed to fetch quizzes');
      }
    }
  
    fetchQuizList();
  }, [subjectId]);
  
  
  const handleQuizClick = () => {
    navigate(`/quiz/${subjectId}`); // Navigate to QuizView with the subjectId
  };

  return (
    <>
      {/* Navbar */}
<NavBar isAdmin={true} onLogout={handleLogout} /> 
      {/* Main Content */}
      <div className="container mt-4">
        <h2>Quiz List for Subject: {subject}</h2>
        {quizzes.length > 0 ? (
          <table className="table table-bordered table-striped">
            <thead className="table-dark">
              <tr>
                <th>#</th>
                <th>Quiz Name</th>
                <th>Scheduled Date</th>
                <th>Scheduled Time</th>
                <th>Duration (mins)</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {quizzes.map((quiz, index) => (
                <tr key={quiz.id}>
                  <td>{index + 1}</td>
                  <td>{quiz.quizName}</td>
                  <td>{quiz.scheduledDate}</td>
                  <td>{quiz.scheduledTime}</td>
                  <td>{quiz.durationInMinutes}</td>
                  <td>{quiz.status}</td>
                  <td>
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={handleQuizClick}
                    >
                      View Quiz
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No quizzes found for this subject.</p>
        )}
      </div>
    </>
  );
};

export default QuizList;