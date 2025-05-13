import React, { useEffect, useState } from 'react';
import { getCourses, uploadExcelQuestions } from '../../services/apiServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UploadQuestions = () => {
  const [courses, setCourses] = useState([]); // List of courses
  const [selectedCourseId, setSelectedCourseId] = useState(''); // Selected course ID
  const [selectedYear, setSelectedYear] = useState(null); // Selected year object
  const [selectedSemester, setSelectedSemester] = useState(null); // Selected semester object
  const [selectedSubjectId, setSelectedSubjectId] = useState(''); // Selected subject ID
  const [file, setFile] = useState(null); // File to upload
  const [startTime, setStartTime] = useState(''); // Start time
  const [durationInMinutes, setDurationInMinutes] = useState(''); // Duration
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses(); // Fetch courses from API
      setCourses(data); // Set courses in state
    } catch (error) {
      console.error(error);
      toast.error('Failed to fetch courses');
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!file || !selectedSubjectId || !startTime || !durationInMinutes) {
        toast.error('Please select all fields and upload a file');
        return;
      }

      const formattedStartTime = new Date(startTime).toISOString();
      const numericDuration = parseInt(durationInMinutes, 10);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('startTime', formattedStartTime);
      formData.append('durationInMinutes', numericDuration);
      formData.append('subjectId', selectedSubjectId);

      const response = await uploadExcelQuestions(formData);

      toast.success(response.message || 'Questions uploaded successfully!');

      // Navigate to QuizList page with the selected subjectId
      navigate(`/quiz-list/${selectedSubjectId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Something went wrong!');
    }
  };

  const selectedCourse = courses.find((c) => c._id === selectedCourseId); // Find selected course
  const years = selectedCourse?.years || []; // Get years from selected course
  const semesters = selectedYear?.semesters || []; // Get semesters from selected year
  const subjects = selectedSemester?.subjects || []; // Get subjects from selected semester

  return (
    <div className="container mt-4">
      <h2>Upload Questions</h2>
      <form onSubmit={handleUpload}>
        {/* Course Select */}
        <div className="mb-3">
          <label className="form-label">Select Course</label>
          <select
            className="form-select"
            value={selectedCourseId}
            onChange={(e) => {
              setSelectedCourseId(e.target.value);
              setSelectedYear(null);
              setSelectedSemester(null);
              setSelectedSubjectId('');
            }}
          >
            <option value="">Select Course</option>
            {courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.courseName}
              </option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        {selectedCourse && (
          <div className="mb-3">
            <label className="form-label">Select Year</label>
            <select
              className="form-select"
              value={selectedYear?._id || ''}
              onChange={(e) => {
                const year = years.find((y) => y._id === e.target.value);
                setSelectedYear(year);
                setSelectedSemester(null);
                setSelectedSubjectId('');
              }}
            >
              <option value="">Select Year</option>
              {years.map((year) => (
                <option key={year._id} value={year._id}>
                  Year {year.year}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Semester Select */}
        {selectedYear && (
          <div className="mb-3">
            <label className="form-label">Select Semester</label>
            <select
              className="form-select"
              value={selectedSemester?._id || ''}
              onChange={(e) => {
                const semester = semesters.find((s) => s._id === e.target.value);
                setSelectedSemester(semester);
                setSelectedSubjectId('');
              }}
            >
              <option value="">Select Semester</option>
              {semesters.map((sem) => (
                <option key={sem._id} value={sem._id}>
                  Semester {sem.semester}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Subject Select */}
        {selectedSemester && (
          <div className="mb-3">
            <label className="form-label">Select Subject</label>
            <select
              className="form-select"
              value={selectedSubjectId}
              onChange={(e) => setSelectedSubjectId(e.target.value)}
            >
              <option value="">Select Subject</option>
              {subjects.map((sub) => (
                <option key={sub._id} value={sub._id}>
                  {sub.subjectName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* File Upload */}
        <div className="mb-3">
          <label className="form-label">Select Excel File</label>
          <input
            type="file"
            className="form-control"
            onChange={(e) => setFile(e.target.files[0])}
            accept=".xlsx, .xls"
          />
        </div>

        {/* Start Time */}
        <div className="mb-3">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        {/* Duration */}
        <div className="mb-3">
          <label className="form-label">Duration (in minutes)</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter duration in minutes"
            value={durationInMinutes}
            onChange={(e) => setDurationInMinutes(e.target.value)}
          />
        </div>

        {/* Submit Button */}
        <button type="submit" className="btn btn-primary">
          Upload Questions
        </button>
      </form>
    </div>
  );
};

export default UploadQuestions;