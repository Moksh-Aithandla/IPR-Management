import { useState, useEffect } from 'react';
import { Shield, Key, AlertCircle } from 'lucide-react';
import { AdminDashboard } from './components/AdminDashboard';
import { MetaMaskConnection } from './components/MetaMaskConnection';

// Admin wallet address (only this address can access the system)
const ADMIN_ADDRESS = '0xEf1A91cCb29C85135EA58F6f800B6e66a5459589';

function App() {
  const [account, setAccount] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [chainId, setChainId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  // Sepolia Chain ID
  const SEPOLIA_CHAIN_ID = '0xaa36a7'; // 11155111 in decimal

  useEffect(() => {
    checkConnection();
    setupEventListeners();

    return () => {
      removeEventListeners();
    };
  }, []);

  useEffect(() => {
    if (account) {
      setIsAdmin(account.toLowerCase() === ADMIN_ADDRESS.toLowerCase());
    } else {
      setIsAdmin(false);
    }
  }, [account]);

  const checkConnection = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          const chain = await window.ethereum.request({ method: 'eth_chainId' });
          setChainId(chain);
          
          if (chain !== SEPOLIA_CHAIN_ID) {
            setError('Please switch to Sepolia Test Network');
          }
        }
      } catch (err) {
        console.error('Error checking connection:', err);
      }
    }
  };

  const setupEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }
  };

  const removeEventListeners = () => {
    if (typeof window.ethereum !== 'undefined') {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      setError('Please connect to MetaMask');
    } else {
      setAccount(accounts[0]);
      setError(null);
    }
  };

  const handleChainChanged = (chain: string) => {
    setChainId(chain);
    if (chain !== SEPOLIA_CHAIN_ID) {
      setError('Please switch to Sepolia Test Network');
    } else {
      setError(null);
    }
  };

  const connectWallet = async () => {
    if (typeof window.ethereum === 'undefined') {
      setError('MetaMask is not installed. Please install MetaMask to continue.');
      return;
    }

    try {
      setError(null); // Clear any previous errors
      setIsConnecting(true);
      
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      if (accounts.length === 0) {
        setError('No accounts found. Please unlock MetaMask.');
        return;
      }
      
      setAccount(accounts[0]);
      
      const chain = await window.ethereum.request({ method: 'eth_chainId' });
      setChainId(chain);

      if (chain !== SEPOLIA_CHAIN_ID) {
        await switchToSepolia();
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      if (err.code === 4001) {
        setError('Connection request rejected. Please try again.');
      } else {
        setError(err.message || 'Failed to connect to MetaMask');
      }
    } finally {
      setIsConnecting(false);
    }
  };

  const switchToSepolia = async () => {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: SEPOLIA_CHAIN_ID }],
      });
      setError(null);
    } catch (err: any) {
      if (err.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [
              {
                chainId: SEPOLIA_CHAIN_ID,
                chainName: 'Sepolia Test Network',
                nativeCurrency: {
                  name: 'SepoliaETH',
                  symbol: 'SEP',
                  decimals: 18,
                },
                rpcUrls: ['https://rpc.sepolia.org'],
                blockExplorerUrls: ['https://sepolia.etherscan.io'],
              },
            ],
          });
          setError(null);
        } catch (addError: any) {
          setError('Failed to add Sepolia network');
        }
      } else {
        setError('Failed to switch to Sepolia network');
      }
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
    setIsAdmin(false);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <div>
                <h1 className="text-white">IP Rights Management</h1>
                <p className="text-sm text-purple-300">Blockchain-Based Protection</p>
              </div>
            </div>
            
            {account && (
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-xs text-purple-300">Connected Account</p>
                  <p className="text-sm text-white font-mono">
                    {account.slice(0, 6)}...{account.slice(-4)}
                  </p>
                </div>
                <button
                  onClick={disconnectWallet}
                  className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
                >
                  Disconnect
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Network Error Banner */}
      {error && chainId !== SEPOLIA_CHAIN_ID && account && (
        <div className="bg-amber-500/20 border-b border-amber-500/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              <p className="text-amber-200">{error}</p>
              <button
                onClick={switchToSepolia}
                className="ml-auto px-4 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded transition-colors"
              >
                Switch Network
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!account ? (
          <MetaMaskConnection onConnect={connectWallet} error={error} isConnecting={isConnecting} />
        ) : !isAdmin ? (
          <div className="max-w-md mx-auto">
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-white mb-2">Access Denied</h2>
              <p className="text-red-200 mb-4">
                This account is not authorized to access the IP Rights Management system.
              </p>
              <p className="text-sm text-red-300/70 font-mono mb-4">
                Connected: {account}
              </p>
              <p className="text-xs text-red-300/50 mb-6">
                Only the designated admin wallet can access this system.
              </p>
              <button
                onClick={disconnectWallet}
                className="px-6 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg transition-colors"
              >
                Disconnect Wallet
              </button>
            </div>
          </div>
        ) : chainId !== SEPOLIA_CHAIN_ID ? (
          <div className="max-w-md mx-auto">
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-8 text-center">
              <AlertCircle className="w-16 h-16 text-amber-400 mx-auto mb-4" />
              <h2 className="text-white mb-2">Wrong Network</h2>
              <p className="text-amber-200 mb-6">
                Please connect to the Sepolia Test Network to continue.
              </p>
              <button
                onClick={switchToSepolia}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Switch to Sepolia
              </button>
            </div>
          </div>
        ) : (
          <AdminDashboard account={account} />
        )}
      </main>
    </div>
  );
}

export default App;

declare global {
  interface Window {
    ethereum?: any;
  }
}