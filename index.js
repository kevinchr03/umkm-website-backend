const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const path = require("path");
const compression = require("compression");

dotenv.config();

const connectDB = require("./config/db");
const logger = require("./utils/logger");
const app = express();

app.use(express.json());
connectDB();

// Configure helmet with CORP disabled to prevent conflicts
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Disable default CORP header from helmet
  })
);

// Apply CORS once with your frontend origin
app.use(
  cors({
    origin: *,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(compression());

// Static file serving
app.use(express.static(path.join(__dirname, "public")));
app.use("/qrcodes", express.static(path.join(__dirname, "public", "qr")));

app.use(
  "/uploads",
  (req, res, next) => {
    res.setHeader("Cross-Origin-Resource-Policy", "cross-origin"); // Set permissive CORP for uploads
    next();
  },
  express.static(path.join(__dirname, "public/uploads"))
);

// Routes
const authRoutes = require("./routes/authRoutes");
const umkmRoutes = require("./routes/umkmRoutes");

app.get("/ping", (req, res) => {
  res.status(200).send("pong");
});

app.use("/auth", authRoutes);
app.use("/umkm", umkmRoutes);

const PORT = process.env.PORT || 3001;
const server = app.listen(PORT, () => {
  logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

process.on("unhandledRejection", (err) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

process.on("uncaughtException", (err) => {
  logger.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

module.exports = app;
