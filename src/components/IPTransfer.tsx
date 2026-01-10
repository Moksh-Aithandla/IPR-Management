import { useState } from 'react';
import { IPRight } from './AdminDashboard';
import { Send, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

interface IPTransferProps {
  ipRights: IPRight[];
  onTransfer: (ipId: string, toAddress: string, txHash: string) => void;
}

export function IPTransfer({ ipRights, onTransfer }: IPTransferProps) {
  const [selectedIP, setSelectedIP] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  const isValidAddress = (address: string) => {
    return /^0x[a-fA-F0-9]{40}$/.test(address);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!isValidAddress(recipientAddress)) {
      setError('Invalid Ethereum address format');
      return;
    }

    const selectedIPRight = ipRights.find((ip) => ip.id === selectedIP);
    if (selectedIPRight && recipientAddress.toLowerCase() === selectedIPRight.owner.toLowerCase()) {
      setError('Cannot transfer to the current owner');
      return;
    }

    setIsTransferring(true);

    // Simulate blockchain transaction
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Generate mock transaction hash
    const mockTxHash = `0x${Math.random().toString(16).substring(2, 15)}${Math.random().toString(16).substring(2, 15)}`;

    onTransfer(selectedIP, recipientAddress, mockTxHash);

    setIsTransferring(false);
    setShowSuccess(true);

    // Reset form
    setTimeout(() => {
      setSelectedIP('');
      setRecipientAddress('');
      setShowSuccess(false);
    }, 3000);
  };

  if (ipRights.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
          <AlertCircle className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
          <h3 className="text-white mb-2">No Transferable IP Rights</h3>
          <p className="text-purple-200">
            You don't have any active IP rights that can be transferred.
          </p>
        </div>
      </div>
    );
  }

  if (showSuccess) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
          <h3 className="text-white mb-2">Transfer Successful!</h3>
          <p className="text-green-200">
            The IP right has been transferred on the Sepolia blockchain.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8">
        <div className="flex items-center gap-3 mb-6">
          <Send className="w-6 h-6 text-purple-400" />
          <h2 className="text-white">Transfer IP Right</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Select IP Right */}
          <div>
            <label className="block text-purple-300 mb-2">
              Select IP Right to Transfer <span className="text-red-400">*</span>
            </label>
            <select
              required
              value={selectedIP}
              onChange={(e) => setSelectedIP(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              <option value="" className="bg-slate-900">
                Choose an IP right...
              </option>
              {ipRights.map((ip) => (
                <option key={ip.id} value={ip.id} className="bg-slate-900">
                  {ip.title} ({ip.category})
                </option>
              ))}
            </select>
          </div>

          {/* Selected IP Details */}
          {selectedIP && (
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
              {(() => {
                const ip = ipRights.find((ip) => ip.id === selectedIP);
                return ip ? (
                  <div className="space-y-2">
                    <div>
                      <p className="text-xs text-purple-300">Title</p>
                      <p className="text-white">{ip.title}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-300">Description</p>
                      <p className="text-sm text-purple-200">{ip.description}</p>
                    </div>
                    <div>
                      <p className="text-xs text-purple-300">IPFS Hash</p>
                      <p className="text-sm text-white font-mono">{ip.ipfsHash}</p>
                    </div>
                  </div>
                ) : null;
              })()}
            </div>
          )}

          {/* Recipient Address */}
          <div>
            <label className="block text-purple-300 mb-2">
              Recipient Address <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              required
              value={recipientAddress}
              onChange={(e) => {
                setRecipientAddress(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500 font-mono"
              placeholder="0x..."
            />
            <p className="text-xs text-purple-300/70 mt-2">
              Enter the Ethereum address of the new owner
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Warning */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-amber-200">
                <strong>Warning:</strong> This action cannot be undone. Once transferred, you will
                no longer be the owner of this IP right.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isTransferring || !selectedIP || !recipientAddress}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isTransferring ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing Transfer...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Transfer IP Right</span>
              </>
            )}
          </button>

          <p className="text-xs text-purple-300/50 text-center">
            Transfer will be recorded on the Sepolia blockchain
          </p>
        </form>
      </div>
    </div>
  );
}
