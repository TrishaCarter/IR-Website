const crypto = require('crypto');

const ALGORITHM = 'aes-256-gcm';
const IV_LENGTH = 12;
const SALT_LENGTH = 16;
const TAG_LENGTH = 16;
const KEY_LENGTH = 32;

function getEncryptionKey() {
    const envKey = process.env.SESSION_ENCRYPTION_KEY;
    if (!envKey) {
        const key = crypto.randomBytes(KEY_LENGTH);
        console.warn('WARNING: Using generated key:', key.toString('hex'));
        return key;
    }
    return Buffer.from(envKey, 'hex');
}

function encrypt(data) {
    const iv = crypto.randomBytes(IV_LENGTH);
    const salt = crypto.randomBytes(SALT_LENGTH);
    const key = getEncryptionKey();
    
    const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
    const encrypted = Buffer.concat([
        cipher.update(JSON.stringify(data), 'utf8'),
        cipher.final()
    ]);
    
    const tag = cipher.getAuthTag();
    const result = Buffer.concat([salt, iv, tag, encrypted]);
    
    return result.toString('base64');
}

module.exports = { encrypt };

