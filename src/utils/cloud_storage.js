const cloudinary = require('cloudinary').v2;

// Configuración de Cloudinary
cloudinary.config({
    cloud_name: 'du1fmj8le', // Reemplaza con tu CLOUD_NAME
    api_key: '917552261766816',       // Reemplaza con tu API_KEY
    api_secret: 'TeLxdF72Dm7Ias-wQB-QDs20NyI'  // Reemplaza con tu API_SECRET
});

module.exports = async (file) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            {
                resource_type: 'auto', // Permite cualquier tipo de archivo
            },
            (error, result) => {
                if (error) {
                    console.error('Error al subir archivo a Cloudinary', error);
                    reject(error);
                } else {
                    resolve(result.secure_url);
                }
            }
        ).end(file.buffer);
    });
};