const mongoose = require('mongoose');

const UmkmSchema = new mongoose.Schema({
    namaUmkm: {
        type: String,
        required: [true, 'Nama UMKM harus diisi'],
        trim: true,
    },
    kategoriUmkm:{
        type: String,
        enum: ['Kuliner', 'Fashion', 'Kerajinan Tangan', 'Otomotif', 'Home & Living'],
        default: 'Kuliner',
    },
    gambarUmkm: {
        type: String,
        required: [true, 'Gambar UMKM harus diisi'],
    },
    deskripsiUmkm: {
        type: String,
        required: [true, 'Deskripsi UMKM harus diisi'],
    },
    suaraUmkm: {
        type: String,
        required: [true, 'Surat UMKM harus diisi'],
    },
    videoUmkm: {
        type: String,
        required: [true, 'Id link Youtube UMKM harus diisi'],
    },
    lokasiId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'LokasiUMKM',
        required: [true, 'Lokasi UMKM harus diisi']
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContactOwner',
        required: [true, 'Kontak Owner harus diisi']
    },
});

module.exports = mongoose.model('Umkm', UmkmSchema);
