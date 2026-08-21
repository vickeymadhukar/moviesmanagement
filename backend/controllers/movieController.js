import MovieList from "../models/MovieList.js";
import Movie from "../models/movie.js";

// @desc    Get all movies (with optional search and filter)
// @route   GET /api/movies
// @access  Public
export const getMovies = async (req, res) => {
  try {
    const { search, genre, sort } = req.query;
    const page = Number(req.query.page) || 1;
    const limit = 6;
    const skip = (page - 1) * limit;
    let query = {};

    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    if (genre && genre !== 'All') {
      query.genre = { $regex: genre, $options: 'i' };
    }

    let apiQuery = Movie.find(query);

    if (sort === 'year') {
      apiQuery = apiQuery.sort({ year: -1 });
    } else if (sort === 'title') {
      apiQuery = apiQuery.sort({ title: 1 });
    } else {
      apiQuery = apiQuery.sort({ _id: -1 });
    }

    apiQuery = apiQuery.skip(skip).limit(limit);

    const movies = await apiQuery;
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add a new movie to global catalog
// @route   POST /api/movies
// @access  Private
export const addMovie = async (req, res) => {
  try {
    const { title, genre, year, poster } = req.body;

    if (!title || !genre || !year) {
      return res.status(400).json({ message: 'Title, genre, and year are required.' });
    }

    const newMovie = await Movie.create({
      title,
      genre,
      year,
      poster,
    });

    res.status(201).json(newMovie);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all movie lists for logged-in user
// @route   GET /api/movies/lists
// @access  Private
export const getLists = async (req, res) => {
  try {
    const lists = await MovieList.find({ userId: req.user.id }).populate('movies');
    res.status(200).json(lists);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching lists" });
  }
};

// @desc    Create a new movie list
// @route   POST /api/movies/list
// @access  Private
export const createList = async (req, res) => {
  try {
    const { lsitname, isprivate } = req.body;
    if (!lsitname) {
      return res.status(400).json({ message: "List name is required" });
    }
    const userId = req.user.id;
    const list = await MovieList.create({
      name: lsitname,
      isPrivate: isprivate !== undefined ? isprivate : true,
      userId: userId,
      movies: []
    });
    res.status(201).json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating list" });
  }
};

// @desc    Delete a movie list
// @route   DELETE /api/movies/list/:id
// @access  Private
export const deleteList = async (req, res) => {
  try {
    const list = await MovieList.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }
    
    // Check ownership
    if (list.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "User is not authorized" });
    }
    
    await list.deleteOne();
    res.status(200).json({ message: "List deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting list" });
  }
};

// @desc    Add a movie to a list
// @route   POST /api/movies/list/addmovie
// @access  Private
export const addMoviesTolist = async (req, res) => {
  try {
    const { listId, movieId } = req.body;

    if (!listId) {
      return res.status(400).json({ message: "List id is required" });
    }
    
    if (!movieId) {
      return res.status(400).json({ message: "Movie id is required" });
    }

    const list = await MovieList.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    if (list.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Check if movie already in list to avoid duplicates
    if (list.movies.includes(movieId)) {
      return res.status(400).json({ message: "Movie is already in this list" });
    }

    list.movies.push(movieId);
    await list.save();
    
    // Return the updated list populated with movies
    const updatedList = await MovieList.findById(listId).populate('movies');
    res.status(200).json(updatedList);      
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding movie to list" });
  }
};

// @desc    Remove a movie from a list
// @route   POST /api/movies/list/removemovie
// @access  Private
export const removeMovieFromList = async (req, res) => {
  try {
    const { listId, movieId } = req.body;

    if (!listId) {
      return res.status(400).json({ message: "List id is required" });
    }

    if (!movieId) {
      return res.status(400).json({ message: "Movie id is required" });
    }

    const list = await MovieList.findById(listId);
    if (!list) {
      return res.status(404).json({ message: "List not found" });
    }

    // Check if this list belongs to logged-in user
    if (list.userId.toString() !== req.user.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Remove movie from movies array
    list.movies.pull(movieId);
    await list.save();

    // Return the updated list populated with movies
    const updatedList = await MovieList.findById(listId).populate('movies');
    res.status(200).json(updatedList);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing movie from list" });
  }
};