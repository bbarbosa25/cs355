const crypto = require('crypto');
const fs = require('fs');

const PRIVATE_KEY_FILE = 'private_key.pem';
const PRIVATE_KEY = fs.readFileSync(PRIVATE_KEY_FILE);

const SYM_ALGORITHM = 'aes-128-ctr';
const ASYM_HASH = 'sha256';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

// Decrypt symmetric text using key and IV
function decrypt(text, key, iv) {
  let encryptedText = Buffer.from(text, 'base64');
  let decipher = crypto.createDecipheriv(SYM_ALGORITHM, key, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// Decrypt base64 encrypted data using private key
function decryptPriv(encryptedB64, privateKey) {
  const decryptedBuffer = crypto.privateDecrypt(
    {
      key: privateKey,
      padding: ASYM_PAD,
      oaepHash: ASYM_HASH,
    },
    Buffer.from(encryptedB64, 'base64')
  );
  return decryptedBuffer;
}

// Load encrypted file
const messageFile = 'msgs.json';
const doc = JSON.parse(fs.readFileSync(messageFile));

// Decrypt key and iv using private key
let key = decryptPriv(doc.key, PRIVATE_KEY);
let iv = decryptPriv(doc.iv, PRIVATE_KEY);

// Decrypt and print each message
console.log('Decrypted:');
for (let txt of doc.data) {
  console.log(decrypt(txt, key, iv));
}
