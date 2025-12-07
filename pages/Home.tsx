import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Unlock, Key } from 'lucide-react';
import { Button, Card } from '../components/UI';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-6 md:py-10">
      <div className="text-center space-y-6">
        <div className="inline-flex p-4 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 mb-4 shadow-lg shadow-primary-500/20">
          <Shield size={48} />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900 dark:text-white">
          Welcome to <span className="text-primary-600 dark:text-primary-400">CryptoToolbox</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          The all-in-one secure dashboard for your encryption needs. 
          Generate keys, encrypt files, and secure messages instantly in your browser.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <Card className="hover:border-primary-500 dark:hover:border-primary-500 transition-colors cursor-pointer group" >
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg group-hover:scale-110 transition-transform">
              <Lock size={32} />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">Encrypt Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Transform text and files into unreadable formats using AES or RSA algorithms.
            </p>
            <Button onClick={() => navigate('/encrypt')} className="w-full mt-4">Start Encrypting</Button>
          </div>
        </Card>

        <Card className="hover:border-green-500 dark:hover:border-green-500 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg group-hover:scale-110 transition-transform">
              <Unlock size={32} />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">Decrypt Data</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Restore encrypted messages and files back to their original readable state.
            </p>
            <Button variant="secondary" onClick={() => navigate('/decrypt')} className="w-full mt-4">Start Decrypting</Button>
          </div>
        </Card>

        <Card className="hover:border-purple-500 dark:hover:border-purple-500 transition-colors cursor-pointer group">
          <div className="flex flex-col items-center text-center space-y-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-lg group-hover:scale-110 transition-transform">
              <Key size={32} />
            </div>
            <h3 className="text-lg font-semibold dark:text-white">Key Manager</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Generate and manage secure RSA key pairs and AES keys for your sessions.
            </p>
            <Button variant="outline" onClick={() => navigate('/keys')} className="w-full mt-4">Generate Keys</Button>
          </div>
        </Card>
      </div>

      <div className="text-center text-sm text-gray-500 dark:text-gray-400 pt-8">
        <p>Your data never leaves your browser. All operations are performed locally.</p>
      </div>
    </div>
  );
};

export default Home;