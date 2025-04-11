import React, { useState } from 'react';
import './Authpage.css';
import { useNavigate } from 'react-router-dom';


function Authpage() {
  const navigate = useNavigate();
  const [activeForm, setActiveForm] = useState('login');


  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');


  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const handleToggle = (formType) => {
    setActiveForm(formType);
  };


  const controlLog = async (e) => {
    e.preventDefault(); 

    const response = await fetch('http://localhost:5000/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: loginEmail,
        password: loginPassword,
      }),
    });

    
    if (response.ok) {
      const token=data.token
      localStorage.setItem("token",token)
      navigate("/main")
      alert('Login successful!');
      setLoginEmail("")
      setLoginPassword("")
      console.log(data);
    } else {
      alert(data.message || 'Login failed');
    }
  };


  const controlReg = async (e) => {
    e.preventDefault();

    if (regPassword !== regConfirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    const response = await fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: regName,
        email: regEmail,
        password: regPassword,
      }),
    });

    const data = await response.json();
    if (response.ok) {
      const token=data.token
      localStorage.setItem("token",token)
      alert('Registered successfully!');
      navigate("/main")
      setRegName("")
      setRegEmail("")
      setRegPassword("")
      setRegConfirmPassword("")
  
      setActiveForm('login');
    } else {
      alert(data.message || 'Registration failed');
    }
  };

  return (
    <div className='auth-wrapper'>
      <div className='auth-container'>

        <div className='form-toggle'>
          <button
            className={activeForm === 'login' ? 'active' : ''}
            onClick={() => handleToggle('login')}
          >
            Login
          </button>
          <button
            className={activeForm === 'register' ? 'active' : ''}
            onClick={() => handleToggle('register')}
          >
            Register
          </button>
        </div>

        {activeForm === 'login' ? (
          <form className='auth-form' onSubmit={controlLog}>
            <h2>Login</h2>
            <input
              type='email'
              placeholder='Email'
              value={loginEmail}
              onChange={(e) => setLoginEmail(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Password'
              value={loginPassword}
              onChange={(e) => setLoginPassword(e.target.value)}
              required
            />
            <button type='submit'>Login</button>
          </form>
        ) : (
          <form className='auth-form' onSubmit={controlReg}>
            <h2>Register</h2>
            <input
              type='text'
              placeholder='Name'
              value={regName}
              onChange={(e) => setRegName(e.target.value)}
              required
            />
            <input
              type='email'
              placeholder='Email'
              value={regEmail}
              onChange={(e) => setRegEmail(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Password'
              value={regPassword}
              onChange={(e) => setRegPassword(e.target.value)}
              required
            />
            <input
              type='password'
              placeholder='Confirm Password'
              value={regConfirmPassword}
              onChange={(e) => setRegConfirmPassword(e.target.value)}
              required
            />
            <button type='submit'>Register</button>
          </form>
        )}
      </div>
    </div>
  );
}

export default Authpage;
