import React, { useEffect, useState } from 'react';
import { takeTest, viewquestion } from '../../services/apiServices';
import { toast } from 'react-toastify';
import jsPDF from 'jspdf';

const QuizView = ({ quiz, subjectId, onBack, role = "student" }) => {
  const [questions, setQuestions] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [marks, setMarks] = useState(0);
  const [subject, setSubject] = useState('');

  useEffect(() => {
    async function fetchQuizDetails() {
      try {
        if (!subjectId) {
          toast.error("Subject ID not found.");
          return;
        }

        console.log("Calling API with subjectId:", subjectId);

        const data = await viewquestion(subjectId);

        if (data?.quizzes?.length > 0 && data.quizzes[0]?.questions?.length > 0) {
          setQuestions(data.quizzes[0].questions);
          setQuizInfo(data.quizzes[0]);
        } else {
          toast.info("No questions found.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to load quiz.");
      } finally {
        setLoading(false);
      }
    }

    fetchQuizDetails();
  }, [subjectId]); // <== Ensure subjectId is a dependency

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    try {
      const testData = {
        subjectId, // Ensure this is passed with the request
        responses: Object.keys(answers).map((questionId) => ({
          questionId,
          selectedOption: answers[questionId],
        })),
      };

      const response = await takeTest(testData);

      if (response) {
        setTestSubmitted(true);
        setUserInfo(response.userInfo);  // Save user info (name, email)
        setMarks(response.totalMarks);    // Save total marks
        setSubject(response.data.subject);    // Save the subject
        toast.success('Test submitted successfully!');
      }
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error(error.message || 'Failed to submit test.');
    }
  };

  // Download result as PDF
  const downloadResult = () => {
    const doc = new jsPDF();
    
    // Add the logo to PDF
    const logo = new Image();
    logo.src = '/public/images/logo.png'; // Use the relative path to your logo
    doc.addImage(logo, 'PNG', 10, 10, 60, 60); // Position and size of the logo

    // Add the rest of the PDF content
    doc.text(`Test Results`, 10, 80);
    doc.text(`Name: ${userInfo.name}`, 10, 90);
    doc.text(`Email: ${userInfo.email}`, 10, 100);
    doc.text(`Subject: ${subject}`, 10, 110);
    doc.text(`Total Questions: ${questions.length}`, 10, 120);
    doc.text(`Total Marks: ${marks}`, 10, 130);

    // Save the PDF
    doc.save('test-result.pdf');
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          {testSubmitted ? (
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <img
                  src="/public/images/logo.png"
                  alt="Quiz Portal Logo"
                  style={{ height: "60px", marginRight: "10px" }}
                />
                <h3 className="card-title">Test Submission Completed</h3>

                {/* User Info */}
                <div className="card-text">
                  <h5>User Information:</h5>
                  <ul className="list-group">
                    <li className="list-group-item">Name: {userInfo.name}</li>
                    <li className="list-group-item">Email: {userInfo.email}</li>
                    <li className="list-group-item">Subject: {subject}</li>
                  </ul>
                </div>

                {/* Test Results */}
                <div className="mt-4">
                  <h5>Test Results</h5>
                  <p>
                    Total Questions: {questions.length}<br />
                    Total Marks: {marks}
                  </p>
                </div>

                <div className="mt-3">
                  {/* Go to Dashboard Button */}
                  <button
                    className="btn btn-outline-primary btn-sm mx-2"
                    onClick={() => window.location.reload()}
                    style={{
                      padding: "8px 20px",
                      fontSize: "14px",
                      borderRadius: "20px",
                    }}
                  >
                    Go to Dashboard
                  </button>

                  {/* Download Result Button */}
                  <button
                    className="btn btn-outline-secondary btn-sm mx-2"
                    onClick={downloadResult}
                    style={{
                      padding: "8px 20px",
                      fontSize: "14px",
                      borderRadius: "20px",
                    }}
                  >
                    Download Result
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* Display the quiz as normal before submission */}
              <h3 id="overview">Quiz Details</h3>

              {quizInfo && (
                <div className="card mb-4 shadow-sm border-0">
                  <div className="card-body">
                    <h5 className="card-title mb-3">
                      <i className="bi bi-journal-text me-2"></i>Quiz Overview
                    </h5>
                    <div className="table-responsive">
                      <table className="table table-bordered align-middle">
                        <tbody>
                          <tr>
                            <th style={{ width: "30%" }}>Subject</th>
                            <td><span className="badge bg-primary">{quizInfo.subject}</span></td>
                          </tr>
                          <tr>
                            <th>Duration</th>
                            <td><span className="badge bg-info text-dark">{quizInfo.durationInMinutes} min</span></td>
                          </tr>
                          <tr>
                            <th>Start Time</th>
                            <td><span className="badge bg-success">{new Date(quizInfo.createdAt).toLocaleString()}</span></td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td>
                              <span className={`badge ${quizInfo.isActive ? 'bg-success' : 'bg-secondary'}`}>
                                {quizInfo.isActive ? 'Active' : 'Inactive'}
                              </span>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Render questions */}
              <h4 id="questions">Questions ({questions.length})</h4>
              {questions.map((question, index) => (
                <div key={question._id} className="card mb-3">
                  <div className="card-header">
                    <strong>Q{index + 1}:</strong> {question.questionText}
                  </div>
                  <div className="card-body">
                    {question.options.map((opt, i) => (
                      <div key={i} className="form-check d-flex justify-content-between align-items-center mb-2">
                        <label className="form-check-label" style={{ fontSize: "1.1rem" }}>
                          {String.fromCharCode(65 + i)}. {opt}
                        </label>
                        <input
                          className="form-check-input"
                          type="radio"
                          name={`q-${index}`}
                          value={opt}
                          onChange={() => handleOptionChange(question._id, opt)}
                          style={{ transform: "scale(1.5)", cursor: "pointer", accentColor: "black" }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {role === "student" && (
                <button className="btn btn-success mt-3" onClick={handleSubmit}>
                  Submit
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizView;
