const mongoose = require('mongoose');

const LokasiUmkmSchema = new mongoose.Schema({
    alamat: {
        type: String,
        required: [true, 'Alamat harus diisi'],
        trim: true,
    },
    latitude: {
        type: String,
        required: [true, 'Latitude harus diisi'],
        trim: true,
    },
    longitude: {
        type: String,
        required: [true, 'Longitude harus diisi'],
        trim: true,
    },
})

module.exports = mongoose.model('LokasiUMKM', LokasiUmkmSchema);