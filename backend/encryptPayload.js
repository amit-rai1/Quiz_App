const CryptoJS = require('crypto-js');

// Define the secret key (same as in your .env file)
const secretKey = '7utw7rhfs76r2wy27uy1rf';

// Define the payload to encrypt
const payload = {
  email: 'amit@gmail.com',
  password: 'admin@123',
};

// Encrypt the payload
const encryptedPayload = CryptoJS.AES.encrypt(JSON.stringify(payload), secretKey).toString();

console.log('Encrypted Payload:', encryptedPayload);