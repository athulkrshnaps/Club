import { Router } from 'express';
import { authorize, protect } from '../middleware/auth.js';
import { upload } from '../middleware/upload.js';

const router = Router();

router.post('/image', protect, authorize('admin'), upload.single('file'), (req, res) => {
  res.status(201).json({
    file: {
      filename: req.file.filename,
      url: `/uploads/${req.file.filename}`,
      mimetype: req.file.mimetype,
      size: req.file.size
    }
  });
});

export default router;
