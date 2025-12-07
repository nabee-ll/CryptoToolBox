import { Algorithm } from '../types';
import { encryptionLimiter, decryptionLimiter, keyGenLimiter, sanitizeInput } from '../utils/security';

// Helper to encode/decode
const enc = new TextEncoder();
const dec = new TextDecoder();

// Convert ArrayBuffer to Base64
const bufferToBase64 = (buffer: ArrayBuffer): string => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
};

// Convert Base64 to ArrayBuffer
const base64ToBuffer = (base64: string): ArrayBuffer => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// --- SHA256 ---
export const hashSHA256 = async (text: string): Promise<string> => {
  if (!text || text.trim().length === 0) {
    throw new Error('Input text cannot be empty');
  }
  const data = enc.encode(text);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
};

// --- AES-GCM (Password Based) ---
const getPasswordKey = (password: string) =>
  window.crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveKey']);

const deriveKey = (passwordKey: CryptoKey, salt: Uint8Array, keyUsage: ['encrypt'] | ['decrypt']) =>
  window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt,
      iterations: 600000,
      hash: 'SHA-256',
    },
    passwordKey,
    { name: 'AES-GCM', length: 256 },
    false,
    keyUsage
  );

export const encryptAES = async (text: string, password: string): Promise<string> => {
  try {
    // Input validation
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    // Sanitize inputs
    const sanitizedText = sanitizeInput(text);
    
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, salt, ['encrypt']);
    
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      aesKey,
      enc.encode(sanitizedText)
    );

    // Format: salt(base64):iv(base64):ciphertext(base64)
    return `${bufferToBase64(salt.buffer)}:${bufferToBase64(iv.buffer)}:${bufferToBase64(encryptedContent)}`;
  } catch (e) {
    throw new Error('Encryption failed');
  }
};

export const decryptAES = async (cipherTextCombined: string, password: string): Promise<string> => {
  try {
    // Input validation
    if (!cipherTextCombined || cipherTextCombined.trim().length === 0) {
      throw new Error('Cipher text cannot be empty');
    }
    if (!password || password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    const parts = cipherTextCombined.split(':');
    if (parts.length !== 3) throw new Error('Invalid cipher format');
    
    const salt = base64ToBuffer(parts[0]);
    const iv = base64ToBuffer(parts[1]);
    const encryptedData = base64ToBuffer(parts[2]);

    const passwordKey = await getPasswordKey(password);
    const aesKey = await deriveKey(passwordKey, new Uint8Array(salt), ['decrypt']);

    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      aesKey,
      encryptedData
    );

    return dec.decode(decryptedContent);
  } catch (e) {
    throw new Error('Decryption failed. Wrong key or corrupted data.');
  }
};

// --- RSA-OAEP ---
export const generateRSAKeyPair = async () => {
  // Rate limiting for key generation
  if (!keyGenLimiter.check('rsa')) {
    const remainingTime = Math.ceil(keyGenLimiter.getRemainingTime('rsa') / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${remainingTime} seconds before generating more keys.`);
  }
  
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'RSA-OAEP',
      modulusLength: 4096,
      publicExponent: new Uint8Array([1, 0, 1]),
      hash: 'SHA-256',
    },
    true,
    ['encrypt', 'decrypt']
  );

  const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${bufferToBase64(publicKeyBuffer)}\n-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN PRIVATE KEY-----\n${bufferToBase64(privateKeyBuffer)}\n-----END PRIVATE KEY-----`,
  };
};

const importRSAPublicKey = async (pem: string) => {
  const pemHeader = '-----BEGIN PUBLIC KEY-----';
  const pemFooter = '-----END PUBLIC KEY-----';
  
  // Validate PEM format
  if (!pem || typeof pem !== 'string') {
    throw new Error('Invalid key: must be a non-empty string');
  }
  if (!pem.includes(pemHeader) || !pem.includes(pemFooter)) {
    throw new Error('Invalid PEM format: missing headers or footers');
  }
  
  const pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.indexOf(pemFooter)).trim();
  if (!pemContents) {
    throw new Error('Invalid PEM format: empty key content');
  }
  
  const binaryDer = base64ToBuffer(pemContents);
  return window.crypto.subtle.importKey(
    'spki',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['encrypt']
  );
};

