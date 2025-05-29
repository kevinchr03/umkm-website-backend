// routes/umkmRoutes.js
const express = require("express");
const router = express.Router();
const {
  getAllUmkm,
  getUmkmById,
  createUmkm,
  updateUmkm,
  deleteUmkm,
  generateUmkmQrById,
} = require("../controller/UMKMController");

const { protect } = require("../middleware/auth");
const {
  umkmValidators,
  lokasiUmkmValidators,
  contactOwnerValidators,
} = require("../utils/validators");
const { handleValidationErrors } = require("../middleware/handleValidation");
const { apiLimiter } = require("../middleware/rateLimiter");

const { upload, checkFilesExist } = require('../middleware/handleMulter');

router.get("/", getAllUmkm);
router.get("/:id", getUmkmById);

// POST with multer
router.post(
  "/",
  [
    protect,
    upload.fields([
      { name: "gambarUmkm", maxCount: 1 },
      { name: "suaraUmkm", maxCount: 1 },
    ]),
    checkFilesExist,
    ...umkmValidators,
    ...lokasiUmkmValidators,
    ...contactOwnerValidators,
    handleValidationErrors,
  ],
  createUmkm
);

// PUT with multer
router.put(
  "/:id",
  [
    protect,
    upload.fields([
      { name: "gambarUmkm", maxCount: 1 },
      { name: "suaraUmkm", maxCount: 1 },
    ]),
    ...umkmValidators,
    ...lokasiUmkmValidators,
    ...contactOwnerValidators,
    handleValidationErrors,
  ],
  updateUmkm
);

router.delete("/:id", protect, deleteUmkm);

router.post("/generateqr/:id", protect, apiLimiter, generateUmkmQrById); 
router.get("/generateqr/:id", generateUmkmQrById);

module.exports = router;
