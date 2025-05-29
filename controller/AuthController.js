const User = require("../models/User");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");
const logger = require("../utils/logger");

const registerUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    const userExists = await User.findOne({ name });

    if (userExists) {
      return res.status(400).json(errorResponse("User sudah terdaftar"));
    }

    const user = await User.create({
      name,
      password,
    });

    return res.status(201).json(
      successResponse("User berhasil didaftarkan", {
        _id: user._id,
        name: user.name,
      })
    );
  } catch (error) {
    logger.error(`Error in registerUser: ${error.message}`);
    return res.status(500).json(errorResponse("Internal Server Error"));
  }
};

const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (!name || !password) {
      return res
        .status(400)
        .json(errorResponse("Nama dan kata sandi harus diisi"));
    }

    const user = await User.findOne({ name }).select("+password");

    if (!user) {
      return res.status(401).json(errorResponse("Nama atau kata sandi salah"));
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json(errorResponse("Nama atau kata sandi salah"));
    }

    user.lastLogin = Date.now();
    await user.save({ validateBeforeSave: false });

    const token = user.getSignedJwtToken();

    return res.status(200).json(
      successResponse("Login berhasil", {
        user: {
          id: user._id,
          name: user.name,
        },
        token,
      })
    );
  } catch (error) {
    logger.error(`Error in loginUser: ${error.message}`);
    return res.status(500).json(errorResponse("Internal Server Error"));
  }
};

const logoutUser = async (req, res) => {
  try {
    const { id } = req.params; 
    const user = await User.findById(id);

    if(!user){
      return res.status(404).json(errorResponse("User tidak ditemukan"));
    }

    user.loggedOutAt = Date.now();
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(successResponse("Log out berhasil", null))
  } catch (error) {
    logger.error(`Error in logoutUser: $(error.message)`);
    return res.status(500).json(errorResponse("Internal Server Error"));
  }
};

module.exports = {
  registerUser,
  loginUser,
  logoutUser,
};
