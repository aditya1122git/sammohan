import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import authRoutes from './routes/auth';
import masterRoutes from './routes/master';
import categoriesRoutes from './routes/categories';
import applicationRoutes from './routes/applications';
import reminderRoutes from './routes/reminders';
import reportRoutes from './routes/reports';
import settingsRoutes from './routes/settings';
import projectRoutes from './routes/projects';
import { uploadDir, verifyFileSignature, getEffectiveMaxUploadSizeMb, createUploader, cleanupAbandonedUploads } from './middleware/upload';
import { authenticateToken, AuthenticatedRequest, isTokenRevoked, requireDataEntryOrAdmin } from './middleware/auth';
import { connectDatabase, db } from './database/mongo';

const app = express();
const PORT = process.env.PORT || 5000;

console.log('🚀 Starting E-Sewa Tarapur Server...');
console.log('⚙️ Configuring middleware...');

// Security Hardening Headers
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  next();
});

// Middleware
app.use(cors());
app.use(express.json({ limit: '250mb' }));
app.use(express.urlencoded({ extended: true, limit: '250mb' }));

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// File Upload Route with authentication, RBAC, and magic byte signature verification
app.post('/api/upload', authenticateToken, requireDataEntryOrAdmin, async (req: AuthenticatedRequest, res: any) => {
  const maxMb = await getEffectiveMaxUploadSizeMb();
  const uploader = createUploader(maxMb);
  const uploadHandler = uploader.array('files', 10);

  uploadHandler(req, res, (err: any) => {
    if (err) {
      if (err instanceof multer.MulterError) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            error: `File size exceeds the maximum limit of ${maxMb} MB per file. Please upload smaller files.`
          });
        }
        return res.status(400).json({ error: `Upload error: ${err.message}` });
      }
      return res.status(400).json({ error: err.message || 'File upload failed' });
    }

    try {
      const files = req.files as Express.Multer.File[];
      if (!files || files.length === 0) {
        return res.status(400).json({ error: 'No files were uploaded.' });
      }

      const verifiedFiles: any[] = [];

      // Validate signatures / magic bytes for each file
      for (const file of files) {
        const ext = path.extname(file.originalname);
        const sigCheck = verifyFileSignature(file.path, ext);

        if (!sigCheck.valid) {
          // Immediately delete unsafe/invalid file from disk
          if (fs.existsSync(file.path)) {
            fs.unlinkSync(file.path);
          }
          return res.status(400).json({
            error: `Validation failed for file "${file.originalname}": ${sigCheck.reason}`
          });
        }

        verifiedFiles.push({
          originalName: file.originalname,
          filename: file.filename,
          size: file.size,
          mimetype: file.mimetype,
          url: `/api/documents/${file.filename}`
        });
      }

      res.json({ files: verifiedFiles });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal error processing uploaded files' });
    }
  });
});

// Secure Document Download - Restricted to Authorized Users with Revocation Check & Audit Trail
app.get('/api/documents/:filename', async (req: any, res) => {
  const filename = req.params.filename;
  if (!filename) {
    return res.status(400).json({ error: 'Filename is required' });
  }

  // Support either Authorization header or query param token for browser direct view
  const authHeader = req.headers['authorization'];
  let token = authHeader && authHeader.split(' ')[1];
  if (!token && req.query.token) {
    token = req.query.token as string;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication token required to access protected documents' });
  }

  if (isTokenRevoked(token)) {
    return res.status(401).json({ error: 'Token has been revoked upon logout' });
  }

  const jwt = require('jsonwebtoken');
  const { JWT_SECRET } = require('./middleware/auth');
  let decodedUser: any = null;
  try {
    decodedUser = jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return res.status(401).json({ error: 'Invalid or expired authentication token' });
  }

  const safeFilename = path.basename(filename);
  const filePath = path.join(uploadDir, safeFilename);

  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: 'Document not found' });
  }

  const ext = path.extname(safeFilename).toLowerCase();

  // Audit log attachment access
  await db.auditLog.create({
    data: {
      entityType: 'DOCUMENT',
      action: 'DOWNLOAD',
      details: `Attachment accessed: ${safeFilename}`,
      performedBy: decodedUser?.email || 'user',
      ipAddress: req.ip
    }
  }).catch(() => {});

  if (req.query.download === '1' || req.query.download === 'true') {
    return res.download(filePath, safeFilename);
  }

  const inlineExts = ['.pdf', '.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg', '.txt'];
  if (inlineExts.includes(ext)) {
    res.setHeader('Content-Disposition', `inline; filename="${safeFilename}"`);
  } else {
    res.setHeader('Content-Disposition', `attachment; filename="${safeFilename}"`);
  }

  res.sendFile(filePath);
});

// API Routes
console.log('🛣️ Setting up routes...');
app.use('/api/auth', authRoutes);
app.use('/api/master', masterRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/reminders', reminderRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/settings', settingsRoutes);

// Health check
app.get('/api/health', async (req, res) => {
  const maxMb = await getEffectiveMaxUploadSizeMb();
  res.json({
    status: 'ONLINE',
    system: 'Bihar Government — JanSetu Bihar Announcement & Project Tracking Dashboard',
    version: '2.0.0',
    maxUploadSizeMb: maxMb,
    timestamp: new Date().toISOString()
  });
});

// Serve frontend assets and build
const clientDistPath = path.resolve(__dirname, '../../frontend/dist');
const clientPublicPath = path.resolve(__dirname, '../../frontend/public');

if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDistPath, 'index.html'));
    }
  });
} else if (fs.existsSync(clientPublicPath)) {
  app.use(express.static(clientPublicPath));
}

async function startServer(): Promise<void> {
  console.log('🔗 Connecting to MongoDB...');
  await connectDatabase();

  const server = app.listen(PORT, () => {
    // MongoDB connection success above is the final normal startup message.
  });

  server.on('error', (error: NodeJS.ErrnoException) => {
    if (error.code === 'EADDRINUSE') {
      console.error(`❌ Port ${PORT} is already in use.`);
    } else {
      console.error('❌ Server startup failed:', error.message);
    }
    process.exit(1);
  });

// Configure server timeouts for large 200MB uploads (10 minutes)
server.timeout = 600000;
server.headersTimeout = 610000;
server.keepAliveTimeout = 65000;

// Periodic cleanup of abandoned temporary uploads every hour and on startup
cleanupAbandonedUploads();
setInterval(() => {
  cleanupAbandonedUploads();
}, 60 * 60 * 1000);

}

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});