const importRSAPrivateKey = async (pem: string) => {
  const pemHeader = '-----BEGIN PRIVATE KEY-----';
  const pemFooter = '-----END PRIVATE KEY-----';
  
  // Validate PEM format
  if (!pem || typeof pem !== 'string') {
    throw new Error('Invalid key: must be a non-empty string');
  }
  if (!pem.includes(pemHeader) || !pem.includes(pemFooter)) {
    throw new Error('Invalid PEM format: missing headers or footers');
  }
  
  const pemContents = pem.substring(pem.indexOf(pemHeader) + pemHeader.length, pem.indexOf(pemFooter)).trim();
  if (!pemContents) {
    throw new Error('Invalid PEM format: empty key content');
  }
  
  const binaryDer = base64ToBuffer(pemContents);
  return window.crypto.subtle.importKey(
    'pkcs8',
    binaryDer,
    { name: 'RSA-OAEP', hash: 'SHA-256' },
    false,
    ['decrypt']
  );
};

export const encryptRSA = async (text: string, publicKeyPem: string): Promise<string> => {
  try {
    // Input validation
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }
    // RSA-OAEP with 4096-bit key can encrypt max ~446 bytes
    if (text.length > 446) {
      throw new Error('RSA-OAEP can encrypt max ~446 bytes. Use AES for larger data.');
    }
    
    const key = await importRSAPublicKey(publicKeyPem);
    const encrypted = await window.crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      key,
      enc.encode(text)
    );
    return bufferToBase64(encrypted);
  } catch (e: any) {
    throw new Error(e.message || 'RSA Encryption failed. Check public key format.');
  }
};

export const decryptRSA = async (cipherTextBase64: string, privateKeyPem: string): Promise<string> => {
  try {
    // Input validation
    if (!cipherTextBase64 || cipherTextBase64.trim().length === 0) {
      throw new Error('Cipher text cannot be empty');
    }
    
    const key = await importRSAPrivateKey(privateKeyPem);
    const decrypted = await window.crypto.subtle.decrypt(
      { name: 'RSA-OAEP' },
      key,
      base64ToBuffer(cipherTextBase64)
    );
    return dec.decode(decrypted);
  } catch (e: any) {
    throw new Error(e.message || 'RSA Decryption failed. Check private key.');
  }
};

// --- ECC (ECIES - Elliptic Curve Integrated Encryption Scheme) ---
// Using P-256 curve for shared secret derivation + AES-GCM for content encryption

