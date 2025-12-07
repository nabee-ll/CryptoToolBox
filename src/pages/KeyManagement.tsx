import React, { useState } from 'react';
import { Copy, RefreshCw, Eye, EyeOff } from 'lucide-react';
import { Button, Card, TextArea } from '../components/UI';
import { generateRSAKeyPair, generateECCKeyPair } from '../services/cryptoService';

const KeyManagement: React.FC = () => {
  const [rsaKeys, setRsaKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  const [eccKeys, setEccKeys] = useState<{ publicKey: string; privateKey: string } | null>(null);
  
  const [loadingRSA, setLoadingRSA] = useState(false);
  const [loadingECC, setLoadingECC] = useState(false);
  
  const [showPrivateRSA, setShowPrivateRSA] = useState(false);
  const [showPrivateECC, setShowPrivateECC] = useState(false);
  
  const [errorRSA, setErrorRSA] = useState('');
  const [errorECC, setErrorECC] = useState('');

  // AES Key Gen state
  const [aesKey, setAesKey] = useState('');

  const handleGenerateRSA = async () => {
    setErrorRSA('');
    setLoadingRSA(true);
    setTimeout(async () => {
      try {
        const keys = await generateRSAKeyPair();
        setRsaKeys(keys);
        setShowPrivateRSA(false); // Hide private key by default
      } catch (e: any) {
        console.error(e);
        setErrorRSA(e.message || 'Failed to generate RSA keys');
      } finally {
        setLoadingRSA(false);
      }
    }, 100);
  };

  const handleGenerateECC = async () => {
    setErrorECC('');
    setLoadingECC(true);
    setTimeout(async () => {
      try {
        const keys = await generateECCKeyPair();
        setEccKeys(keys);
        setShowPrivateECC(false); // Hide private key by default
      } catch (e: any) {
        console.error(e);
        setErrorECC(e.message || 'Failed to generate ECC keys');
      } finally {
        setLoadingECC(false);
      }
    }, 100);
  };

  const handleGenerateAES = () => {
    const arr = new Uint8Array(32); // 256 bit
    window.crypto.getRandomValues(arr);
    const hex = Array.from(arr).map(b => b.toString(16).padStart(2, '0')).join('');
    setAesKey(hex);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
       <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Key Management</h2>
        <div className="text-sm text-gray-500">Generate cryptographically secure keys</div>
      </div>
      
      {/* Security Warning Banner */}
      <div className="p-4 bg-amber-50 dark:bg-amber-900/20 text-amber-900 dark:text-amber-400 rounded-lg border border-amber-200 dark:border-amber-800">
        <div className="flex items-start gap-3">
          <span className="text-2xl">🔒</span>
          <div className="flex-1 text-sm">
            <strong className="block mb-1">Security Best Practices:</strong>
            <ul className="list-disc list-inside space-y-1 text-amber-800 dark:text-amber-300">
              <li>Never share your private keys with anyone</li>
              <li>Store private keys securely offline (USB drive, password manager)</li>
              <li>Clear clipboard after copying sensitive keys</li>
              <li>Private keys are hidden by default - click the eye icon to reveal</li>
            </ul>
          </div>
        </div>
      </div>

      {/* AES Section */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">AES Key Generator</h3>
            <p className="text-sm text-gray-500">Generate a random 256-bit Hex key for symmetric encryption.</p>
          </div>
          <Button onClick={handleGenerateAES} variant="outline">
            Generate New Key
          </Button>
        </div>

        {aesKey && (
          <div className="bg-gray-50 dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-700 flex items-center justify-between gap-4">
            <code className="text-primary-600 dark:text-primary-400 break-all font-mono text-sm">{aesKey}</code>
            <Button variant="ghost" onClick={() => copyToClipboard(aesKey)} title="Copy">
              <Copy size={16} />
            </Button>
          </div>
        )}
      </Card>

      {/* ECC Section */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">ECC Key Pair (P-256)</h3>
            <p className="text-sm text-gray-500">Generate an Elliptic Curve key pair (ECIES/ECDH).</p>
          </div>
          <Button onClick={handleGenerateECC} isLoading={loadingECC}>
            Generate Key Pair
          </Button>
        </div>
        
        {errorECC && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {errorECC}
          </div>
        )}

        {eccKeys && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Public Key</label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(eccKeys.publicKey)}>
                  <Copy size={14} className="mr-1" /> Copy
                </Button>
              </div>
              <textarea 
                readOnly 
                className="w-full h-40 p-3 text-xs font-mono bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none resize-none text-gray-600 dark:text-gray-300"
                value={eccKeys.publicKey}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Private Key</label>
                <div className="flex gap-1">
                   <Button variant="ghost" onClick={() => setShowPrivateECC(!showPrivateECC)}>
                    {showPrivateECC ? <EyeOff size={14} /> : <Eye size={14} />}
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => copyToClipboard(eccKeys.privateKey)}>
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <div className="relative">
                <textarea 
                  readOnly 
                  className={`w-full h-40 p-3 text-xs font-mono bg-gray-50 dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/30 focus:outline-none resize-none text-red-600 dark:text-red-400 ${!showPrivateECC ? 'blur-sm select-none' : ''}`}
                  value={eccKeys.privateKey}
                />
                {!showPrivateECC && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-sm font-medium text-gray-500">Hidden for security</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* RSA Section */}
      <Card>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
          <div>
            <h3 className="text-lg font-semibold dark:text-white">RSA Key Pair (4096-bit)</h3>
            <p className="text-sm text-gray-500">Generate a 4096-bit RSA key pair for enhanced security.</p>
          </div>
          <Button onClick={handleGenerateRSA} isLoading={loadingRSA} variant="secondary">
            {loadingRSA ? 'Generating (may take 5-10s)...' : 'Generate Key Pair'}
          </Button>
        </div>
        
        {loadingRSA && (
          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-lg">
            <strong>ℹ️ Note:</strong> Generating 4096-bit RSA keys may take several seconds. Please wait...
          </div>
        )}
        
        {errorRSA && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
            {errorRSA}
          </div>
        )}

        {rsaKeys && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Public Key</label>
                <Button variant="ghost" size="sm" onClick={() => copyToClipboard(rsaKeys.publicKey)}>
                  <Copy size={14} className="mr-1" /> Copy
                </Button>
              </div>
              <textarea 
                readOnly 
                className="w-full h-48 p-3 text-xs font-mono bg-gray-50 dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-700 focus:outline-none resize-none text-gray-600 dark:text-gray-300"
                value={rsaKeys.publicKey}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Private Key</label>
                <div className="flex gap-1">
                   <Button variant="ghost" onClick={() => setShowPrivateRSA(!showPrivateRSA)}>
                    {showPrivateRSA ? <EyeOff size={14} /> : <Eye size={14} />}
                   </Button>
                   <Button variant="ghost" size="sm" onClick={() => copyToClipboard(rsaKeys.privateKey)}>
                    <Copy size={14} className="mr-1" /> Copy
                  </Button>
                </div>
              </div>
              <div className="relative">
                <textarea 
                  readOnly 
                  className={`w-full h-48 p-3 text-xs font-mono bg-gray-50 dark:bg-slate-900 rounded-lg border border-red-100 dark:border-red-900/30 focus:outline-none resize-none text-red-600 dark:text-red-400 ${!showPrivateRSA ? 'blur-sm select-none' : ''}`}
                  value={rsaKeys.privateKey}
                />
                {!showPrivateRSA && (
                   <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span className="text-sm font-medium text-gray-500">Hidden for security</span>
                   </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default KeyManagement;