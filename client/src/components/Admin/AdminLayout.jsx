import React, { useState, useEffect } from 'react';
import UploadQuestions from './UploadQuestions';
import { useNavigate } from 'react-router-dom';
import { getCourses, getAllQuizzesBySubject } from '../../services/apiServices';
import NavBar from '../Navbar';
import { toast } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import QuizView from './QuizView'; // <-- Import QuizView

const AdminLayout = () => {
  const [showUploadQuestions, setShowUploadQuestions] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState({});
  const [quizzes, setQuizzes] = useState({});
  const [viewQuizId, setViewQuizId] = useState(null); // <-- For viewing a quiz
  const [viewSubjectId, setViewSubjectId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchCourses() {
      try {
        const data = await getCourses();
        setCourses(data);
      } catch (err) {
        toast.error('Failed to fetch courses');
      }
    }
    fetchCourses();
  }, []);

  const handleSelect = async (courseId, key, value) => {
    setSelected(prev => {
      const updated = { ...prev };
      if (!updated[courseId]) updated[courseId] = {};
      updated[courseId][key] = value;

      // Reset dependent selections
      if (key === 'yearId') {
        updated[courseId].semesterId = '';
        updated[courseId].subjectId = '';
      }
      if (key === 'semesterId') {
        updated[courseId].subjectId = '';
      }

      return updated;
    });

    if (key === 'subjectId') {
      try {
        const data = await getAllQuizzesBySubject(value);
        setQuizzes(prev => ({
          ...prev,
          [courseId]: Array.isArray(data.quizzes) ? data.quizzes : []
        }));
      } catch (err) {
        toast.error('Failed to load quizzes');
      }
    }
  };

  const getYears = (course) => course.years || [];
  const getSemesters = (course, yearId) => {
    const year = (course.years || []).find(y => y._id === yearId);
    return year ? year.semesters : [];
  };
  const getSubjects = (course, yearId, semesterId) => {
    const semesters = getSemesters(course, yearId);
    const semester = semesters.find(s => s._id === semesterId);
    return semester ? semester.subjects : [];
  };

  const handleUploadClick = (courseId) => {
    setShowUploadQuestions(courseId);
  };

  const handleBackToDashboard = () => {
    setShowUploadQuestions(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Logout successful');
    navigate("/");
  };

  // If a quiz is being viewed, show only QuizView
  if (viewQuizId) {
    return (
      <div className="d-flex flex-column min-vh-100">
        <NavBar isAdmin={ true } onLogout={ handleLogout } />
        <div className="flex-grow-1 p-4">
          <button className="btn btn-secondary mb-3"
            onClick={ () => {
              setViewQuizId(quiz.id);
              setViewSubjectId(selected[courseId]?.subjectId);
            } }


          >
            Back to Quizzes
          </button>
  {viewQuizId && (
  <QuizView subjectId={viewQuizId.subjectId} />
)}


        </div>
      </div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      <NavBar isAdmin={ true } onLogout={ handleLogout } />

      <div className="d-flex flex-grow-1">
        {/* Sidebar */ }
        <div className="bg-dark text-white p-3" style={ { width: '250px' } }>
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link text-white" href="/quizzes">Quizzes</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/subjects">Subjects</a>
            </li>
            <li className="nav-item">
              <a className="nav-link text-white" href="/students">Students</a>
            </li>
          </ul>
        </div>

        {/* Main Content Area */ }
        <div className="flex-grow-1 p-4">
          { !showUploadQuestions ? (
            <div>
              <h3>Courses</h3>
              <div className="table-responsive">
                <table className="table table-bordered align-middle">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Year</th>
                      <th>Semester</th>
                      <th>Subject</th>
                      <th>Quizzes</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { courses.map(course => {
                      const sel = selected[course._id] || {};
                      const years = getYears(course);
                      const semesters = getSemesters(course, sel.yearId);
                      const subjects = getSubjects(course, sel.yearId, sel.semesterId);

                      return (
                        <tr key={ course._id }>
                          <td>{ course.courseName }</td>
                          <td>
                            <select
                              className="form-select"
                              value={ sel.yearId || '' }
                              onChange={ e => handleSelect(course._id, 'yearId', e.target.value) }
                            >
                              <option value="">Select Year</option>
                              { years.map(y => (
                                <option key={ y._id } value={ y._id }>Year { y.year }</option>
                              )) }
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={ sel.semesterId || '' }
                              onChange={ e => handleSelect(course._id, 'semesterId', e.target.value) }
                              disabled={ !sel.yearId }
                            >
                              <option value="">Select Semester</option>
                              { semesters.map(s => (
                                <option key={ s._id } value={ s._id }>Semester { s.semester }</option>
                              )) }
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={ sel.subjectId || '' }
                              onChange={ e => handleSelect(course._id, 'subjectId', e.target.value) }
                              disabled={ !sel.semesterId }
                            >
                              <option value="">Select Subject</option>
                              { subjects.map(sub => (
                                <option key={ sub._id } value={ sub._id }>{ sub.subjectName }</option>
                              )) }
                            </select>
                          </td>
                          <td>
                            { quizzes[course._id]?.length > 0
                              ? `${quizzes[course._id].length} Quizzes`
                              : 'No quizzes' }
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              disabled={ !sel.subjectId }
                              onClick={ () => handleUploadClick(course._id) }
                            >
                              Upload Quiz
                            </button>
                          </td>
                        </tr>
                      );
                    }) }
                  </tbody>
                </table>
              </div>

              {/* Quizzes Tables */ }
              { Object.entries(quizzes).map(([courseId, quizList]) => {
                const sel = selected[courseId];
                if (!sel?.subjectId || quizList.length === 0) return null;
                console.log("quizList for courseId:", courseId, quizList); // <-- Add here

                const courseName = courses.find(c => c._id === courseId)?.courseName || "Course";

                return (
                  <div key={ courseId } className="mt-4">
                    <h5>Quizzes for { courseName }</h5>
                    <table className="table table-bordered table-hover table-sm">
                      <thead className="table-light">
                        <tr>
                          <th>Quiz Name</th>
                          <th>Date</th>
                          <th>Time</th>
                          <th>Duration</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        { quizList.map((quiz, index) => {
                          console.log(`Quiz #${index}:`, quiz);
                          return (
                            <tr key={ quiz.id }>
                              <td>{ quiz.quizName }</td>
                              <td>{ new Date(quiz.scheduledDate).toLocaleDateString() }</td>
                              <td>{ quiz.scheduledTime }</td>
                              <td>{ quiz.durationInMinutes } mins</td>
                              <td>{ quiz.status }</td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-info me-2"
                                  title="View"
                                  onClick={ () => {
                                    console.log('Selected Quiz ID:', quiz.id);
                                    console.log('Selected Subject ID:', selected[courseId]?.subjectId);
                                    setViewQuizId({
                                      quizId: quiz.id,
                                      subjectId: selected[courseId]?.subjectId
                                    });
                                  } }

                                >
                                  <i className="bi bi-eye"></i>
                                </button>
                                <button className="btn btn-sm btn-outline-secondary">
                                  <i className="bi bi-pencil-square"></i>
                                </button>
                              </td>
                            </tr>
                          );
                        }) }



                      </tbody>
                    </table>
                  </div>
                );
              }) }
            </div>
          ) : (
            <div>
              <button
                className="btn btn-secondary mb-3"
                onClick={ handleBackToDashboard }
              >
                Back to Dashboard
              </button>
              <UploadQuestions />
            </div>
          ) }
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;