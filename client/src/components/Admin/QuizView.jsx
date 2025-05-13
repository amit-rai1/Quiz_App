import React, { useEffect, useState } from 'react';
import { takeTest, viewquestion } from '../../services/apiServices';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuizView = ({ role = "student" }) => {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState({});
  const [testSubmitted, setTestSubmitted] = useState(false); // State to track if the test is submitted

  useEffect(() => {
    async function fetchQuizDetails() {
      try {
        const storedSubjectId = localStorage.getItem('subjectId');
        if (!storedSubjectId) {
          toast.error("Subject ID not found in localStorage.");
          return;
        }

        const data = await viewquestion(storedSubjectId);

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
  }, []);

  const handleOptionChange = (questionId, selectedOption) => {
    setAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    try {
      const testData = {
        responses: Object.keys(answers).map((questionId) => ({
          questionId,
          selectedOption: answers[questionId],
        })),
      };

      await takeTest(testData);

      // Set testSubmitted to true to show the confirmation card
      setTestSubmitted(true);

      toast.success('Test submitted successfully!');
    } catch (error) {
      console.error('Error submitting test:', error);
      toast.error(error.message || 'Failed to submit test.');
    }
  };

  if (loading) {
    return <div className="container mt-4">Loading quiz...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-12">
          {testSubmitted ? (
            // Confirmation card after test submission
            <div className="card text-center shadow-sm">
              <div className="card-body">
                <h3 className="card-title">Thank You!</h3>
                <p className="card-text">
                  Your test has been submitted successfully. You will be notified once the results are available.
                </p>
                <button
                  className="btn btn-primary"
                  onClick={() => window.location.reload()} // Reload the page or navigate to another route
                >
                  Go Back to Dashboard
                </button>
              </div>
            </div>
          ) : (
            // Quiz questions and submit button
            <>
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
                          style={{ transform: "scale(1.5)", cursor: "pointer", accentColor: "black", }}
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