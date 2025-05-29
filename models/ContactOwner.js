const mongoose = require('mongoose');

const ContactOwnerSchema = new mongoose.Schema({
    namaOwner: {
        type: String,
        required: [true, 'Nama owner harus diisi'],
        trim: true,
    },
    noTelp: {
        type: String,
        required: [true, 'Nomor telepon harus diisi'],
        trim: true,
    },
})

module.exports = mongoose.model('ContactOwner', ContactOwnerSchema);