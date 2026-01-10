const { cloudinary } = require('../config/cloudinary.config');

class FileService {
  constructor() {
    this.cloudinary = cloudinary;
  }

  // Upload file to Cloudinary
  async uploadFile(base64File, folder = 'zyron-semiconductors', fileName = null) {
    try {
      const uploadOptions = {
        folder,
        resource_type: 'auto',
        use_filename: false,
        unique_filename: true,
      };

      if (fileName) {
        uploadOptions.filename_override = fileName.replace(/\.[^/.]+$/, "");
      }

      const result = await this.cloudinary.uploader.upload(base64File, uploadOptions);
      return {
        url: result.secure_url,
        public_id: result.public_id,
        format: result.format,
        size: result.bytes,
      };
    } catch (error) {
      console.error('Error uploading file to Cloudinary:', error);
      throw error;
    }
  }

  // Delete file from Cloudinary
  async deleteFile(publicId) {
    try {
      const result = await this.cloudinary.uploader.destroy(publicId);
      return result;
    } catch (error) {
      console.error('Error deleting file from Cloudinary:', error);
      throw error;
    }
  }

  // Upload base64 string directly
  async uploadBase64(base64String, folder = 'zyron-semiconductors', fileName = null) {
    // Ensure the base64 string has the proper data URL format
    let formattedBase64 = base64String;
    if (!formattedBase64.startsWith('data:')) {
      // If it's just the base64 string without the data prefix, add it
      const mimeType = this.getMimeTypeFromBase64(formattedBase64);
      formattedBase64 = `data:${mimeType};base64,${formattedBase64}`;
    }

    return this.uploadFile(formattedBase64, folder, fileName);
  }

  // Helper to detect MIME type from base64 string
  getMimeTypeFromBase64(base64String) {
    // For now, we'll return a generic application/octet-stream
    // In a real implementation, you might want to detect the actual file type
    return 'application/octet-stream';
  }
}

module.exports = new FileService();