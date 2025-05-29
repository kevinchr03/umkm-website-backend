const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const basename = path.basename(file.originalname, ext);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, basename + '-' + uniqueSuffix + ext);
  }
});

// File filter to accept only specific image/audio formats
function fileFilter(req, file, cb) {
  const allowedImageTypes = ["image/jpeg", "image/png", "image/jpg"];
  const allowedAudioTypes = ["audio/mpeg", "audio/mp3"];

  if (file.fieldname === "gambarUmkm") {
    if (allowedImageTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Format gambar harus .jpg, .jpeg, atau .png'));
    }
  } else if (file.fieldname === "suaraUmkm") {
    if (allowedAudioTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', 'Format suara harus .mp3'));
    }
  } else {
    cb(null, true);
  }
}

// Middleware to check if required files exist after multer
function checkFilesExist(req, res, next) {
  if (!req.files) {
    return res.status(400).json({ errors: [{ msg: "File gambarUmkm dan suaraUmkm harus diupload" }] });
  }
  if (!req.files.gambarUmkm || req.files.gambarUmkm.length === 0) {
    return res.status(400).json({ errors: [{ msg: "Gambar harus diisi" }] });
  }
  if (!req.files.suaraUmkm || req.files.suaraUmkm.length === 0) {
    return res.status(400).json({ errors: [{ msg: "Suara UMKM harus diisi" }] });
  }
  next();
}

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = {
  upload,
  checkFilesExist,
};
