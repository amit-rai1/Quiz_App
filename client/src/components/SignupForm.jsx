import React, { useState } from 'react';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
// import { registerUser } from '../../services/apiServices'; // Make sure this exists
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const SignupForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    gender: '',
    phone: '',
    CrNo: '',
    courseName: '',
    yearName: '',
    semesterName: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await registerUser(formData);
      localStorage.setItem('token', data.token);
      toast.success('Signup successful!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-md-center">
        <Col md={6}>
          <h3 className="mb-4">Student Signup</h3>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Full Name</Form.Label>
              <Form.Control type="text" name="name" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="email" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" name="password" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Gender</Form.Label>
              <Form.Select name="gender" onChange={handleChange} required>
                <option value="">Select</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Phone</Form.Label>
              <Form.Control type="tel" name="phone" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>CR No</Form.Label>
              <Form.Control type="number" name="CrNo" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course</Form.Label>
              <Form.Control type="text" name="courseName" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control type="text" name="yearName" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Semester</Form.Label>
              <Form.Control type="text" name="semesterName" onChange={handleChange} required />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default SignupForm;
