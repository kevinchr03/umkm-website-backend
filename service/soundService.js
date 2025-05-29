const fs = require('fs');
const path = require('path');

const ensureAudioDir = (umkmId) => {
    const uploadsDir = path.join(__dirname, '..', 'public', 'audio', String(umkmId));
    if (!fs.existsSync(uploadsDir)){
        fs.mkdir(uploadsDir, { recursive: true})
    }
    return uploadsDir
}

const saveAudio = (fileBuffer, filename, umkmId) => {
    const audioDir = ensureAudioDir(umkmId);
    const filePath = path.join(audioDir, filename);
    fs.writeFileSync(filePath, fileBuffer)
    return `/audio/${umkmId}/${filename}`
}

module.exports = {
    saveAudio
}