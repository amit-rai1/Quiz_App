import React, { useState } from 'react';
import { loginUser } from '../services/apiServices';
import { toast } from 'react-toastify'; // Import toast
import { Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // Correct import for jwt-decode
function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setError('');

  //   try {
  //     const data = await loginUser(email, password);
  //     const { token } = data;
  //     console.log('Login Successful, Token:', token);
  //     localStorage.setItem('token', token);

  //     toast.success('Login successful! 🎉'); // Success Toast
  //     setTimeout(() => {
  //       navigate('/dashboard'); // Redirect after a short delay
  //     }, );

  //   } catch (err) {
  //     console.error(err);
  //     setError('Invalid email or password');
  //     toast.error('Login failed! ❌'); // Error Toast
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
  
    try {
      const data = await loginUser(email, password);
      const { token } = data;
  
      const decoded = jwtDecode(token);
      console.log('Decoded Token:', decoded); // Log the decoded token for debugging
      const { role, userId } = decoded.id; 
      // Store everything you need in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userId', userId);
  
      toast.success('Login successful! 🎉');
  
      setTimeout(() => {
        if (role === 'admin') {
          navigate('/dashboard');
        } else {
          navigate('/user-dashboard');
        }
      }, 500);
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
      toast.error('Login failed! ❌');
    }
  };
  
  return (
    <div className="container d-flex align-items-center justify-content-center min-vh-100">
      <div className="card p-4 shadow" style={{ maxWidth: '400px', width: '100%' }}>
        {/* Logo */}
        <div className="text-center mb-4">
          <img 
            src="/public/images/logo.png" // Replace with the actual path to your logo
            alt="Quiz Portal Logo"
            style={{ height: '60px' }} // Adjust the height as needed
          />
        </div>
  
        <h2 className="text-center mb-4">Login</h2>
  
        {error && <div className="alert alert-danger">{error}</div>}
  
        <form onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <label>Email address</label>
            <input 
              type="email" 
              className="form-control" 
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
  
          <div className="form-group mb-3">
            <label>Password</label>
            <input 
              type="password" 
              className="form-control" 
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
  
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
  
        <p className="text-center mt-3">
          Don't have an account? <a href="/signup">Sign Up</a>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
