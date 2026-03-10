const fileService = require('../services/file.service');

const uploadImage = async (req, res) => {
  try {
    const { dataUrl, folder, fileName } = req.body || {};

    if (!dataUrl) {
      return res.status(400).json({ success: false, message: 'Missing dataUrl' });
    }

    const result = await fileService.uploadBase64(dataUrl, folder || 'zyron-cms', fileName || null);
    return res.json({ success: true, data: result });
  } catch (error) {
    console.error('Upload error:', error);
    return res.status(500).json({ success: false, message: 'Upload failed' });
  }
};

module.exports = { uploadImage };
