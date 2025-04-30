import React, { useEffect, useState } from 'react';
import { getCourses, uploadExcelQuestions } from '../../services/apiServices';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const UploadQuestions = () => {
  const [courses, setCourses] = useState([]);
  const [selectedCourseId, setSelectedCourseId] = useState('');
  const [selectedYearId, setSelectedYearId] = useState('');
  const [selectedSemesterId, setSelectedSemesterId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [file, setFile] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [durationInMinutes, setDurationInMinutes] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const data = await getCourses();
      setCourses(data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch courses");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    try {
      if (!file || !selectedSubjectId || !startTime || !durationInMinutes) {
        toast.error("Please select all fields and upload file");
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

      toast.success(response.message || "Questions uploaded successfully!");

      // Navigate to QuizList page with the selected subjectId
      navigate(`/quiz-list/${selectedSubjectId}`);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong!");
    }
  };

  const selectedCourse = courses.find(c => c._id === selectedCourseId);
  const selectedYear = selectedCourse?.years.find(y => y._id === selectedYearId);
  const selectedSemester = selectedYear?.semesters.find(s => s._id === selectedSemesterId);

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
              setSelectedYearId('');
              setSelectedSemesterId('');
              setSelectedSubjectId('');
            }}
          >
            <option value="">Select Course</option>
            {courses.map(course => (
              <option key={course._id} value={course._id}>{course.courseName}</option>
            ))}
          </select>
        </div>

        {/* Year Select */}
        {selectedCourse && (
          <div className="mb-3">
            <label className="form-label">Select Year</label>
            <select
              className="form-select"
              value={selectedYearId}
              onChange={(e) => {
                setSelectedYearId(e.target.value);
                setSelectedSemesterId('');
                setSelectedSubjectId('');
              }}
            >
              <option value="">Select Year</option>
              {selectedCourse?.years.map(year => (
                <option key={year._id} value={year._id}>{year.yearName}</option>
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
              value={selectedSemesterId}
              onChange={(e) => {
                setSelectedSemesterId(e.target.value);
                setSelectedSubjectId('');
              }}
            >
              <option value="">Select Semester</option>
              {selectedYear?.semesters.map(sem => (
                <option key={sem._id} value={sem._id}>{sem.semesterName}</option>
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
              {selectedSemester?.subjects.map(sub => (
                <option key={sub._id} value={sub._id}>{sub.subjectName}</option>
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
        <button type="submit" className="btn btn-primary">Upload Questions</button>
      </form>
    </div>
  );
};

export default UploadQuestions;