export const generateECCKeyPair = async () => {
  // Rate limiting for key generation
  if (!keyGenLimiter.check('ecc')) {
    const remainingTime = Math.ceil(keyGenLimiter.getRemainingTime('ecc') / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${remainingTime} seconds before generating more keys.`);
  }
  
  const keyPair = await window.crypto.subtle.generateKey(
    {
      name: 'ECDH',
      namedCurve: 'P-256',
    },
    true,
    ['deriveKey', 'deriveBits']
  );

  const publicKeyBuffer = await window.crypto.subtle.exportKey('spki', keyPair.publicKey);
  const privateKeyBuffer = await window.crypto.subtle.exportKey('pkcs8', keyPair.privateKey);

  return {
    publicKey: `-----BEGIN PUBLIC KEY-----\n${bufferToBase64(publicKeyBuffer)}\n-----END PUBLIC KEY-----`,
    privateKey: `-----BEGIN PRIVATE KEY-----\n${bufferToBase64(privateKeyBuffer)}\n-----END PRIVATE KEY-----`,
  };
};

const importECCKey = async (pem: string, type: 'public' | 'private') => {
  const header = type === 'public' ? '-----BEGIN PUBLIC KEY-----' : '-----BEGIN PRIVATE KEY-----';
  const footer = type === 'public' ? '-----END PUBLIC KEY-----' : '-----END PRIVATE KEY-----';
  
  // Validate PEM format
  if (!pem || typeof pem !== 'string') {
    throw new Error('Invalid key: must be a non-empty string');
  }
  if (!pem.includes(header) || !pem.includes(footer)) {
    throw new Error('Invalid PEM format: missing headers or footers');
  }
  
  const contents = pem.substring(pem.indexOf(header) + header.length, pem.indexOf(footer)).trim();
  if (!contents) {
    throw new Error('Invalid PEM format: empty key content');
  }
  
  const binaryDer = base64ToBuffer(contents);
  
  return window.crypto.subtle.importKey(
    type === 'public' ? 'spki' : 'pkcs8',
    binaryDer,
    { name: 'ECDH', namedCurve: 'P-256' },
    false,
    type === 'public' ? [] : ['deriveKey']
  );
};

export const encryptECC = async (text: string, recipientPublicKeyPem: string): Promise<string> => {
  try {
    // Input validation
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }
    
    // 1. Import Recipient Public Key
    const recipientPubKey = await importECCKey(recipientPublicKeyPem, 'public');

    // 2. Generate Ephemeral Key Pair
    const ephemeralKeyPair = await window.crypto.subtle.generateKey(
      { name: 'ECDH', namedCurve: 'P-256' },
      true,
      ['deriveKey']
    );

    // 3. Derive Shared Secret (AES Key)
    const sharedAesKey = await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: recipientPubKey },
      ephemeralKeyPair.privateKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['encrypt']
    );

    // 4. Encrypt Content
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encryptedContent = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      sharedAesKey,
      enc.encode(text)
    );

    // 5. Export Ephemeral Public Key to attach to message
    const ephemeralPubRaw = await window.crypto.subtle.exportKey('spki', ephemeralKeyPair.publicKey);

    // Format: EphemeralPubKey(Base64) : IV(Base64) : Ciphertext(Base64)
    return `${bufferToBase64(ephemeralPubRaw)}:${bufferToBase64(iv.buffer)}:${bufferToBase64(encryptedContent)}`;

  } catch (e: any) {
    console.error(e);
    throw new Error(e.message || 'ECC Encryption failed. Ensure key is P-256 format.');
  }
};

export const decryptECC = async (payload: string, recipientPrivateKeyPem: string): Promise<string> => {
  try {
    // Input validation
    if (!payload || payload.trim().length === 0) {
      throw new Error('Cipher text cannot be empty');
    }
    
    const parts = payload.split(':');
    if (parts.length !== 3) throw new Error('Invalid ECC cipher format');

    const ephemeralPubBuffer = base64ToBuffer(parts[0]);
    const iv = base64ToBuffer(parts[1]);
    const encryptedData = base64ToBuffer(parts[2]);

    // 1. Import Keys
    const recipientPrivKey = await importECCKey(recipientPrivateKeyPem, 'private');
    const ephemeralPubKey = await window.crypto.subtle.importKey(
      'spki',
      ephemeralPubBuffer,
      { name: 'ECDH', namedCurve: 'P-256' },
      false,
      []
    );

    // 2. Derive Shared Secret
    const sharedAesKey = await window.crypto.subtle.deriveKey(
      { name: 'ECDH', public: ephemeralPubKey },
      recipientPrivKey,
      { name: 'AES-GCM', length: 256 },
      false,
      ['decrypt']
    );

    // 3. Decrypt
    const decryptedContent = await window.crypto.subtle.decrypt(
      { name: 'AES-GCM', iv: new Uint8Array(iv) },
      sharedAesKey,
      encryptedData
    );

    return dec.decode(decryptedContent);
  } catch (e: any) {
    console.error(e);
    throw new Error(e.message || 'ECC Decryption failed. Wrong key or corrupted data.');
  }
};


// --- Base64 ---
// WARNING: Base64 is NOT encryption - it's just encoding!
export const encryptBase64 = (text: string): string => {
  if (!text || text.trim().length === 0) {
    throw new Error('Input text cannot be empty');
  }
  return window.btoa(text);
};

export const decryptBase64 = (text: string): string => {
  try {
    if (!text || text.trim().length === 0) {
      throw new Error('Input text cannot be empty');
    }
    return window.atob(text);
  } catch (e: any) {
    throw new Error(e.message || 'Invalid Base64 string');
  }
};

// --- Main Handler ---
export const processCrypto = async (
  mode: 'encrypt' | 'decrypt',
  algo: Algorithm,
  text: string,
  key: string
): Promise<string> => {
  // Rate limiting
  const limiter = mode === 'encrypt' ? encryptionLimiter : decryptionLimiter;
  const operationType = `${mode}-${algo}`;
  
  if (!limiter.check(operationType)) {
    const remainingTime = Math.ceil(limiter.getRemainingTime(operationType) / 1000);
    throw new Error(`Rate limit exceeded. Please wait ${remainingTime} seconds before trying again.`);
  }
  
  // Simulate network delay for "API feel"
  await new Promise(resolve => setTimeout(resolve, 400));

  if (!text) return '';

  if (mode === 'encrypt') {
    switch (algo) {
      case Algorithm.AES: return encryptAES(text, key);
      case Algorithm.RSA: return encryptRSA(text, key);
      case Algorithm.ECC: return encryptECC(text, key);
      case Algorithm.BASE64: return encryptBase64(text);
      case Algorithm.SHA256: return hashSHA256(text); // SHA256 is one-way
      default: throw new Error('Algorithm not supported');
    }
  } else {
    switch (algo) {
      case Algorithm.AES: return decryptAES(text, key);
      case Algorithm.RSA: return decryptRSA(text, key);
      case Algorithm.ECC: return decryptECC(text, key);
      case Algorithm.BASE64: return decryptBase64(text);
      case Algorithm.SHA256: throw new Error('Cannot decrypt SHA256 hash');
      default: throw new Error('Algorithm not supported');
    }
  }
};