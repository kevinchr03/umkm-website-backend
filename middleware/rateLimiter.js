const rateLimit = require("express-rate-limit");

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 menit
  max: 100, // limit setiap IP ke 100 request per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "error",
    message: "Terlalu banyak request, coba lagi nanti",
  },
});

module.exports = {
    apiLimiter
}