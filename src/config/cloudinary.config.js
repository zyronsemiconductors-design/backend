const cloudinary = require('cloudinary').v2;
const { CLOUDINARY_URL } = require('./env');

// Parse the Cloudinary URL
const parseCloudinaryUrl = (url) => {
  const match = url.match(/cloudinary:\/\/([^:]+):([^@]+)@(.+)/);
  if (!match) {
    throw new Error('Invalid Cloudinary URL format');
  }
  
  const [_, apiKey, apiSecret, cloudName] = match;
  return { apiKey, apiSecret, cloudName };
};

const { apiKey, apiSecret, cloudName } = parseCloudinaryUrl(CLOUDINARY_URL);

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

module.exports = { cloudinary };