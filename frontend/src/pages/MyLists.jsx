import React, { useState } from 'react';
import { FolderHeart, FolderPlus, Trash2, Calendar, Film, X, ArrowRight } from 'lucide-react';
import axios from 'axios';

export default function MyLists({ 
  user, 
  lists, 
  selectedList, 
  setSelectedList, 
  fetchUserLists, 
  isListModalOpen, 
  setIsListModalOpen, 
  setActiveTab 
}) {
  const [listNameInput, setListNameInput] = useState('');
  const [listPrivateInput, setListPrivateInput] = useState(true);

  const handleCreateList = async (e) => {
    e.preventDefault();
    if (!listNameInput.trim()) return;

    try {
      const response = await axios.post('/api/movies/list', 
        {
          lsitname: listNameInput,
          isprivate: listPrivateInput
        },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      const newList = response.data;
      setListNameInput('');
      setIsListModalOpen(false);
      
      await fetchUserLists();
      setSelectedList(newList);
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to create watchlist');
    }
  };

  const handleDeleteList = async (listId) => {
    if (!confirm('Are you sure you want to delete this watchlist?')) return;
    try {
      await axios.delete(`/api/movies/list/${listId}`, {
        headers: { 'Authorization': `Bearer ${user.token}` }
      });

      setSelectedList(null);
      fetchUserLists();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to delete watchlist');
    }
  };

  const handleRemoveMovieFromList = async (listId, movieId) => {
    if (!confirm('Remove this movie from this watchlist?')) return;
    try {
      await axios.post('/api/movies/list/removemovie', 
        { listId, movieId },
        {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        }
      );

      fetchUserLists();
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to remove movie');
    }
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '2.5rem', marginTop: '1rem' }}>
      {/* Lists Sidebar */}
      <aside style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-color)', padding: '1.5rem', borderRadius: '20px', height: 'fit-content' }}>
        <h2 style={{ fontSize: '1.2rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FolderHeart size={18} className="icon-purple" />
          Watchlists
        </h2>

        <button 
          className="btn btn-secondary" 
          style={{ width: '100%', justifyContent: 'center', marginBottom: '1.5rem', borderStyle: 'dashed' }}
          onClick={() => setIsListModalOpen(true)}
        >
          <FolderPlus size={16} />
          New List
        </button>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {lists.length === 0 ? (
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1rem 0' }}>No lists created yet.</p>
          ) : (
            lists.map(l => (
              <button 
                key={l._id} 
                className={`btn ${selectedList?._id === l._id ? 'btn-primary' : 'btn-secondary'}`}
                style={{ width: '100%', justifyContent: 'space-between', padding: '0.75rem 1rem', boxShadow: 'none' }}
                onClick={() => setSelectedList(l)}
              >
                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {l.isPrivate ? '🔒' : '🌐'} {l.name}
                </span>
                <span style={{ fontSize: '0.75rem', background: 'rgba(0,0,0,0.2)', padding: '0.15rem 0.4rem', borderRadius: '10px' }}>
                  {l.movies?.length || 0}
                </span>
              </button>
            ))
          )}
        </div>
      </aside>

      {/* Current List Content */}
      <main>
        {selectedList ? (
          <div>
            {/* List Header */}
            <div style={{ display: 'flex', justifycontent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.75rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  🍿 {selectedList.name}
                  <span style={{ fontSize: '0.8rem', fontWeight: '500', background: 'rgba(255,255,255,0.06)', padding: '0.25rem 0.75rem', borderRadius: '20px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    {selectedList.isPrivate ? 'Private List 🔒' : 'Public List 🌐'}
                  </span>
                </h2>
              </div>

              <button className="btn btn-danger-outline" onClick={() => handleDeleteList(selectedList._id)}>
                <Trash2 size={16} />
                Delete List
              </button>
            </div>

            {/* List Movies Grid */}
            {(!selectedList.movies || selectedList.movies.length === 0) ? (
              <div className="no-movies" style={{ padding: '6rem 2rem' }}>
                <span className="no-movies-icon">🍿</span>
                <h3>This watchlist is empty</h3>
                <p style={{ marginTop: '0.5rem' }}>Go back to the catalog tab and click "Add to Watchlist" on any movie!</p>
                <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setActiveTab('home')}>
                  Browse Catalog
                  <ArrowRight size={16} />
                </button>
              </div>
            ) : (
              <div className="movies-grid">
                {selectedList.movies.map((movie) => (
                  <div className="movie-card" key={movie._id}>
                    <div className="movie-poster-area">
                      {movie.poster ? (
                        <img src={movie.poster} alt={movie.title} className="movie-poster-img" onError={(e) => e.target.style.display = 'none'} />
                      ) : null}
                      <div className="movie-poster-placeholder">
                        <Film size={40} strokeWidth={1} />
                        <span style={{ fontSize: '0.8rem' }}>{movie.genre[0]}</span>
                      </div>
                      <div style={{ position: 'absolute', top: '1rem', left: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                        {movie.genre.slice(0, 2).map((g, idx) => (
                          <span key={idx} className="movie-genre-badge" style={{ position: 'static' }}>{g}</span>
                        ))}
                      </div>
                    </div>

                    <div className="movie-body">
                      <div className="movie-meta-row">
                        <span className="movie-year">
                          <Calendar size={12} style={{ marginRight: '0.25rem', display: 'inline' }} />
                          {new Date(movie.year).getFullYear()}
                        </span>
                      </div>
                      <h3 className="movie-title" style={{ marginBottom: '1.5rem', flexGrow: 1 }}>{movie.title}</h3>
                      
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginBottom: '1.5rem' }}>
                        {movie.genre.map((g, idx) => (
                          <span key={idx} style={{ fontSize: '0.7rem', background: 'rgba(255,255,255,0.06)', padding: '0.15rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>{g}</span>
                        ))}
                      </div>

                      <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                        <button 
                          className="btn btn-danger-outline" 
                          style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                          onClick={() => handleRemoveMovieFromList(selectedList._id, movie._id)}
                        >
                          <X size={15} />
                          Remove from List
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="no-movies" style={{ padding: '6rem 2rem' }}>
            <span className="no-movies-icon">📂</span>
            <h3>No watchlist selected</h3>
            <p>Select a watchlist from the left sidebar or create a new one to get started.</p>
          </div>
        )}
      </main>

      {/* Modal: Create Watchlist */}
      {isListModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Create New Watchlist</h2>
              <button className="modal-close" onClick={() => setIsListModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateList}>
              <div className="form-group">
                <label className="form-label">Watchlist Name</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. My Sci-Fi Favorites"
                  className="form-input"
                  value={listNameInput}
                  onChange={(e) => setListNameInput(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginTop: '1.25rem' }}>
                <label className="form-checkbox-label">
                  <input 
                    type="checkbox" 
                    className="form-checkbox"
                    checked={listPrivateInput}
                    onChange={(e) => setListPrivateInput(e.target.checked)}
                  />
                  <span style={{ fontSize: '0.95rem' }}>Make this watchlist private (only visible to you)</span>
                </label>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsListModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create List</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
