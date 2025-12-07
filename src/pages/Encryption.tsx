import React, { useState } from 'react';
import { Copy, Download, RefreshCw, FileText } from 'lucide-react';
import { Button, Card, Input, Select, TextArea } from '../components/UI';
import { PasswordStrength } from '../components/PasswordStrength';
import { Algorithm } from '../types';
import { processCrypto } from '../services/cryptoService';

const Encryption: React.FC = () => {
  const [algo, setAlgo] = useState<string>(Algorithm.AES);
  const [inputText, setInputText] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEncrypt = async () => {
    setError('');
    setOutput('');
    
    if (!inputText) return setError('Please enter text to encrypt');
    if (inputText.trim().length === 0) return setError('Input text cannot be empty whitespace');
    
    // Validate password strength for AES
    if (algo === Algorithm.AES) {
      if (!key) return setError('Password is required for AES');
      if (key.length < 8) return setError('Password must be at least 8 characters long for security');
    }
    
    if (algo === Algorithm.RSA && !key) return setError('Public Key is required for RSA');
    if (algo === Algorithm.ECC && !key) return setError('Public Key is required for ECC');
    
    // Warn about RSA size limit
    if (algo === Algorithm.RSA && inputText.length > 446) {
      return setError('RSA can only encrypt up to ~446 bytes. Please use AES for larger data.');
    }

    setLoading(true);
    try {
      const result = await processCrypto('encrypt', algo as Algorithm, inputText, key);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'Encryption failed');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (output) navigator.clipboard.writeText(output);
  };

  const downloadOutput = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `encrypted-${algo.toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getKeyPlaceholder = () => {
    if (algo === Algorithm.AES) return "Enter a strong password (min 8 characters)";
    if (algo === Algorithm.RSA || algo === Algorithm.ECC) return "-----BEGIN PUBLIC KEY-----...";
    return "";
  };

  const getKeyLabel = () => {
    if (algo === Algorithm.AES) return "Secret Passphrase";
    if (algo === Algorithm.RSA) return "Recipient RSA Public Key (PEM)";
    if (algo === Algorithm.ECC) return "Recipient ECC Public Key (PEM)";
    return "";
  };

  const getKeyDescription = () => {
    if (algo === Algorithm.AES) return "Minimum 8 characters. Use a mix of letters, numbers, and symbols.";
    if (algo === Algorithm.RSA || algo === Algorithm.ECC) return "Paste the recipient's Public Key here.";
    return "";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Encryption Studio</h2>
        <div className="text-sm text-gray-500">Secure your data locally</div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Input */}
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Select
                label="Algorithm"
                value={algo}
                onChange={setAlgo}
                options={[
                  { value: Algorithm.AES, label: 'AES-256-GCM (Recommended)' },
                  { value: Algorithm.RSA, label: 'RSA-4096-OAEP (Asymmetric)' },
                  { value: Algorithm.ECC, label: 'ECC (ECIES Hybrid)' },
                  { value: Algorithm.BASE64, label: '⚠️ Base64 Encoding (NOT SECURE)' },
                  { value: Algorithm.SHA256, label: 'SHA-256 Hashing (One-way)' },
                ]}
              />
              
              {/* Security Warnings */}
              {algo === Algorithm.BASE64 && (
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400 text-sm rounded-lg border border-yellow-200 dark:border-yellow-800">
                  <strong>⚠️ Warning:</strong> Base64 is NOT encryption! It's just encoding. Anyone can decode it. Use AES for actual encryption.
                </div>
              )}
              
              {algo === Algorithm.RSA && (
                <div className="p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 text-sm rounded-lg">
                  <strong>ℹ️ Note:</strong> RSA can encrypt max ~446 bytes. For larger data, use AES-256-GCM.
                </div>
              )}

              <TextArea
                label="Input Text"
                placeholder="Enter sensitive data here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="h-40"
              />

              {algo !== Algorithm.BASE64 && algo !== Algorithm.SHA256 && (
                <div className="space-y-2">
                  <Input
                    type={algo === Algorithm.AES ? "password" : "text"}
                    label={getKeyLabel()}
                    placeholder={getKeyPlaceholder()}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                  {algo === Algorithm.AES && <PasswordStrength password={key} />}
                  <p className="text-xs text-gray-500">
                    {getKeyDescription()}
                  </p>
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <Button onClick={handleEncrypt} isLoading={loading} className="w-full">
                Encrypt Data
              </Button>
            </div>
          </Card>

          {/* File Upload Section (Visual Only for Demo - could be expanded) */}
          <Card className="opacity-75 hover:opacity-100 transition-opacity">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-slate-600 rounded-lg p-6 cursor-not-allowed bg-gray-50 dark:bg-slate-900/50">
               <FileText className="text-gray-400 mb-2" />
               <p className="text-sm font-medium text-gray-500">File Encryption</p>
               <p className="text-xs text-gray-400">Drag & Drop files (Coming Soon in Pro)</p>
            </div>
          </Card>
        </div>

        {/* Right: Output */}
        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Output</h3>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={copyToClipboard} disabled={!output} title="Copy">
                  <Copy size={18} />
                </Button>
                <Button variant="ghost" onClick={downloadOutput} disabled={!output} title="Download">
                  <Download size={18} />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-auto text-green-400 min-h-[300px] break-all">
               {output || <span className="text-gray-600 select-none">// Encrypted output will appear here...</span>}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Encryption;