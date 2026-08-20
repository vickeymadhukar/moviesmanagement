import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Clapperboard, Mail, Lock, User, AlertCircle } from 'lucide-react';

export default function Register({ setUser }) {
  const [authError, setAuthError] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAuthError('');

    try {
      const response = await axios.post('/api/users', { name, email, password });
      const data = response.data;

      localStorage.setItem('user', JSON.stringify(data));
      setUser(data);
      navigate('/'); // Redirect to Home Page
    } catch (err) {
      setAuthError(err.response?.data?.message || 'Connection error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon" style={{ background: 'var(--primary-gradient)', color: 'white', width: '3.5rem', height: '3.5rem', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', boxShadow: '0 0 20px rgba(139, 92, 246, 0.4)' }}>
            <Clapperboard size={28} />
          </div>
          <h2>CineTrack</h2>
          <p>Create a new account</p>
        </div>

        {authError && (
          <div className="auth-error">
            <AlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <div className="input-icon-wrapper">
              <input 
                type="text" 
                required
                placeholder="e.g. John Doe"
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <User className="input-field-icon" size={16} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <div className="input-icon-wrapper">
              <input 
                type="email" 
                required
                placeholder="e.g. user@gmail.com"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Mail className="input-field-icon" size={16} />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Password</label>
            <div className="input-icon-wrapper">
              <input 
                type="password" 
                required
                placeholder="••••••••"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <Lock className="input-field-icon" size={16} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', padding: '0.85rem' }}>
            Create Account
          </button>
        </form>

        <div className="auth-footer">
          Already have an account? 
          <span className="auth-link" onClick={() => navigate('/login')}>Sign In</span>
        </div>
      </div>
    </div>
  );
}
