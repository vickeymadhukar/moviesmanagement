import express from 'express';
import multer from 'multer';
import path from 'path';
import { S3Client } from '@aws-sdk/client-s3';
import multerS3 from 'multer-s3';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Check if AWS S3 environment variables are defined
const isS3Configured = !!(
  process.env.AWS_ACCESS_KEY_ID &&
  process.env.AWS_SECRET_ACCESS_KEY &&
  process.env.AWS_BUCKET_NAME
);

let storage;

if (isS3Configured) {
  console.log('AWS S3 upload mode enabled.');
  const s3 = new S3Client({
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
    region: process.env.AWS_REGION || 'us-east-1',
  });

  storage = multerS3({
    s3: s3,
    bucket: process.env.AWS_BUCKET_NAME,
    acl: 'public-read', // Automatically grant public read permissions to uploaded poster files
    contentType: multerS3.AUTO_CONTENT_TYPE, // Set the S3 object's Content-Type automatically
    metadata(req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
} else {
  console.log('AWS S3 credentials not found. Falling back to Local Disk Upload mode.');
  storage = multer.diskStorage({
    destination(req, file, cb) {
      cb(null, 'uploads/');
    },
    filename(req, file, cb) {
      cb(
        null,
        `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      );
    },
  });
}

// File validation filter
function fileFilter(req, file, cb) {
  const filetypes = /jpe?g|png|webp/;
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/;

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = mimetypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, webp allowed)!'), false);
  }
}

// Multer upload middleware
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB file size
});

// @desc    Upload an image (to S3 or local fallback)
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  // If using S3, req.file.location contains the S3 public URL.
  // Otherwise, use the local path.
  const imageUrl = isS3Configured ? req.file.location : `/uploads/${req.file.filename}`;

  res.status(200).json({
    message: 'Image uploaded successfully',
    imageUrl,
  });
});

export default router;
