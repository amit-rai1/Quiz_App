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
  try {
    const response = await api.get(`/admin/questions/${subjectId}`);

    const data = response.data?.data || response.data; // <-- Fix here
    return data;
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    throw error;
  }
};



// export const viewquestion = async (subjectId) => {
//   console.log("subjectId",subjectId);
//   // const subjectId = "648b0f3c4d1a2e2f8c5b8e4d"; // Replace with the actual subjectId you want to fetch
//   try {
//     const response = await api.get(
//       `/admin/viewQuestionForm/${"68146a31a2664064267bb310"}`
//     );
//     console.log("response",response);
//     return response.data;

//   } catch (error) {
//     console.error('Error fetching quizzes:', error);
//     throw error;
//   }
// };

export const viewquestion = async (subjectId) => {
  console.log("subjectId", subjectId); // Log the subjectId being passed
  try {
    const response = await api.get(`/admin/viewQuestionForm/${subjectId}`); // Use the dynamic subjectId
    console.log("response", response);
    return response.data;
  } catch (error) {
    console.error('Error fetching quizzes:', error);
    throw error;
  }
};
export const takeTest = async (testData) => {
  try {
    const response = await api.post('/user/submit-test', testData, {
    
    });
    return response.data;
  } catch (error) {
    console.error('Error submitting test:', error);
    throw error.response?.data || error.message;
  }
};

export const getAllCourses = async () => {
  try {
    const response = await api.get('/admin/courses'); // API endpoint for fetching all courses
    return response.data.courses; // Return the list of courses
  } catch (error) {
    console.error('Error fetching courses:', error);
    throw error.response?.data || error.message; // Throw error for handling
  }
};