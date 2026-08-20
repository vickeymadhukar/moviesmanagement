import mongoose, { Schema } from "mongoose";

const movieSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  year: {
    type: Date,
    required: true,
  },
  genre: {
    type: [String],
    required: true,
  },
  poster: {
    type: String,
  },
});

const Movie = mongoose.model("Movie", movieSchema);

export default Movie;