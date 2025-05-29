const Umkm = require("../models/Umkm");
const LokasiUMKM = require("../models/LokasiUMKM");
const ContactOwner = require("../models/ContactOwner");
const {
  successResponse,
  errorResponse,
} = require("../utils/responseFormatter");
const logger = require("../utils/logger");
const fs = require("fs");
const path = require("path");
const QRCode = require('qrcode');
const imageService = require("../service/mediaService");
const qrService = require("../service/qrService");

const getAllUmkm = async (req, res) => {
  try {
    const umkm = await Umkm.find()
      .populate("lokasiId")
      .populate("contactId");
    
    logger.info("Successfully fetched all UMKM data");
    return res
      .status(200)
      .json(successResponse("Data UMKM berhasil diambil", umkm));
  } catch (error) {
    logger.error(`Error in getAllUmkm: ${error.message}`);
    return res.status(500).json(errorResponse("Server error"));
  }
};

const getUmkmById = async (req, res) => {
  try {
    const { id } = req.params;
    const umkm = await Umkm.findById(id)
      .populate("lokasiId")
      .populate("contactId");

    if (!umkm) {
      return res.status(404).json(errorResponse("UMKM tidak ditemukan"));
    }

    logger.info(`Successfully fetched UMKM with ID: ${id}`);
    return res.status(200).json(successResponse("UMKM ditemukan", umkm));
  } catch (error) {
    logger.error(`Error in getUmkmById: ${error.message}`);

    if (error.kind === "ObjectId") {
      return res.status(404).json(errorResponse("UMKM tidak ditemukan"));
    }

    return res.status(500).json(errorResponse("Server error"));
  }
};

const createUmkm = async (req, res) => {
  try {
    const {
      namaUmkm,
      kategoriUmkm,
      deskripsiUmkm,
      videoUmkm,
      // lokasi and contact will be manually constructed below
    } = req.body;

    const files = req.files;

    // Base URL
    const baseUrl = process.env.BASE_URL || 'http://localhost:5001';

    // Build full public URLs if files exist
    const gambarUmkm = files?.gambarUmkm?.[0]
      ? `${baseUrl}/uploads/${files.gambarUmkm[0].filename}`
      : null;

    const suaraUmkm = files?.suaraUmkm?.[0]
      ? `${baseUrl}/uploads/${files.suaraUmkm[0].filename}`
      : null;

    // Construct lokasi object manually from form-data fields
    const lokasi = {
      alamat: req.body["lokasi.alamat"],
      latitude: parseFloat(req.body["lokasi.latitude"]),
      longitude: parseFloat(req.body["lokasi.longitude"]),
    };

    // Construct contact object manually
    const contact = {
      namaOwner: req.body["contact.namaOwner"],
      noTelp: req.body["contact.noTelp"],
    };

    // Save lokasi and contact
    const newLokasi = await LokasiUMKM.create(lokasi);
    const newContact = await ContactOwner.create(contact);

    // Create UMKM with full URLs
    const newUmkm = await Umkm.create({
      namaUmkm,
      kategoriUmkm,
      gambarUmkm,
      deskripsiUmkm,
      suaraUmkm,
      videoUmkm,
      lokasiId: newLokasi._id,
      contactId: newContact._id,
    });

    logger.info(`UMKM created successfully: ${newUmkm._id}`);

    return res
      .status(201)
      .json(successResponse("UMKM berhasil dibuat", newUmkm));
  } catch (error) {
    logger.error(`Error in createUmkm: ${error.message}`);
    return res.status(500).json(errorResponse("Server error"));
  }
};




const updateUmkm = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      namaUmkm,
      kategoriUmkm,
      deskripsiUmkm,
      lokasi: lokasiRaw,
      contact: contactRaw,
    } = req.body;

    // Parse lokasi and contact if they are JSON strings (because in multipart form, nested objects are sent as strings)
    const lokasi = typeof lokasiRaw === 'string' ? JSON.parse(lokasiRaw) : lokasiRaw;
    const contact = typeof contactRaw === 'string' ? JSON.parse(contactRaw) : contactRaw;

    const files = req.files;
    const gambarUmkm = files?.gambarUmkm?.[0]?.filename || null;
    const suaraUmkm = files?.suaraUmkm?.[0]?.filename || null;
    const videoUmkm = files?.videoUmkm?.[0]?.filename || null;

    const umkm = await Umkm.findById(id);
    if (!umkm) {
      return res.status(404).json(errorResponse("UMKM tidak ditemukan"));
    }

    const { alamat, latitude, longitude } = lokasi || {};
    const { namaOwner, noTelp } = contact || {};

    if (umkm.lokasiId) {
      await LokasiUMKM.findByIdAndUpdate(umkm.lokasiId, {
        alamat,
        latitude,
        longitude,
      });
    }

    if (umkm.contactId) {
      await ContactOwner.findByIdAndUpdate(umkm.contactId, {
        namaOwner,
        noTelp,
      });
    }

    if (namaUmkm) umkm.namaUmkm = namaUmkm;
    if (kategoriUmkm) umkm.kategoriUmkm = kategoriUmkm;
    if (deskripsiUmkm) umkm.deskripsiUmkm = deskripsiUmkm;
    if (gambarUmkm) umkm.gambarUmkm = gambarUmkm;
    if (suaraUmkm) umkm.suaraUmkm = suaraUmkm;
    if (videoUmkm) umkm.videoUmkm = videoUmkm;

    await umkm.save();

    logger.info(`UMKM updated successfully: ${id}`);
    return res.status(200).json(successResponse("UMKM berhasil diperbarui", umkm));
  } catch (error) {
    logger.error(`Error in updateUmkm: ${error.message}`);
    return res.status(500).json(errorResponse("Server error"));
  }
};

const deleteUmkm = async (req, res) => {
  try {
    const { id } = req.params;

    const umkm = await Umkm.findById(id);
    if (!umkm) {
      return res.status(404).json(errorResponse("UMKM tidak ditemukan"));
    }

    // Hapus data lokasi dan contact yang terkait
    await LokasiUMKM.findByIdAndDelete(umkm.lokasiId);
    await ContactOwner.findByIdAndDelete(umkm.contactId);

    // Hapus data UMKM
    await umkm.deleteOne();

    logger.info(`UMKM deleted successfully: ${id}`);
    return res.status(200).json(successResponse("UMKM berhasil dihapus"));
  } catch (error) {
    logger.error(`Error in deleteUmkm: ${error.message}`);
    return res.status(500).json(errorResponse("Server error"));
  }
};

const generateUmkmQrById = async (req, res) => {
  try {
    const { id } = req.params;

    const umkm = await Umkm.findById(id);
    if (!umkm) {
      return res.status(404).json(errorResponse("UMKM tidak ditemukan"));
    }

    // Use the qrService to generate QR code
    const qrCodePath = await qrService.generateQRbyId(umkm._id);

    logger.info(`QR Code generated for UMKM ID: ${id}`);
    return res.status(200).json(
      successResponse("QR Code berhasil dibuat dan disimpan", {
        qrCodeUrl: `https://suarakeliling.xyz${qrCodePath}`,
        // qrCodeUrl: `http://localhost:5001${qrCodePath}`,
        qrCodeFile: qrCodePath,
      })
    );
  } catch (error) {
    logger.error(`Error in generateUmkmQrById: ${error.message}`);
    return res.status(500).json(errorResponse("Server error"));
  }
};

module.exports = {
  getAllUmkm,
  getUmkmById,
  createUmkm,
  updateUmkm,
  deleteUmkm,
  generateUmkmQrById
};
