# 🔐 CryptoToolbox

A modern, secure, client-side encryption and decryption suite supporting **AES-256-GCM**, **RSA-4096-OAEP**, **ECC (P-256)**, and cryptographic hashing. All operations run locally in your browser using the Web Crypto API.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.2-61dafb)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-646cff)](https://vitejs.dev/)

---

## ✨ Features

### 🔒 **Encryption Algorithms**
- **AES-256-GCM** - Symmetric encryption with 600,000 PBKDF2 iterations
- **RSA-4096-OAEP** - Asymmetric encryption with enhanced key size
- **ECC (ECIES)** - Elliptic Curve encryption using P-256
- **SHA-256** - One-way cryptographic hashing
- **Base64** - Encoding/decoding (with clear warnings)

### 🛡️ **Security Features**
- ✅ Client-side only - No data sent to servers
- ✅ Web Crypto API - Hardware-accelerated cryptography
- ✅ Rate limiting - Prevents abuse (20 ops/min)
- ✅ Input validation - XSS and injection prevention
- ✅ Password strength indicator - Real-time feedback
- ✅ Private key protection - Hidden by default
- ✅ Content Security Policy - XSS attack prevention

### 🎨 **User Experience**
- 🌓 Dark mode support
- 📱 Responsive design
- 🎯 Intuitive interface
- ⚡ Fast and lightweight
- 🔑 Key management tools
- 📋 Copy/download results

---

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/nabee-ll/CryptoToolBox.git
cd CryptoToolBox

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at `http://localhost:3000`

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build locally
npm run preview
```

---

## 📖 Usage

### Encryption

1. Navigate to the **Encrypt** page
2. Select your encryption algorithm:
   - **AES-256-GCM** for symmetric encryption (recommended)
   - **RSA-4096-OAEP** for asymmetric encryption (max ~446 bytes)
   - **ECC** for elliptic curve encryption
3. Enter your plaintext
4. Provide the required key/password
5. Click **Encrypt Data**
6. Copy or download the encrypted output

### Decryption

1. Navigate to the **Decrypt** page
2. Select the matching algorithm
3. Paste the encrypted data
4. Provide the correct key/password
5. Click **Decrypt Data**
6. View your decrypted plaintext

### Key Management

1. Navigate to **Key Management**
2. Generate cryptographic key pairs:
   - **AES-256** random keys
   - **RSA-4096** key pairs (takes 5-10 seconds)
   - **ECC P-256** key pairs
3. Copy keys securely
4. Private keys are hidden by default - click 👁️ to reveal

---

## 🏗️ Project Structure

```
CryptoToolbox/
├── public/                 # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── PasswordStrength.tsx
│   │   └── UI.tsx
│   ├── pages/            # Page components
│   │   ├── Encryption.tsx
│   │   ├── Decryption.tsx
│   │   ├── KeyManagement.tsx
│   │   ├── Login.tsx
│   │   └── Home.tsx
│   ├── services/         # Business logic
│   │   └── cryptoService.ts
│   ├── utils/           # Helper functions
│   │   └── security.ts
│   ├── App.tsx          # Main application
│   ├── main.tsx         # Entry point
│   └── types.ts         # TypeScript definitions
├── .env.example         # Environment template
├── index.html          # HTML template
├── package.json        # Dependencies
├── tsconfig.json       # TypeScript config
└── vite.config.ts      # Build config
```

---

## 🔐 Security

### Cryptographic Implementation

- **AES-256-GCM**: 600,000 PBKDF2 iterations, random salt & IV per encryption
- **RSA-4096-OAEP**: SHA-256 hash function, enhanced key size
- **ECC P-256**: ECDH for key agreement, AES-256-GCM for content encryption
- **Random Generation**: `crypto.getRandomValues()` for cryptographically secure randomness

### Best Practices

1. **Never share private keys** - Store offline in secure locations
2. **Use strong passwords** - Minimum 12 characters, mixed case, numbers, symbols
3. **Clear clipboard** - After copying sensitive data
4. **Trusted devices only** - Don't use on public/shared computers
5. **Keep browser updated** - For latest security patches

### Security Limitations

⚠️ **Important Notes:**
- Demo authentication is for UI/UX demonstration only
- Client-side execution means keys exist in browser memory
- For production use, implement proper server-side authentication
- Rate limiting can be bypassed by clearing browser data

For detailed security documentation, see [SECURITY.md](SECURITY.md)

---

## 🛠️ Technology Stack

- **Framework**: [React 19.2](https://reactjs.org/)
- **Language**: [TypeScript 5.8](https://www.typescriptlang.org/)
- **Build Tool**: [Vite 6.2](https://vitejs.dev/)
- **Routing**: [React Router 7.10](https://reactrouter.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Cryptography**: [Web Crypto API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Crypto_API)

---

## 📝 API Reference

### CryptoService

```typescript
// AES-256-GCM Encryption
encryptAES(text: string, password: string): Promise<string>

// AES-256-GCM Decryption
decryptAES(cipherText: string, password: string): Promise<string>

// RSA-4096-OAEP Encryption
encryptRSA(text: string, publicKeyPem: string): Promise<string>

// RSA-4096-OAEP Decryption
decryptRSA(cipherText: string, privateKeyPem: string): Promise<string>

// ECC (ECIES) Encryption
encryptECC(text: string, recipientPublicKeyPem: string): Promise<string>

// ECC (ECIES) Decryption
decryptECC(payload: string, recipientPrivateKeyPem: string): Promise<string>

// SHA-256 Hashing
hashSHA256(text: string): Promise<string>

// Key Generation
generateRSAKeyPair(): Promise<{publicKey: string, privateKey: string}>
generateECCKeyPair(): Promise<{publicKey: string, privateKey: string}>
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Maintain consistent code style
- Add comments for complex logic
- Update documentation as needed
- Test all security-critical changes

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [Web Crypto API](https://www.w3.org/TR/WebCryptoAPI/) for browser-native cryptography
- [NIST](https://www.nist.gov/) for cryptographic standards and recommendations
- [OWASP](https://owasp.org/) for security best practices
- The open-source community for amazing tools and libraries

---

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/nabee-ll/CryptoToolBox/issues)
- **Discussions**: [GitHub Discussions](https://github.com/nabee-ll/CryptoToolBox/discussions)
- **Security**: See [SECURITY.md](SECURITY.md) for vulnerability reporting

---

## ⚠️ Disclaimer

This tool is provided for educational and legitimate use cases only. Users are responsible for compliance with applicable laws and regulations. The authors assume no liability for misuse.

**Use responsibly and ethically.** 🔐

---

<div align="center">

Made with ❤️ by [nabee-ll](https://github.com/nabee-ll)

⭐ Star this repo if you find it useful!

</div>