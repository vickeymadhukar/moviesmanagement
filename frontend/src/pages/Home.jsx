import React, { useState, useEffect } from 'react';
import { Film, Search, Calendar, ListPlus, Plus, X } from 'lucide-react';
import axios from 'axios';

const GENRES = ['All', 'Action', 'Adventure', 'Comedy', 'Drama', 'Sci-Fi', 'Thriller', 'Romance', 'Fantasy', 'Horror', 'Animation', 'Crime', 'Western', 'Mystery'];

export default function Home({ 
  user, 
  lists, 
  fetchUserLists, 
  handleAddMovieToList,
  isMovieModalOpen,
  setIsMovieModalOpen
}) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Local filter states
  const [search, setSearch] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [sortBy, setSortBy] = useState('newest');
  
  // Dropdown list toggles
  const [activeDropdownMovieId, setActiveDropdownMovieId] = useState(null);

  // New Movie Form
  const [newMovieForm, setNewMovieForm] = useState({
    title: '',
    genre: 'Action',
    additionalGenres: '',
    year: new Date().getFullYear() + '-01-01',
    poster: ''
  });

  const [imageFile, setImageFile] = useState(null);

  // Reset form and file when modal opens/closes
  useEffect(() => {
    if (!isMovieModalOpen) {
      setImageFile(null);
      setNewMovieForm({
        title: '',
        genre: 'Action',
        additionalGenres: '',
        year: new Date().getFullYear() + '-01-01',
        poster: ''
      });
    }
  }, [isMovieModalOpen]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/movies', {
        params: {
          search,
          genre: selectedGenre,
          sort: sortBy
        }
      });
      setMovies(response.data);
    } catch (err) {
      console.error("Error fetching movies catalog:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, [search, selectedGenre, sortBy]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewMovieForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveGlobalMovie = async (e) => {
    e.preventDefault();
    if (!newMovieForm.title.trim()) return;

    const genreArray = [newMovieForm.genre];
    if (newMovieForm.additionalGenres.trim()) {
      newMovieForm.additionalGenres
        .split(',')
        .map(g => g.trim())
        .filter(g => g.length > 0)
        .forEach(g => {
          if (!genreArray.includes(g)) {
            genreArray.push(g);
          }
        });
    }

    let finalPoster = newMovieForm.poster;

    if (imageFile) {
      const formData = new FormData();
      formData.append('image', imageFile);

      try {
        const uploadRes = await axios.post('/api/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${user.token}`
          }
        });
        finalPoster = uploadRes.data.imageUrl;
      } catch (uploadErr) {
        alert(uploadErr.response?.data?.message || uploadErr.message || 'Image upload failed');
        return;
      }
    }

    const payload = {
      title: newMovieForm.title,
      genre: genreArray,
      year: new Date(newMovieForm.year),
      poster: finalPoster
    };

    try {
      const response = await axios.post('/api/movies', payload, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });

      setIsMovieModalOpen(false);
      fetchMovies();
      alert('Movie successfully added to catalog!');
    } catch (err) {
      alert(err.response?.data?.message || err.message || 'Failed to add movie to catalog');
    }
  };

  return (
    <>
      {/* Dashboard Stats */}
      <section className="summary-grid">
        <div className="summary-card">
          <div className="summary-icon-wrapper icon-purple">
            <Film size={20} />
          </div>
          <div className="summary-info">
            <h3>Global Movies Catalog</h3>
            <p>{movies.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-wrapper icon-blue">
            <ListPlus size={20} />
          </div>
          <div className="summary-info">
            <h3>My Watchlists</h3>
            <p>{lists.length}</p>
          </div>
        </div>

        <div className="summary-card">
          <div className="summary-icon-wrapper icon-emerald">
            <Calendar size={20} />
          </div>
          <div className="summary-info">
            <h3>Catalog Years</h3>
            <p>{movies.length > 0 ? `${Math.min(...movies.map(m => new Date(m.year).getFullYear()))} - ${Math.max(...movies.map(m => new Date(m.year).getFullYear()))}` : 'N/A'}</p>
          </div>
        </div>
      </section>

      {/* Search & Filter Toolbar */}
      <section className="toolbar">
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input 
            type="text" 
            placeholder="Search catalog by title..." 
            className="search-input"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        
        <div className="filters-group">
          <select 
            className="select-input"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            {GENRES.map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>

          <select 
            className="select-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="newest">Recently Added</option>
            <option value="year">Release Year</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>
      </section>

      {/* Global Movie Grid */}
      <main>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '5rem 0' }}>
            <div style={{ width: '40px', height: '40px', border: '4px solid var(--border-color)', borderTopColor: 'var(--primary-color)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>Loading catalog...</p>
          </div>
        ) : movies.length === 0 ? (
          <div className="no-movies">
            <span className="no-movies-icon">🎬</span>
            <h3>No movies match your filters</h3>
            <p>Try resetting search text or add a new movie to the global catalog.</p>
            <button className="btn btn-primary" style={{ marginTop: '1.5rem' }} onClick={() => setIsMovieModalOpen(true)}>
              Create Custom Movie
            </button>
          </div>
        ) : (
          <div className="movies-grid">
            {movies.map((movie) => (
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

                  <div style={{ position: 'relative', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      style={{ width: '100%', justifyContent: 'center', fontSize: '0.85rem', padding: '0.5rem' }}
                      onClick={() => setActiveDropdownMovieId(activeDropdownMovieId === movie._id ? null : movie._id)}
                    >
                      <ListPlus size={15} />
                      Add to Watchlist
                    </button>

                    {activeDropdownMovieId === movie._id && (
                      <div style={{ position: 'absolute', bottom: '105%', left: 0, right: 0, background: 'var(--bg-surface-elevated)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', padding: '0.5rem', boxShadow: 'var(--shadow-lg)', zIndex: 10 }}>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '0.25rem 0.5rem', borderBottom: '1px solid var(--border-color)', marginBottom: '0.5rem' }}>Select Watchlist:</p>
                        {lists.length === 0 ? (
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'block', padding: '0.5rem' }}>No lists available. Create one first!</span>
                        ) : (
                          lists.map(l => (
                            <button 
                              key={l._id}
                              className="movie-btn-toggle"
                              style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '6px', textAlign: 'left', display: 'block' }}
                              onClick={() => {
                                handleAddMovieToList(l._id, movie._id);
                                setActiveDropdownMovieId(null);
                              }}
                            >
                              🍿 {l.name} {l.isPrivate ? '🔒' : '🌐'}
                            </button>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Modal: Add Custom Movie */}
      {isMovieModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Movie to Global Catalog</h2>
              <button className="modal-close" onClick={() => setIsMovieModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveGlobalMovie}>
              <div className="form-group">
                <label className="form-label">Movie Title</label>
                <input 
                  type="text" 
                  name="title"
                  required
                  placeholder="e.g. Inception"
                  className="form-input"
                  value={newMovieForm.title}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Primary Genre</label>
                  <select 
                    name="genre"
                    className="form-input"
                    value={newMovieForm.genre}
                    onChange={handleFormChange}
                  >
                    {GENRES.filter(g => g !== 'All').map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Release Date</label>
                  <input 
                    type="date" 
                    name="year"
                    required
                    className="form-input"
                    value={newMovieForm.year}
                    onChange={handleFormChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Additional Genres (comma-separated)</label>
                <input 
                  type="text" 
                  name="additionalGenres"
                  placeholder="e.g. Mystery, Thriller"
                  className="form-input"
                  value={newMovieForm.additionalGenres}
                  onChange={handleFormChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Poster Image URL</label>
                <input 
                  type="url" 
                  name="poster"
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                  value={newMovieForm.poster}
                  onChange={handleFormChange}
                  disabled={imageFile !== null}
                />
              </div>

              <div style={{ textAlign: 'center', margin: '0.5rem 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>— OR —</div>

              <div className="form-group">
                <label className="form-label">Upload Poster Image</label>
                <input 
                  key={imageFile ? 'loaded' : 'empty'}
                  type="file" 
                  accept="image/*"
                  className="form-input"
                  style={{ padding: '0.4rem' }}
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setImageFile(e.target.files[0]);
                    } else {
                      setImageFile(null);
                    }
                  }}
                />
                {imageFile && (
                  <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '0.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Selected: {imageFile.name}</span>
                    <button 
                      type="button" 
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}
                      onClick={() => setImageFile(null)}
                    >
                      Clear File
                    </button>
                  </div>
                )}
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setIsMovieModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Movie</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
