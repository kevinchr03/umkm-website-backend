# Gunakan base image Node.js LTS (Long Term Support)
FROM node:18-alpine AS builder

# Set direktori kerja di dalam container
WORKDIR /usr/src/app

# Salin package.json dan package-lock.json (atau yarn.lock)
COPY package*.json ./

# Install dependensi
# Jika menggunakan npm:
RUN npm ci --only=production
# Jika menggunakan yarn:
# COPY yarn.lock ./
# RUN yarn install --production --frozen-lockfile

# Salin sisa kode aplikasi
COPY . .

# Port yang digunakan oleh aplikasi Anda (sesuaikan jika berbeda)
# Dari index.js, port diambil dari process.env.PORT atau default 5000
EXPOSE 5000

# Perintah untuk menjalankan aplikasi
CMD [ "node", "index.js" ]
