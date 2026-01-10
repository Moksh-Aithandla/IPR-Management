import { useState, useEffect } from 'react';
import { IPRegistration } from './IPRegistration';
import { IPList } from './IPList';
import { IPTransfer } from './IPTransfer';
import { FileText, Send, List, Shield } from 'lucide-react';
import { fetchAllIPRights, transferIPRight } from '../utils/api';

interface AdminDashboardProps {
  account: string;
}

type Tab = 'register' | 'list' | 'transfer';

export interface IPRight {
  id: string;
  title: string;
  description: string;
  owner: string;
  ipfsHash: string;
  registrationDate: number;
  category: string;
  status: 'active' | 'transferred' | 'disputed';
  applicantAddress?: string;
  transactionHash?: string;
  transferHistory: Array<{
    from: string;
    to: string;
    date: number;
    txHash: string;
  }>;
}

export function AdminDashboard({ account }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<Tab>('register');
  const [ipRights, setIpRights] = useState<IPRight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchIPRights = async () => {
      setIsLoading(true);
      const rights = await fetchAllIPRights();
      setIpRights(rights);
      setIsLoading(false);
    };
    fetchIPRights();
  }, []);

  const handleRegister = (ipRight: Omit<IPRight, 'id' | 'owner' | 'registrationDate' | 'status' | 'transferHistory'>) => {
    const newIPRight: IPRight = {
      ...ipRight,
      id: Date.now().toString(),
      owner: account,
      registrationDate: Date.now(),
      status: 'active',
      transferHistory: [],
    };
    setIpRights([newIPRight, ...ipRights]);
    
    // Refresh from database to ensure sync
    setTimeout(async () => {
      const rights = await fetchAllIPRights();
      setIpRights(rights);
    }, 1000);
  };

  const handleTransfer = async (ipId: string, toAddress: string, txHash: string) => {
    // Save to database
    await transferIPRight(ipId, toAddress, txHash);
    
    // Update local state
    setIpRights(
      ipRights.map((ip) => {
        if (ip.id === ipId) {
          return {
            ...ip,
            owner: toAddress,
            status: 'transferred' as const,
            transferHistory: [
              ...ip.transferHistory,
              {
                from: ip.owner,
                to: toAddress,
                date: Date.now(),
                txHash,
              },
            ],
          };
        }
        return ip;
      })
    );
    
    // Refresh from database after a short delay
    setTimeout(async () => {
      const rights = await fetchAllIPRights();
      setIpRights(rights);
    }, 1000);
  };

  const tabs = [
    { id: 'register' as Tab, label: 'Register IP', icon: FileText },
    { id: 'list' as Tab, label: 'My IP Rights', icon: List },
    { id: 'transfer' as Tab, label: 'Transfer', icon: Send },
  ];

  return (
    <div>
      {/* Admin Badge */}
      <div className="mb-8 flex items-center justify-center gap-2">
        <Shield className="w-5 h-5 text-green-400" />
        <span className="text-green-400">Admin Access Granted</span>
      </div>

      {/* Tab Navigation */}
      <div className="mb-8">
        <div className="flex gap-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                  : 'text-purple-300 hover:bg-white/5'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div>
        {activeTab === 'register' && (
          <IPRegistration account={account} onRegister={handleRegister} />
        )}
        {activeTab === 'list' && (
          <IPList ipRights={ipRights} account={account} />
        )}
        {activeTab === 'transfer' && (
          <IPTransfer
            ipRights={ipRights.filter((ip) => 
              ip.owner.toLowerCase() === account.toLowerCase() && ip.status === 'active'
            )}
            onTransfer={handleTransfer}
          />
        )}
      </div>
    </div>
  );
}