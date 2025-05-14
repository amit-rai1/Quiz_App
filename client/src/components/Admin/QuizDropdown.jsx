import React, { useState } from "react";

const QuizDropdown = ({ quizzes }) => {
  const [selectedQuizIndex, setSelectedQuizIndex] = useState(null);

  const handleSelect = (index) => {
    setSelectedQuizIndex(index === selectedQuizIndex ? null : index);
  };

  return (
    <>
      {quizzes.length > 0 ? (
        <div>
          {quizzes.map((quiz, index) => (
            <div key={quiz._id} className="mb-2"> {/* Use quiz._id for the key */}
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => handleSelect(index)}
              >
                Quiz {index + 1}: {quiz.quizName}
              </button>

              {/* Show details on click */}
              {selectedQuizIndex === index && (
                <table className="table table-bordered table-sm mt-2">
                  <tbody>
                    <tr>
                      <th>Status</th>
                      <td>{quiz.status}</td>
                    </tr>
                    <tr>
                      <th>Date</th>
                      <td>{new Date(quiz.scheduledDate).toLocaleDateString()}</td>
                    </tr>
                    <tr>
                      <th>Time</th>
                      <td>{quiz.scheduledTime}</td>
                    </tr>
                    <tr>
                      <th>Duration</th>
                      <td>{quiz.durationInMinutes} mins</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          ))}
        </div>
      ) : (
        <span className="text-muted">No quizzes available</span>
      )}
    </>
  );
};

export default QuizDropdown;
