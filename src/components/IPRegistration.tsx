import { useState } from 'react';
import { FileText, Upload, CheckCircle, Loader2, ExternalLink, Clock, Hash, AlertTriangle } from 'lucide-react';
import { registerIPOnBlockchain, CONTRACT_ADDRESS } from '../utils/blockchain';
import { saveIPRight } from '../utils/api';

interface IPRegistrationProps {
  account: string;
  onRegister: (ipRight: {
    title: string;
    description: string;
    ipfsHash: string;
    category: string;
    applicantAddress: string;
    transactionHash: string;
    timestamp: number;
  }) => void;
}

export function IPRegistration({ account, onRegister }: IPRegistrationProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Patent',
    applicantAddress: '',
    file: null as File | null,
  });
  const [isRegistering, setIsRegistering] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [transactionData, setTransactionData] = useState<{
    hash: string;
    timestamp: number;
    blockNumber?: string;
    gasUsed?: string;
  } | null>(null);
  const [error, setError] = useState('');

  const categories = ['Patent', 'Trademark', 'Copyright', 'Trade Secret', 'Design'];

  const isContractDeployed = CONTRACT_ADDRESS !== '0x0000000000000000000000000000000000000000';

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate applicant address
    if (!isValidAddress(formData.applicantAddress)) {
      setError('Invalid applicant Ethereum address format');
      return;
    }

    setIsRegistering(true);

    try {
      // Step 1: Simulate IPFS upload (in production, use actual IPFS)
      const mockIPFSHash = `Qm${Math.random().toString(36).substring(2, 15)}${Math.random().toString(36).substring(2, 15)}`;
      
      // Step 2: Register on blockchain (Sepolia)
      const result = await registerIPOnBlockchain(
        formData.title,
        formData.description,
        mockIPFSHash,
        formData.category,
        formData.applicantAddress
      );

      // Step 3: Store transaction data
      setTransactionData({
        hash: result.transactionHash,
        timestamp: result.timestamp,
        blockNumber: result.blockNumber,
        gasUsed: result.gasUsed,
      });

      // Step 4: Update parent component
      onRegister({
        title: formData.title,
        description: formData.description,
        ipfsHash: mockIPFSHash,
        category: formData.category,
        applicantAddress: formData.applicantAddress,
        transactionHash: result.transactionHash,
        timestamp: result.timestamp,
      });

      // Step 5: Save IP right to backend
      await saveIPRight({
        title: formData.title,
        description: formData.description,
        ipfsHash: mockIPFSHash,
        category: formData.category,
        applicantAddress: formData.applicantAddress,
        transactionHash: result.transactionHash,
        timestamp: result.timestamp,
      });

      setIsRegistering(false);
      setShowSuccess(true);

      // Reset form after 10 seconds
      setTimeout(() => {
        setFormData({
          title: '',
          description: '',
          category: 'Patent',
          applicantAddress: '',
          file: null,
        });
        setShowSuccess(false);
        setTransactionData(null);
      }, 10000);
    } catch (err: any) {
      setIsRegistering(false);
      setError(err.message || 'Failed to register on blockchain. Please try again.');
      console.error('Registration error:', err.message || err.toString());
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, file: e.target.files[0] });
    }
  };

  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (showSuccess && transactionData) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-white mb-2 text-center">IP Right Registered Successfully!</h3>
          <p className="text-green-200 text-center mb-6">
            Your intellectual property has been recorded on the Sepolia blockchain.
          </p>

          {/* Transaction Details */}
          <div className="space-y-4 bg-black/30 rounded-lg p-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Hash className="w-4 h-4 text-purple-400" />
                <p className="text-sm text-purple-300">Transaction Hash</p>
              </div>
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-3">
                <p className="text-sm text-white font-mono flex-1 break-all">
                  {transactionData.hash}
                </p>
                <a
                  href={`https://sepolia.etherscan.io/tx/${transactionData.hash}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded transition-colors flex-shrink-0"
                  title="View on Etherscan"
                >
                  <ExternalLink className="w-4 h-4 text-purple-400" />
                </a>
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-purple-400" />
                <p className="text-sm text-purple-300">Registration Time</p>
              </div>
              <p className="text-sm text-white bg-white/5 rounded-lg p-3">
                {formatTimestamp(transactionData.timestamp)}
              </p>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <a
              href={`https://sepolia.etherscan.io/tx/${transactionData.hash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Verify on Etherscan</span>
            </a>
          </div>

          <p className="text-xs text-green-300/70 text-center mt-4">
            This form will reset in 10 seconds
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Contract Deployment Warning */}
      {!isContractDeployed && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-amber-300 mb-2">Smart Contract Not Deployed</h3>
              <p className="text-amber-200/80 text-sm mb-3">
                Before you can register IP rights on the blockchain, you need to deploy the smart contract to Sepolia.
              </p>
              <div className="bg-black/30 rounded-lg p-4 space-y-2 text-xs text-amber-100/80">
                <p><strong>Quick Setup:</strong></p>
                <ol className="list-decimal list-inside space-y-1 ml-2">
                  <li>Open <a href="https://remix.ethereum.org" target="_blank" rel="noopener noreferrer" className="text-purple-300 underline hover:text-purple-200">Remix IDE</a></li>
                  <li>Copy the contract from <code className="bg-black/50 px-1 rounded">/contracts/IPRightsRegistry.sol</code></li>
                  <li>Compile and deploy to Sepolia network using MetaMask</li>
                  <li>Update <code className="bg-black/50 px-1 rounded">CONTRACT_ADDRESS</code> in <code className="bg-black/50 px-1 rounded">/utils/blockchain.ts</code></li>
                </ol>
                <p className="mt-3">See <code className="bg-black/50 px-1 rounded">DEPLOYMENT_GUIDE.md</code> for detailed instructions.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Contract Info Banner (when deployed) */}
      {isContractDeployed && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-4 mb-6">
          <div className="flex items-start gap-3">
            <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-green-300 text-sm mb-1">Smart Contract Deployed</h3>
              <div className="flex items-center gap-2">
                <p className="text-xs text-green-200/80 font-mono break-all">
                  {CONTRACT_ADDRESS}
                </p>
                <a
                  href={`https://sepolia.etherscan.io/address/${CONTRACT_ADDRESS}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1 bg-green-500/20 hover:bg-green-500/30 rounded transition-colors flex-shrink-0"
                  title="View Contract on Etherscan"
                >
                  <ExternalLink className="w-3 h-3 text-green-400" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-6 h-6 text-purple-400" />
          <h2 className="text-white">Register New IP Right</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div>
            <label className="block text-purple-300 mb-2">
              IP Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
              placeholder="Enter IP title"
              disabled={isRegistering}
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-purple-300 mb-2">
              Category <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
              disabled={isRegistering}
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-900">
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Applicant Address */}
          <div>
            <label className="block text-purple-300 mb-2">
              Applicant MetaMask Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.applicantAddress}
              onChange={(e) => {
                setFormData({ ...formData, applicantAddress: e.target.value });
                setError('');
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 font-mono"
              placeholder="0x..."
              disabled={isRegistering}
            />
            <p className="text-xs text-purple-300/70 mt-2">
              Enter the MetaMask address of the person applying for this IP right
            </p>
          </div>

          {/* Description */}
          <div>
            <label className="block text-purple-300 mb-2">
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 resize-none"
              placeholder="Describe your intellectual property"
              disabled={isRegistering}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-purple-300 mb-2">
              Upload Documentation <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <input
                type="file"
                required
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
                accept=".pdf,.doc,.docx,.txt,.jpg,.png"
                disabled={isRegistering}
              />
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center gap-3 w-full px-4 py-8 bg-white/5 border-2 border-dashed border-white/20 rounded-lg transition-all ${
                  isRegistering ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-white/10 hover:border-purple-500/50'
                }`}
              >
                <Upload className="w-6 h-6 text-purple-400" />
                <div className="text-center">
                  <p className="text-purple-300">
                    {formData.file ? formData.file.name : 'Click to upload file'}
                  </p>
                  <p className="text-xs text-purple-300/50 mt-1">
                    PDF, DOC, TXT, JPG, PNG (Max 10MB)
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Owner Address */}
          <div>
            <label className="block text-purple-300 mb-2">Owner Address (Admin)</label>
            <div className="px-4 py-3 bg-white/5 border border-white/10 rounded-lg">
              <p className="text-white font-mono text-sm">{account}</p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isRegistering}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isRegistering ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Registering on Sepolia Blockchain...</span>
              </>
            ) : (
              <>
                <FileText className="w-5 h-5" />
                <span>Register IP Right on Blockchain</span>
              </>
            )}
          </button>

          <p className="text-xs text-purple-300/50 text-center">
            Registration will create an immutable record on the Sepolia testnet and can be verified on Etherscan
          </p>
        </form>
      </div>
    </div>
  );
}