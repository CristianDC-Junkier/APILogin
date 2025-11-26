
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Carpeta final donde se guardan las imágenes
const uploadDir = path.join(__dirname, "../images/links/");

// Crear carpeta si no existe
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// Configurar Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const base = path.basename(file.originalname, ext);
        const uniqueName = `${Date.now()}-${base}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({ storage });

module.exports = upload;
