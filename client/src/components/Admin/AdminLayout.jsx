import React, { useState, useEffect } from 'react';
import UploadQuestions from './UploadQuestions';
import { useNavigate } from 'react-router-dom';
import { getCourses } from '../../services/apiServices';
import { toast } from 'react-toastify';

const AdminLayout = () => {
  const [showUploadQuestions, setShowUploadQuestions] = useState(false);
  const [courses, setCourses] = useState([]);
  const [selected, setSelected] = useState({}); // { [courseId]: { yearId, semesterId, subjectId } }
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

  const handleSelect = (courseId, key, value) => {
    setSelected(prev => {
      const updated = { ...prev };
      if (!updated[courseId]) updated[courseId] = {};
      updated[courseId][key] = value;
      // Reset lower selections if upper selection changes
      if (key === 'yearId') {
        updated[courseId].semesterId = '';
        updated[courseId].subjectId = '';
      }
      if (key === 'semesterId') {
        updated[courseId].subjectId = '';
      }
      return updated;
    });
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
    // You can pass selected[courseId] to UploadQuestions if needed
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

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/admin">
            <img
              src="/public/images/logo.png"
              alt="Quiz Portal Logo"
              style={{ height: "60px", marginRight: "10px" }}
            />
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
                  Home
                </a>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-3" onClick={handleLogout}>Logout</button>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="d-flex flex-grow-1">
        {/* Sidebar */}
        <div className="bg-dark text-white p-3" style={{ width: '250px' }}>
          <ul className="nav flex-column">
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
          </ul>
        </div>

        {/* Main Content Area */}
        <div className="flex-grow-1 p-4">
          {!showUploadQuestions ? (
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
                      {/* <th>Quiz List</th> */}
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => {
                      const sel = selected[course._id] || {};
                      const years = getYears(course);
                      const semesters = getSemesters(course, sel.yearId);
                      const subjects = getSubjects(course, sel.yearId, sel.semesterId);
                      return (
                        <tr key={course._id}>
                          <td>{course.courseName}</td>
                          <td>
                            <select
                              className="form-select"
                              value={sel.yearId || ''}
                              onChange={e => handleSelect(course._id, 'yearId', e.target.value)}
                            >
                              <option value="">Select Year</option>
                              {years.map(y => (
                                <option key={y._id} value={y._id}>
                                  Year {y.year}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={sel.semesterId || ''}
                              onChange={e => handleSelect(course._id, 'semesterId', e.target.value)}
                              disabled={!sel.yearId}
                            >
                              <option value="">Select Semester</option>
                              {semesters.map(s => (
                                <option key={s._id} value={s._id}>
                                  Semester {s.semester}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                              className="form-select"
                              value={sel.subjectId || ''}
                              onChange={e => handleSelect(course._id, 'subjectId', e.target.value)}
                              disabled={!sel.semesterId}
                            >
                              <option value="">Select Subject</option>
                              {subjects.map(sub => (
                                <option key={sub._id} value={sub._id}>
                                  {sub.subjectName}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <button
                              className="btn btn-primary"
                              disabled={!sel.subjectId}
                              onClick={() => handleUploadClick(course._id)}
                            >
                              Upload Quiz
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
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