import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import fs from 'fs';
import { config } from './config';
import routes from './routes';
import { errorHandler } from './middleware/errorHandler';

const app = express();

// Ensure uploads directory exists
const uploadPath = path.resolve(config.uploadDir);
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Security & utilities
app.use(helmet({ crossOriginResourcePolicy: false }));
app.use(cors({ origin: config.clientUrl, credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Static files
app.use('/uploads', express.static(uploadPath));

// API routes
app.use('/api/v1', routes);

// Centralized error handler
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`AutoMarket Server running on port ${config.port}`);
});

export default app;
