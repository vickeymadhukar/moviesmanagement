import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Movie from './models/movie.js';

// Load env vars
dotenv.config();

const movies = [
  {
    title: "Inception",
    year: new Date("2010-07-16"),
    genre: ["Sci-Fi", "Action", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/o01vCoZNMj5f9Zg4egnwEsKzNis.jpg"
  },
  {
    title: "Interstellar",
    year: new Date("2014-11-07"),
    genre: ["Sci-Fi", "Adventure", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/gEU2QvHOm56YsQjOYzrjxQv265O.jpg"
  },
  {
    title: "The Dark Knight",
    year: new Date("2008-07-18"),
    genre: ["Action", "Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/qJ2tWw35IMCXyJDyR6u1efclPc7.jpg"
  },
  {
    title: "Pulp Fiction",
    year: new Date("1994-10-14"),
    genre: ["Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/d5iil4FJmyej0fUiA36jR6iRkWQ.jpg"
  },
  {
    title: "The Shawshank Redemption",
    year: new Date("1994-10-14"),
    genre: ["Drama"],
    poster: "https://image.tmdb.org/t/p/w500/9cqN02GgBlP17uDrj2v0RjQ44bZ.jpg"
  },
  {
    title: "The Godfather",
    year: new Date("1972-03-24"),
    genre: ["Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/3bhkrj6PjOqabNmjjN7NNnpaVQC.jpg"
  },
  {
    title: "Forrest Gump",
    year: new Date("1994-07-06"),
    genre: ["Drama", "Romance", "Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/arw2tEZvmz6wHrzHgoUKmJe16dC.jpg"
  },
  {
    title: "The Matrix",
    year: new Date("1999-03-31"),
    genre: ["Sci-Fi", "Action"],
    poster: "https://image.tmdb.org/t/p/w500/f89U3wLpqHYlm32Inq6c2OaZ0V9.jpg"
  },
  {
    title: "Gladiator",
    year: new Date("2000-05-05"),
    genre: ["Action", "Adventure", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/ty8hDCcc4TyJZgK625f0UX8gTYm.jpg"
  },
  {
    title: "Spirited Away",
    year: new Date("2001-07-20"),
    genre: ["Fantasy", "Animation", "Family"],
    poster: "https://image.tmdb.org/t/p/w500/393mh1e0pt6J6Ri6757ksu4pYcz.jpg"
  },
  {
    title: "Avengers: Endgame",
    year: new Date("2019-04-26"),
    genre: ["Action", "Sci-Fi", "Adventure"],
    poster: "https://image.tmdb.org/t/p/w500/or06gUrnXYwqgI6M8vR4uNEj7Ju.jpg"
  },
  {
    title: "Titanic",
    year: new Date("1997-12-19"),
    genre: ["Drama", "Romance"],
    poster: "https://image.tmdb.org/t/p/w500/9xj724H1rmmq5zXe0I7TCyv14o5.jpg"
  },
  {
    title: "Parasite",
    year: new Date("2019-05-30"),
    genre: ["Drama", "Thriller", "Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/7IiTTjFWZBsr24aaDNED4YbsStA.jpg"
  },
  {
    title: "Whiplash",
    year: new Date("2014-10-10"),
    genre: ["Drama", "Music"],
    poster: "https://image.tmdb.org/t/p/w500/712R6W1nTy6t61jBE5qn6U86Zzc.jpg"
  },
  {
    title: "Spider-Man: Into the Spider-Verse",
    year: new Date("2018-12-14"),
    genre: ["Action", "Adventure", "Animation"],
    poster: "https://image.tmdb.org/t/p/w500/iiIK6w2ty2wPx756Kfw9LifH83Z.jpg"
  },
  {
    title: "Django Unchained",
    year: new Date("2012-12-25"),
    genre: ["Drama", "Western"],
    poster: "https://image.tmdb.org/t/p/w500/7oWYwz1j7jsu76u5155y6q65580.jpg"
  },
  {
    title: "The Lion King",
    year: new Date("1994-06-24"),
    genre: ["Animation", "Adventure", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/sKCr78MXSLHwm4EXA42VzdR1CHg.jpg"
  },
  {
    title: "Star Wars: A New Hope",
    year: new Date("1977-05-25"),
    genre: ["Sci-Fi", "Adventure", "Fantasy"],
    poster: "https://image.tmdb.org/t/p/w500/6Ff43eCnsfeWrxO5RjsNKBq5Z3f.jpg"
  },
  {
    title: "Jurassic Park",
    year: new Date("1993-06-11"),
    genre: ["Sci-Fi", "Adventure", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/b1xCNnyrPebUG5lz868R67bEEo1.jpg"
  },
  {
    title: "Avatar",
    year: new Date("2009-12-18"),
    genre: ["Sci-Fi", "Action", "Adventure"],
    poster: "https://image.tmdb.org/t/p/w500/kyeqWzo2vqvg2ys2UN1EH2B6XW1.jpg"
  },
  {
    title: "The Lord of the Rings: The Fellowship of the Ring",
    year: new Date("2001-12-19"),
    genre: ["Fantasy", "Adventure", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/6oom5Q481666qjys26O6bbjN562.jpg"
  },
  {
    title: "Casablanca",
    year: new Date("1943-01-23"),
    genre: ["Drama", "Romance", "War"],
    poster: "https://image.tmdb.org/t/p/w500/5lo65x826sV24j2T525W24J62Yt.jpg"
  },
  {
    title: "The Silence of the Lambs",
    year: new Date("1991-02-14"),
    genre: ["Crime", "Thriller", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/uS1Skj2nQv595gU75824BFqBOQX.jpg"
  },
  {
    title: "Fight Club",
    year: new Date("1999-10-15"),
    genre: ["Drama", "Thriller"],
    poster: "https://image.tmdb.org/t/p/w500/pB8N25vVW2u10JWZrVXP6SRJzw5.jpg"
  },
  {
    title: "Se7en",
    year: new Date("1995-09-22"),
    genre: ["Crime", "Thriller", "Mystery"],
    poster: "https://image.tmdb.org/t/p/w500/69Gyp1Srz8xd66LrmcE5X0aUmcw.jpg"
  },
  {
    title: "Goodfellas",
    year: new Date("1990-09-21"),
    genre: ["Crime", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/aKuFiTYKU2EPn6adSqJNsxHQUrI.jpg"
  },
  {
    title: "The Departed",
    year: new Date("2006-10-06"),
    genre: ["Crime", "Thriller", "Drama"],
    poster: "https://image.tmdb.org/t/p/w500/nT97ifVT2J14qHQ8DMbgJjXHYuH.jpg"
  },
  {
    title: "Up",
    year: new Date("2009-05-29"),
    genre: ["Animation", "Adventure", "Comedy"],
    poster: "https://image.tmdb.org/t/p/w500/vp6741fU2YWgnx5qV55x14JU7E8.jpg"
  },
  {
    title: "Psycho",
    year: new Date("1960-09-08"),
    genre: ["Horror", "Thriller", "Mystery"],
    poster: "https://image.tmdb.org/t/p/w500/81dxdpw49Q9BrI74z4n38JaJ5jV.jpg"
  },
  {
    title: "WALL-E",
    year: new Date("2008-06-27"),
    genre: ["Animation", "Sci-Fi", "Adventure"],
    poster: "https://image.tmdb.org/t/p/w500/h77gZ7v8P0c2E27R5xZq8G48Ym.jpg"
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://localhost:27017/moviesdb";
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri);
    
    // Clear existing movies
    await Movie.deleteMany({});
    console.log("Cleared existing movies in DB.");
    
    // Insert new list
    await Movie.insertMany(movies);
    console.log(`Successfully seeded ${movies.length} movies into local DB!`);
    
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error seeding database: ${error.message}`);
    process.exit(1);
  }
};

seedDatabase();
