import React, { useState } from 'react';
import { Copy, Unlock, FileCheck } from 'lucide-react';
import { Button, Card, Input, Select, TextArea } from '../components/UI';
import { Algorithm } from '../types';
import { processCrypto } from '../services/cryptoService';

const Decryption: React.FC = () => {
  const [algo, setAlgo] = useState<string>(Algorithm.AES);
  const [cipherText, setCipherText] = useState('');
  const [key, setKey] = useState('');
  const [output, setOutput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDecrypt = async () => {
    setError('');
    setOutput('');
    
    if (!cipherText) return setError('Please enter ciphertext to decrypt');
    if (cipherText.trim().length === 0) return setError('Cipher text cannot be empty whitespace');
    
    // Validate password for AES
    if (algo === Algorithm.AES) {
      if (!key) return setError('Password is required');
      if (key.length < 8) return setError('Password must be at least 8 characters long');
    }
    
    if ((algo === Algorithm.RSA || algo === Algorithm.ECC) && !key) return setError('Private Key is required');
    if (algo === Algorithm.SHA256) return setError('Hashes cannot be decrypted');

    setLoading(true);
    try {
      const result = await processCrypto('decrypt', algo as Algorithm, cipherText, key);
      setOutput(result);
    } catch (err: any) {
      setError(err.message || 'Decryption failed');
    } finally {
      setLoading(false);
    }
  };

  const getKeyLabel = () => {
    if (algo === Algorithm.AES) return "Passphrase";
    if (algo === Algorithm.RSA) return "RSA Private Key (PEM)";
    if (algo === Algorithm.ECC) return "ECC Private Key (PEM)";
    return "";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Decryption Studio</h2>
        <div className="text-sm text-gray-500">Restore your data</div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <Card>
            <div className="space-y-4">
              <Select
                label="Algorithm"
                value={algo}
                onChange={setAlgo}
                options={[
                  { value: Algorithm.AES, label: 'AES-256-GCM' },
                  { value: Algorithm.RSA, label: 'RSA-4096-OAEP' },
                  { value: Algorithm.ECC, label: 'ECC (ECIES Hybrid)' },
                  { value: Algorithm.BASE64, label: 'Base64 Decoding' },
                ]}
              />

              <TextArea
                label="Cipher Text"
                placeholder="Paste encrypted data here..."
                value={cipherText}
                onChange={(e) => setCipherText(e.target.value)}
                className="h-40 font-mono text-sm"
              />

              {algo !== Algorithm.BASE64 && (
                <div className="space-y-2">
                  <Input
                    type={algo === Algorithm.AES ? "password" : "text"}
                    label={getKeyLabel()}
                    placeholder={algo === Algorithm.AES ? "Enter the password used to encrypt" : "-----BEGIN PRIVATE KEY-----..."}
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                  />
                </div>
              )}

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm rounded-lg">
                  {error}
                </div>
              )}

              <Button onClick={handleDecrypt} isLoading={loading} variant="secondary" className="w-full">
                <Unlock className="w-4 h-4 mr-2" />
                Decrypt Data
              </Button>
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Decrypted Result</h3>
              <Button variant="ghost" onClick={() => navigator.clipboard.writeText(output)} disabled={!output} title="Copy">
                <Copy size={18} />
              </Button>
            </div>
            
            <div className="flex-1 bg-white dark:bg-black/30 border border-gray-100 dark:border-slate-700 rounded-lg p-4 min-h-[300px] overflow-auto whitespace-pre-wrap">
               {output ? (
                 <span className="text-gray-800 dark:text-gray-200">{output}</span>
               ) : (
                 <span className="text-gray-400 italic">// Decrypted text will appear here...</span>
               )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Decryption;