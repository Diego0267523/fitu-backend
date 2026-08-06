(const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// 🔥 Para análisis de imagen con LogMeal, usar memory storage para obtener buffer
const memoryStorage = multer.memoryStorage();

// 🔥 Para subida de archivos a Cloudinary (comida, historias), usar Cloudinary storage
// params como función: decide resource_type/allowed_formats según si el archivo es imagen o video
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => {
    const isVideo = file.mimetype.startsWith("video/");
    return {
      folder: "gym-app",
      resource_type: isVideo ? "video" : "image",
      allowed_formats: isVideo ? ["mp4", "mov", "webm"] : ["jpg", "png", "jpeg"]
    };
  }
});

// 🔥 Exportar middlewares para usar en rutas
module.exports = {
  uploadCloudinary: multer({ storage: cloudinaryStorage }),
  uploadMemory: multer({ storage: memoryStorage }),
};
