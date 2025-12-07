export enum Algorithm {
  AES = 'AES',
  RSA = 'RSA',
  ECC = 'ECC',
  BASE64 = 'Base64',
  SHA256 = 'SHA256',
}

export interface EncryptionResult {
  data: string;
  error?: string;
}

export interface KeyPair {
  publicKey: string;
  privateKey: string;
}

export interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  provider: 'google' | 'email';
}