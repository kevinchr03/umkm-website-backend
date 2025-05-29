const QRCode = require('qrcode')
const path = require('path');
const fs = require('fs');
const logger = require('../utils/logger');

const ensureUploadsDir = () => {
    const uploadsDir = path.join(__dirname, '..', 'public', 'qr');
    if(!fs.existsSync(uploadsDir)){
        fs.mkdirSync(uploadsDir, { recursive: true});
    }
    return uploadsDir
}

const generateQRbyId = async (umkmId) => {
    try {
        const uploadsDir = ensureUploadsDir();
        const qrData = `https://suarakeliling.xyz/detail-umkm/${umkmId}`
        // const qrData = `https://localhost:5173/detail-umkm/${umkmId}`
        logger.info(`Saving QR to: ${uploadsDir}`)

        const fileName = `UMKM_Id${umkmId}.png`
        const filePath = path.join(uploadsDir, fileName);

        await QRCode.toFile(filePath, qrData, {
            errorCorrectionLevel: 'H',
            margin: 1,
            width: 300
        });

        return `/qrcodes/${fileName}`;
    }catch(error){
        logger.error(`Error generating QR: ${error.message}`);
        throw new Error('Gagal membuat QR Code')
    }
}

module.exports = {
    generateQRbyId
}