import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import movieRoutes from './routes/movieRoutes.js';
import userRoutes from './routes/userRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

connectDB();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

app.use('/uploads', express.static(uploadDir));

app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Welcome to the Movie List API Server',
    status: 'Healthy',
    endpoints: {
      movies: '/api/movies',
    },
  });
});


app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/upload', uploadRoutes);

app.use((req, res, next) => {
  res.status(404).json({ message: `Not Found - ${req.originalUrl}` });
});

app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in development mode on port ${PORT}`);
});
