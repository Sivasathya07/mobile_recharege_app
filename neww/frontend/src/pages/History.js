import React, { useState, useEffect } from 'react';
import { 
  History as HistoryIcon,  
  Download, 
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  RefreshCw,
  LogIn
} from 'lucide-react';
import { walletAPI } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const History = () => {
  const { isAuthenticated, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      loadTransactions();
    }
  }, [isAuthenticated]);

  // Listen for storage changes to refresh transactions
  useEffect(() => {
    const handleStorageChange = () => {
      if (isAuthenticated) {
        loadTransactions();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events
    window.addEventListener('transactionAdded', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('transactionAdded', handleStorageChange);
    };
  }, [isAuthenticated]);

  // Show login prompt for non-authenticated users
  if (loading) {
    return <LoadingSpinner text="Loading..." />;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-animated relative flex items-center justify-center">
        <div className="floating-shapes"></div>
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center relative z-10">
          <LogIn className="h-16 w-16 text-blue-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Login Required</h2>
          <p className="text-gray-600 mb-6">Please login to view your transaction history</p>
          <button
            onClick={() => window.location.href = '/login?redirect=/history'}
            className="btn-primary w-full"
          >
            Login to Continue
          </button>
        </div>
      </div>
    );
  }

  const loadTransactions = async () => {
    setIsLoading(true);
    try {
      // Always load from localStorage for demo
      const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      console.log('Loaded transactions:', localTransactions);
      setTransactions(localTransactions);
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'processing':
        return <RefreshCw className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      success: 'badge-success',
      pending: 'badge-warning',
      failed: 'badge-danger',
      processing: 'badge-info'
    };
    return badges[status] || 'badge-info';
  };

  const exportToCSV = () => {
    if (filteredRecharges.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Date', 'Type', 'Number', 'Operator', 'Amount', 'Status', 'Transaction ID'];
    const csvData = filteredRecharges.map(transaction => [
      transaction.date ? new Date(transaction.date).toLocaleString() : 
      transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'Date not available',
      transaction.type === 'wallet_add' ? 'Wallet Top-up' : transaction.type,
      transaction.number || 'N/A',
      transaction.operator || 'N/A',
      transaction.amount,
      transaction.status,
      transaction.id
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Transactions exported successfully!');
  };

  const filteredRecharges = transactions.filter(transaction => {
    const matchesSearch = !searchTerm || 
      (transaction.number && transaction.number.includes(searchTerm)) ||
      (transaction.operator && transaction.operator.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (transaction.description && transaction.description.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (isLoading) {
    return <LoadingSpinner text="Loading transaction history..." />;
  }

  return (
    <div className="min-h-screen bg-animated relative p-6">
      <div className="floating-shapes"></div>
      <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Transaction History</h1>
          <p className="text-gray-600">View and manage your recharge history</p>
        </div>
        <button
          onClick={loadTransactions}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search by number, operator, or transaction ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input pl-10"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="input"
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
            
            <button 
              onClick={exportToCSV}
              className="btn-secondary flex items-center"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Transaction List */}
      <div className="card">
        {filteredRecharges.length > 0 ? (
          <div className="space-y-4">
            {filteredRecharges.map((transaction) => (
              <div key={transaction.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    {getStatusIcon(transaction.status)}
                    <div>
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900">
                          {transaction.type === 'wallet_add' ? 'Wallet Top-up' : transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                        </h3>
                        <span className={`badge ${getStatusBadge(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {transaction.number ? `${transaction.number} • ${transaction.operator}` : transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {transaction.date ? new Date(transaction.date).toLocaleString() : 
                         transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() :
                         'Date not available'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-900">₹{transaction.amount}</p>
                    <p className="text-xs text-gray-500">ID: {transaction.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <HistoryIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'You haven\'t made any recharges yet'
              }
            </p>
            {!searchTerm && statusFilter === 'all' && (
              <button 
                onClick={() => window.location.href = '/recharge'}
                className="btn-primary"
              >
                Make Your First Recharge
              </button>
            )}
          </div>
        )}
      </div>


      </div>
    </div>
  );
};

export default History;