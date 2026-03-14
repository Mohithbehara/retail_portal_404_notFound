import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Auth = ({ initialMode = 'login' }) => {
  const [isLogin, setIsLogin] = useState(initialMode === 'login');
  const [email, setEmail] = useState('');
  const [fullname, setFullname] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  useEffect(() => {
    setIsLogin(initialMode === 'login');
  }, [initialMode]);

  /*
  const handleSubmit = async (e) => {
    e.preventDefault();

    const mockUserData = {
      email,
      name: isLogin ? '' : fullname,
    };

    login(mockUserData);
    alert(`${isLogin ? 'Login' : 'Signup'} successful! Role will be extracted from JWT.`);
  };
  */

  const handleSubmit = (e) => {
  e.preventDefault();
  
  // 1. Simulate "Loading" state
  console.log("Connecting to mock server...");

  setTimeout(() => {
    // 2. Logic to decide which "Role" to mock
    // If email includes 'admin', we'll simulate an Admin login
    const isAdmin = email.toLowerCase().includes('admin');
    
    // 3. This is a "Dummy JWT" structure (Header.Payload.Signature)
    // In a real app, this comes from the backend. 
    // Here, we just pass the object to our login function.
    const mockResponse = {
      token: "mock_jwt_token_12345",
      role: isAdmin ? "Admin" : "User",
      name: isLogin ? (isAdmin ? "Boss Admin" : "Regular User") : fullname
    };

    // 4. Send to Context
    login(mockResponse); 
    
    alert(`Mock Login Success! \nRole Assigned: ${mockResponse.role}`);
  }, 800); // 800ms delay to simulate a real API
};
  return (
    <div className="auth-card">
      <div className="auth-header">
        <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
      </div>

      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div className="form-group">
            <label>Full Name</label>
            <input 
              type="text" 
              placeholder="Enter your name" 
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required 
            />
          </div>
        )}

        <div className="form-group">
          <label>Email Address</label>
          <input 
            type="email" 
            placeholder="Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input 
            type="password" 
            placeholder="Password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required 
          />
        </div>

        <button type="submit" className="submit-btn">
          {isLogin ? 'Sign In' : 'Register'}
        </button>
      </form>

      <div className="toggle-auth">
        {isLogin ? "New to the portal? " : "Have an account? "}
        <span onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up' : 'Login'}
        </span>
      </div>
    </div>
  );
};

export default Auth;