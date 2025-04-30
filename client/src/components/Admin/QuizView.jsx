import React, { useEffect, useState } from 'react';
import { viewquestion } from '../../services/apiServices';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const QuizView = () => {
  const { subjectId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [quizInfo, setQuizInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchQuizDetails() {
      try {
        const data = await viewquestion(subjectId);
        console.log(data, "raw quiz data");

        if (data?.quizzes?.length > 0 && data.quizzes[0]?.questions?.length > 0) {
          setQuestions(data.quizzes[0].questions);
          setQuizInfo(data.quizzes[0]); // Store quiz meta info
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
  }, [subjectId]);

  const formatTime = (timeString) => new Date(timeString).toLocaleString();

  if (loading) {
    return <div className="container mt-4">Loading quiz...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3 mb-3">
          <div className="list-group">
            <div className="list-group-item active">Navigation</div>
            <a href="#overview" className="list-group-item list-group-item-action">Quiz Overview</a>
            <a href="#questions" className="list-group-item list-group-item-action">Questions</a>
          </div>
        </div>

        {/* Main content */}
        <div className="col-md-9">
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
                        <th style={{ width: "30%" }}>File Name</th>
                        <td><span className="badge bg-primary">{quizInfo.subject}</span></td>
                      </tr>
                      <tr>
                        <th>Duration</th>
                        <td><span className="badge bg-info text-dark">{quizInfo.durationInMinutes} min</span></td>
                      </tr>
                      <tr>
                        <th>startTime</th>
                        <td><span className="badge bg-success">{formatTime(quizInfo.createdAt)}</span></td>
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
                {question.options.map((opt, i) => {
                  const isCorrect = opt === question.correctAnswer;
                  return (
                    <div key={i} className="form-check">
                      <input
                        className="form-check-input"
                        type="radio"
                        name={`q-${index}`}
                        disabled
                      />
                      <label className={`form-check-label ${isCorrect ? 'text-success fw-bold' : ''}`}>
                        {String.fromCharCode(65 + i)}. {opt}
                        {isCorrect && <span> ✓ (Correct Answer)</span>}
                      </label>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          <button className="btn btn-primary mt-3" disabled>Submit (Admin View)</button>
        </div>
      </div>
    </div>
  );
};

export default QuizView;
