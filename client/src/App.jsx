
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import LoginPage from './components/LoginPage';
import AdminLayout from './components/Admin/AdminLayout';
import UploadQuestions from './components/Admin/UploadQuestions';
import AdminDashboard from './components/Admin/AdminDashboard';
import QuizView from './components/Admin/QuizView';
import QuizList from './components/Admin/QuizList';
import Dashboard from './components/User/Dashbord';
import SignupForm from './components/SignupForm';

function App() {

  return (
    <>
     <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/admin" element={<AdminLayout />}/>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="upload" element={<UploadQuestions />} />
        {/* <Route path="upload" element={<UploadQuestions />} /> */}
        <Route path="quiz/:subjectId" element={<QuizView/>} />
        <Route path="quiz-list/:subjectId" element={<QuizList />} />   
        <Route path="user-dashboard" element={<Dashboard />} />
        {/* Other routes (signup, dashboard etc) we will add later */}
      </Routes>
    </Router>
    <ToastContainer position="top-right" autoClose={3000} />
    </>
  )
}

export default App
