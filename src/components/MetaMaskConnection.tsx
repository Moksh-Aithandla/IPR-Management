import { Wallet, AlertCircle, Loader2 } from 'lucide-react';

interface MetaMaskConnectionProps {
  onConnect: () => void;
  error: string | null;
  isConnecting: boolean;
}

export function MetaMaskConnection({ onConnect, error, isConnecting }: MetaMaskConnectionProps) {
  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 text-center">
        <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <Wallet className="w-10 h-10 text-white" />
        </div>
        
        <h2 className="text-white mb-3">Connect Your Wallet</h2>
        <p className="text-purple-200 mb-6">
          Connect your MetaMask wallet to access the IP Rights Management system.
          Only authorized admin accounts can access the dashboard.
        </p>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-200 text-left">{error}</p>
          </div>
        )}

        <button
          onClick={onConnect}
          disabled={isConnecting}
          className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:from-purple-800 disabled:to-pink-800 text-white rounded-lg transition-all transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isConnecting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>Connecting...</span>
            </>
          ) : (
            <>
              <Wallet className="w-5 h-5" />
              <span>Connect MetaMask</span>
            </>
          )}
        </button>

        <div className="mt-6 pt-6 border-t border-white/10">
          <p className="text-sm text-purple-300/70">
            Don't have MetaMask?{' '}
            <a
              href="https://metamask.io/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 underline"
            >
              Install here
            </a>
          </p>
        </div>
      </div>

      <div className="mt-6 bg-purple-500/10 border border-purple-500/30 rounded-xl p-6">
        <h3 className="text-purple-300 mb-3">Network Requirements</h3>
        <ul className="space-y-2 text-sm text-purple-200/70">
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Network: Sepolia Test Network</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Chain ID: 11155111 (0xaa36a7)</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-purple-400 mt-0.5">•</span>
            <span>Admin access required</span>
          </li>
        </ul>
      </div>
    </div>
  );
}