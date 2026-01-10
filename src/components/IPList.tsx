import { useState } from 'react';
import { IPRight } from './AdminDashboard';
import { Search, FileText, Calendar, User, Hash, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface IPListProps {
  ipRights: IPRight[];
  account: string;
}

export function IPList({ ipRights, account }: IPListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ['All', 'Patent', 'Trademark', 'Copyright', 'Trade Secret', 'Design'];
  const statuses = ['All', 'active', 'transferred', 'disputed'];

  const filteredRights = ipRights.filter((ip) => {
    const matchesSearch =
      ip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ip.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'All' || ip.category === filterCategory;
    const matchesStatus = filterStatus === 'All' || ip.status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'transferred':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'disputed':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-purple-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search IP rights..."
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-purple-300/50 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              {categories.map((category) => (
                <option key={category} value={category} className="bg-slate-900">
                  {category === 'All' ? 'All Categories' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500"
            >
              {statuses.map((status) => (
                <option key={status} value={status} className="bg-slate-900">
                  {status === 'All' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                </option>
              ))}
            </select>
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-center md:justify-end">
            <p className="text-purple-300">
              {filteredRights.length} {filteredRights.length === 1 ? 'result' : 'results'}
            </p>
          </div>
        </div>
      </div>

      {/* IP Rights List */}
      <div className="space-y-4">
        {filteredRights.length === 0 ? (
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-12 text-center">
            <FileText className="w-16 h-16 text-purple-400/50 mx-auto mb-4" />
            <p className="text-purple-300">No IP rights found</p>
            <p className="text-sm text-purple-300/50 mt-2">
              {searchQuery || filterCategory !== 'All' || filterStatus !== 'All'
                ? 'Try adjusting your filters'
                : 'Register your first IP right to get started'}
            </p>
          </div>
        ) : (
          filteredRights.map((ip) => (
            <div
              key={ip.id}
              className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden hover:border-purple-500/30 transition-colors"
            >
              {/* Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white">{ip.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs border ${getStatusColor(ip.status)}`}>
                        {ip.status}
                      </span>
                    </div>
                    <p className="text-purple-200/70">{ip.description}</p>
                  </div>
                  <button
                    onClick={() => setExpandedId(expandedId === ip.id ? null : ip.id)}
                    className="ml-4 p-2 hover:bg-white/5 rounded-lg transition-colors"
                  >
                    {expandedId === ip.id ? (
                      <ChevronUp className="w-5 h-5 text-purple-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-purple-400" />
                    )}
                  </button>
                </div>

                {/* Quick Info */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">{ip.category}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300">{formatDate(ip.registrationDate)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300 font-mono">{formatAddress(ip.owner)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-purple-300 font-mono">
                      {ip.ipfsHash.slice(0, 8)}...
                    </span>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === ip.id && (
                <div className="border-t border-white/10 bg-white/5 p-6 space-y-4">
                  {/* IPFS Hash */}
                  <div>
                    <p className="text-xs text-purple-300 mb-1">IPFS Hash</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-mono bg-black/30 px-3 py-2 rounded flex-1">
                        {ip.ipfsHash}
                      </p>
                      <a
                        href={`https://ipfs.io/ipfs/${ip.ipfsHash}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                      </a>
                    </div>
                  </div>

                  {/* Owner Address */}
                  <div>
                    <p className="text-xs text-purple-300 mb-1">Owner Address</p>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-white font-mono bg-black/30 px-3 py-2 rounded flex-1">
                        {ip.owner}
                      </p>
                      <a
                        href={`https://sepolia.etherscan.io/address/${ip.owner}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 bg-purple-500/20 hover:bg-purple-500/30 rounded transition-colors"
                      >
                        <ExternalLink className="w-4 h-4 text-purple-400" />
                      </a>
                    </div>
                  </div>

                  {/* Transfer History */}
                  {ip.transferHistory.length > 0 && (
                    <div>
                      <p className="text-xs text-purple-300 mb-2">Transfer History</p>
                      <div className="space-y-2">
                        {ip.transferHistory.map((transfer, index) => (
                          <div
                            key={index}
                            className="bg-black/30 rounded-lg p-3 space-y-1"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-purple-300">
                                {formatDate(transfer.date)}
                              </span>
                              <a
                                href={`https://sepolia.etherscan.io/tx/${transfer.txHash}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                              >
                                View Tx <ExternalLink className="w-3 h-3" />
                              </a>
                            </div>
                            <p className="text-sm text-white">
                              <span className="text-purple-300">From:</span>{' '}
                              <span className="font-mono">{formatAddress(transfer.from)}</span>
                            </p>
                            <p className="text-sm text-white">
                              <span className="text-purple-300">To:</span>{' '}
                              <span className="font-mono">{formatAddress(transfer.to)}</span>
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
