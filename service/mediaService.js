const fs = require('fs');
const path = require('path');

const ensureImageDir = (umkmId) => {
    const uploadsDir = path.join(__dirname, '..', 'public', 'media', String(umkmId));
    if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
    }
    return uploadsDir;
}

const saveImage = (fileBuffer, filename, umkmId) => {
    const imageDir = ensureImageDir(umkmId);
    const filePath = path.join(imageDir, filename);
    fs.writeFileSync(filePath, fileBuffer);
    return `/media/${umkmId}/${filename}`;
}

const saveMultipleImages = (files, umkmId) => {
    return files.map(file =>
        saveImage(file.buffer, file.originalname, umkmId)
    );
}

module.exports = {
    saveImage,
    saveMultipleImages
};
