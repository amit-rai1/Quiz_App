import api from './api';

// Login service
export const loginUser = async (email, password) => {
  const response = await api.post('/auth/login', { email, password });  // 🔥 fixed quotes
  return response.data; // { token: "..." }
};

// Get Courses
export const getCourses = async () => {
  const response = await api.get('/user/courses');   // 🔥 fixed quotes
  return response.data;
};

// Upload Excel Questions
export const uploadExcelQuestions = async (formData) => {
  const response = await api.post('/admin/upload-questions', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const getAllQuizzesBySubject = async (subjectId) => {
  const response = await api.get(`/admin/questions/${subjectId}`);
  console.log("abc",response.data);
  return response.data;
};

export const viewquestion = async (subjectId) => {
  try {
    const response = await api.get(
      `/admin/viewQuestionForm/${subjectId}`
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};