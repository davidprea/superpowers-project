const router = require('express').Router()
const multer = require('multer')
const { authenticate, requireRole } = require('../middleware/auth')
const { uploadImage, isAllowedImage } = require('../services/uploadService')

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 },
})

router.post(
  '/image',
  authenticate,
  requireRole('admin'),
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) return res.status(400).json({ error: 'No file uploaded' })
      if (!isAllowedImage(req.file.mimetype)) {
        return res.status(400).json({ error: 'Unsupported image type' })
      }
      const url = await uploadImage({
        buffer: req.file.buffer,
        mimetype: req.file.mimetype,
      })
      res.status(201).json({ url })
    } catch (err) {
      next(err)
    }
  }
)

module.exports = router
