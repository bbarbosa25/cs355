const crypto = require('crypto');
const fs = require('fs');

const PUBLIC_KEY_FILE = 'public_key.pem';
const PRIVATE_KEY_FILE = 'private_key.pem';

function generateAndSaveRSAKeys(publicKeyPath, privateKeyPath) {
  try {
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048, // Recommended: 2048 bits or higher
      publicKeyEncoding: {
        type: 'spki',
        format: 'pem',
      },
      privateKeyEncoding: {
        type: 'pkcs8',
        format: 'pem',
      },
    });

    fs.writeFileSync(publicKeyPath, publicKey);
    fs.writeFileSync(privateKeyPath, privateKey);
    console.log('RSA key pair generated and saved.');
  } catch (err) {
    console.error('Error generating RSA keys:', err);
  }
}

generateAndSaveRSAKeys(PUBLIC_KEY_FILE, PRIVATE_KEY_FILE);
