import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Clapperboard, Film, FolderHeart, FolderPlus, Plus, LogOut } from 'lucide-react';
import axios from 'axios';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Home from './pages/Home.jsx';
import MyLists from './pages/MyLists.jsx';

function AppContent() {
  // Session Authentication State
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Shared Movie Lists states (needed by both Home and MyLists)
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);

  // Modal open states (controlled globally)
  const [isListModalOpen, setIsListModalOpen] = useState(false);
  const [isMovieModalOpen, setIsMovieModalOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  // Determine active route path
  const isHome = location.pathname === '/';
  const isLists = location.pathname === '/lists';

  // Fetch lists for the logged-in user
  const fetchUserLists = async () => {
    if (!user) return;
    try {
      const response = await axios.get('/api/movies/lists', {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });
      const data = response.data;
      setLists(data);

      // Keep selected list in sync
      if (selectedList) {
        const refreshedSelected = data.find(l => l._id === selectedList._id);
        setSelectedList(refreshedSelected || null);
      } else if (data.length > 0) {
        setSelectedList(data[0]); // default open first list
      }
    } catch (err) {
      console.error("Error fetching watchlists:", err);
    }
  };

  // Add Movie to list (called from catalog card dropdown)
  const handleAddMovieToList = async (listId, movieId) => {
    try {
      const response = await axios.post('/api/movies/list/addmovie', 
        { listId, movieId },
        {
          headers: { 'Authorization': `Bearer ${user.token}` }
        }
      );

      alert('Movie successfully added to your watchlist!');
      fetchUserLists();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add movie');
    }
  };

  // Logout Session handler
  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setLists([]);
    setSelectedList(null);
    navigate('/login'); // Navigate to Login page
  };

  // Fetch lists when user logs in/changes
  useEffect(() => {
    if (user) {
      fetchUserLists();
    }
  }, [user]);

  // Route protection for signed-out users
  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  // Dashboard layout for authenticated users
  return (
    <div className="app-container">
      {/* App Header */}
      <header className="app-header">
        <div className="logo-section">
          <div className="logo-icon">
            <Clapperboard size={24} />
          </div>
          <div>
            <h1>CineTrack</h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Welcome, {user.name}</p>
          </div>
        </div>

        {/* Navigation Tabs (Linked to path states) */}
        <nav style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '0.35rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
          <button 
            className={`btn ${isHome ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: isHome ? '' : 'none' }}
            onClick={() => navigate('/')}
          >
            <Film size={15} />
            All Movies
          </button>
          <button 
            className={`btn ${isLists ? 'btn-primary' : 'btn-secondary'}`} 
            style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', boxShadow: isLists ? '' : 'none' }}
            onClick={() => navigate('/lists')}
          >
            <FolderHeart size={15} />
            My Watchlists ({lists.length})
          </button>
        </nav>
        
        {/* Global Toolbar Actions */}
        <div className="header-actions">
          <button className="btn btn-secondary" onClick={() => {
            navigate('/lists');
            setIsListModalOpen(true);
          }}>
            <FolderPlus size={16} />
            New List
          </button>
          <button className="btn btn-primary" onClick={() => {
            navigate('/');
            setIsMovieModalOpen(true);
          }}>
            <Plus size={16} />
            Add Movie
          </button>
          <button className="btn btn-danger-outline" style={{ padding: '0.5rem' }} onClick={handleLogout} title="Logout">
            <LogOut size={16} />
          </button>
        </div>
      </header>

      {/* Routes Switch Router for inner contents */}
      <Routes>
        <Route path="/" element={
          <Home 
            user={user}
            lists={lists}
            fetchUserLists={fetchUserLists}
            handleAddMovieToList={handleAddMovieToList}
            isMovieModalOpen={isMovieModalOpen}
            setIsMovieModalOpen={setIsMovieModalOpen}
          />
        } />
        <Route path="/lists" element={
          <MyLists 
            user={user}
            lists={lists}
            selectedList={selectedList}
            setSelectedList={setSelectedList}
            fetchUserLists={fetchUserLists}
            isListModalOpen={isListModalOpen}
            setIsListModalOpen={setIsListModalOpen}
            setActiveTab={(tab) => navigate(tab === 'home' ? '/' : '/lists')}
          />
        } />
        {/* Fallback back to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
