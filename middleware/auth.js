const jwt = require("jsonwebtoken");
const { errorResponse } = require("../utils/responseFormatter");

const protect = (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = decoded;
      return next();
    } catch (error) {
      return res.status(401).json(errorResponse("Token tidak valid"));
    }
  } else {
    return res.status(401).json(errorResponse("Token tidak ditemukan"));
  }
};



module.exports = { protect}
