import mongoose from "mongoose";

const movieListSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    name: {
        type: String,
        required: true
    },

    movies: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Movie"
        }
    ],

    isPrivate: {
        type: Boolean,
        default: true
    }
});

const MovieList = mongoose.model("MovieList", movieListSchema);

export default MovieList;