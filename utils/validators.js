// validators/umkmValidators.js
const { check, body } = require("express-validator");
const path = require("path");

const umkmValidators = [
  check("namaUmkm")
    .notEmpty()
    .withMessage("Nama harus diisi")
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage("Nama harus antara 2 dan 100 karakter"),

  check("kategoriUmkm")
    .optional()
    .isIn([
      "Kuliner",
      "Fashion",
      "Kerajinan Tangan",
      "Otomotif",
      "Home & Living",
    ])
    .withMessage("Kategori tidak valid"),

  // Validate uploaded gambarUmkm file
  body("gambarUmkm").custom((value, { req }) => {
    if (!req.files || !req.files["gambarUmkm"]) {
      throw new Error("Gambar harus diisi");
    }

    const file = req.files["gambarUmkm"][0];
    const ext = path.extname(file.originalname).toLowerCase();
    if (![".jpg", ".jpeg", ".png"].includes(ext)) {
      throw new Error("Format gambar harus .jpg, .jpeg, atau .png");
    }

    return true;
  }),

  check("deskripsiUmkm")
    .notEmpty()
    .withMessage("Deskripsi harus diisi")
    .isLength({ min: 10 })
    .withMessage("Deskripsi minimal 10 karakter"),

  // Validate uploaded suaraUmkm file
  body("suaraUmkm").custom((value, { req }) => {
    if (!req.files || !req.files["suaraUmkm"]) {
      throw new Error("Suara UMKM harus diisi");
    }

    const file = req.files["suaraUmkm"][0];
    const ext = path.extname(file.originalname).toLowerCase();
    if (ext !== ".mp3") {
      throw new Error("Format suara harus .mp3");
    }

    return true;
  }),

  check("videoUmkm")
    .notEmpty()
    .withMessage("Youtube link id video harus diisi"),
];

const lokasiUmkmValidators = [
  check("lokasi.alamat")
    .notEmpty()
    .withMessage("Alamat harus diisi")
    .trim()
    .isLength({ min: 5 })
    .withMessage("Alamat harus memiliki minimal 5 karakter"),

  check("lokasi.latitude")
    .notEmpty()
    .withMessage("Latitude harus diisi")
    .trim()
    .isFloat({ min: -90, max: 90 })
    .withMessage("Latitude harus berupa angka antara -90 dan 90"),

  check("lokasi.longitude")
    .notEmpty()
    .withMessage("Longitude harus diisi")
    .trim()
    .isFloat({ min: -180, max: 180 })
    .withMessage("Longitude harus berupa angka antara -180 dan 180"),
];

const contactOwnerValidators = [
  check("contact.namaOwner")
    .notEmpty()
    .withMessage("Nama owner harus diisi")
    .trim()
    .isLength({ min: 2 })
    .withMessage("Nama owner minimal 2 karakter"),

  check("contact.noTelp")
    .notEmpty()
    .withMessage("Nomor telepon harus diisi")
    .trim()
    .matches(/^[0-9]{10,15}$/)
    .withMessage(
      "Nomor telepon harus berupa angka dan antara 10 sampai 15 digit"
    ),
];

module.exports = {
  umkmValidators,
  lokasiUmkmValidators,
  contactOwnerValidators,
};

const authValidators = {
  register: [
    check("name")
      .notEmpty()
      .withMessage("Nama harus diisi")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Nama harus minimal 2 karakter"),

    check("password")
      .notEmpty()
      .withMessage("Password harus diisi")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
  login: [
    check("name")
      .notEmpty()
      .withMessage("Nama harus diisi")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Nama harus minimal 2 karakter"),

    check("password")
      .notEmpty()
      .withMessage("Password harus diisi")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password minimal 6 karakter"),
  ],
};

module.exports = {
  umkmValidators,
  lokasiUmkmValidators,
  contactOwnerValidators,
  authValidators,
};
