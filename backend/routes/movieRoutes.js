import express from "express";
import {
  getMovies,
  addMovie,
  getLists,
  createList,
  deleteList,
  addMoviesTolist,
  removeMovieFromList
} from "../controllers/movieController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Global movie catalog routes
router.route('/')
  .get(getMovies)
  .post(protect, addMovie);

// Public route for movie card creation (used for load-testing/benchmarking)
router.post('/public-add', addMovie);

// Movie Lists routes
router.get('/lists', protect, getLists);
router.post("/list", protect, createList);
router.delete("/list/:id", protect, deleteList);

// Adding / Removing movies to/from lists
router.post("/list/addmovie", protect, addMoviesTolist);
router.post("/list/removemovie", protect, removeMovieFromList);

export default router;
