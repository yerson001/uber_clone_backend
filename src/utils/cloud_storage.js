const { v2: cloudinary } = require('cloudinary');
const config = require('dotenv').config();

class CloudinaryService {
  constructor(configService) {
    cloudinary.config({
      cloud_name: config.CLOUDINARY_CLOUD_NAME,
      api_key: config.CLOUDINARY_API_KEY,
      api_secret: config.CLOUDINARY_API_SECRET,
    });
  }

  uploadFile(file) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary', error);
            reject(error);
          } else {
            resolve(result.secure_url);
          }
        }
      ).end(file.buffer);
    });
  }
}

module.exports = CloudinaryService;
