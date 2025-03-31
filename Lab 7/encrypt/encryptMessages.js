const crypto = require('crypto');
const fs = require('fs');

const SYM_ALGORITHM = 'aes-128-ctr';
const SYM_KEY_LEN = 16; 
const ASYM_HASH = 'sha256';
const ASYM_PAD = crypto.constants.RSA_PKCS1_OAEP_PADDING;

const PUBLIC_KEY_FILE = 'public_key.pem';
const PUBLIC_KEY = fs.readFileSync(PUBLIC_KEY_FILE);

function encrypt(text, key, iv) {
  let cipher = crypto.createCipheriv(SYM_ALGORITHM, key, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return encrypted.toString('base64');
}

function encryptPub(txt, publicKey) {
  const encryptedBuffer = crypto.publicEncrypt(
    {
      key: publicKey,
      padding: ASYM_PAD,
      oaepHash: ASYM_HASH,
    },
    Buffer.from(txt)
  );
  return encryptedBuffer.toString('base64');
}

const key = crypto.randomBytes(SYM_KEY_LEN);        
const iv = crypto.randomBytes(16);                 

let eKey = encryptPub(key, PUBLIC_KEY);
let eIV = encryptPub(iv, PUBLIC_KEY);

let phrases = [
  'hello world!!!!!',
  'whatever whatever',
  '?????????????!!!!!!!!',
  'this can be anything.... 😊😊😊'
];

let encryptedTxt = phrases.map(m => encrypt(m, key, iv));

const doc = {
  key: eKey,
  iv: eIV,
  data: encryptedTxt
};

fs.writeFileSync('msgs.json', JSON.stringify(doc, null, 2));
