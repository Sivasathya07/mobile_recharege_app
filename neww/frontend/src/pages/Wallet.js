import React, { useState, useEffect } from 'react';
import { walletAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Wallet as WalletIcon, 
  Plus, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Smartphone,
  TrendingUp,
  RefreshCw,
  Download
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

const Wallet = () => {
  const { user, addMoney } = useAuth();
  const [showAddMoney, setShowAddMoney] = useState(false);
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    loadTransactions();
    
    // Listen for transaction updates
    const handleTransactionUpdate = () => {
      loadTransactions(false);
    };
    
    window.addEventListener('transactionAdded', handleTransactionUpdate);
    window.addEventListener('storage', handleTransactionUpdate);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionUpdate);
      window.removeEventListener('storage', handleTransactionUpdate);
    };
  }, []);

  const loadTransactions = async (showToast = false) => {
    setIsLoading(true);
    try {
      const localTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
      console.log('Wallet transactions:', localTransactions);
      setTransactions(localTransactions);
      if (showToast) {
        toast.success('Transactions refreshed!');
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickAmounts = [100, 200, 500, 1000, 2000, 5000];

  const handleAddMoney = async () => {
    if (!amount || amount < 1) {
      toast.error('Please enter a valid amount');
      return;
    }

    setLoading(true);
    try {
      // Use AuthContext addMoney for demo users
      const result = await addMoney(amount);
      if (result.success) {
        setAmount('');
        setShowAddMoney(false);
        loadTransactions(false);
      }
    } catch (error) {
      toast.error('Failed to add money');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'wallet_add':
      case 'cashback':
      case 'refund':
        return <ArrowDownLeft className="h-5 w-5 text-green-500" />;
      case 'recharge':
        return <ArrowUpRight className="h-5 w-5 text-red-500" />;
      default:
        return <RefreshCw className="h-5 w-5 text-gray-500" />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'wallet_add':
      case 'cashback':
      case 'refund':
        return 'text-green-600';
      case 'recharge':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const exportToCSV = () => {
    if (!transactions || transactions.length === 0) {
      toast.error('No transactions to export');
      return;
    }

    const headers = ['Date', 'Type', 'Description', 'Amount', 'Status', 'Transaction ID'];
    const csvData = transactions.map(transaction => [
      transaction.date ? new Date(transaction.date).toLocaleString() : 
      transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() : 'Date not available',
      transaction.type,
      transaction.description,
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
    link.setAttribute('download', `wallet_transactions_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success('Wallet transactions exported successfully!');
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading wallet..." />;
  }

  return (
    <div className="min-h-screen bg-animated relative p-6">
      <div className="floating-shapes"></div>
      <div className="space-y-6 relative z-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wallet</h1>
          <p className="text-gray-600">Manage your wallet balance and transactions</p>
        </div>
        <button
          onClick={() => loadTransactions(true)}
          disabled={isLoading}
          className="btn-secondary flex items-center"
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          {isLoading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Wallet Balance Card */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center mb-2">
              <WalletIcon className="h-6 w-6 mr-2" />
              <span className="text-primary-100">Available Balance</span>
            </div>
            <div className="text-3xl font-bold mb-4">₹{user?.balance || 0}</div>
            <button
              onClick={() => setShowAddMoney(true)}
              className="bg-white text-primary-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Money
            </button>
          </div>
          <div className="text-right">
            <div className="bg-primary-500 bg-opacity-30 p-4 rounded-lg">
              <TrendingUp className="h-8 w-8 mb-2" />
              <p className="text-sm text-primary-100">This Month</p>
              <p className="text-xl font-semibold">₹2,450</p>
            </div>
          </div>
        </div>
      </div>

      {/* Add Money Modal */}
      {showAddMoney && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Add Money to Wallet</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Amount
                </label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input"
                  placeholder="Enter amount"
                  min="1"
                />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Quick Select</p>
                <div className="grid grid-cols-3 gap-2">
                  {quickAmounts.map((quickAmount) => (
                    <button
                      key={quickAmount}
                      onClick={() => setAmount(quickAmount.toString())}
                      className={`p-2 text-sm rounded-lg border transition-colors ${
                        amount === quickAmount.toString()
                          ? 'border-primary-500 bg-primary-50 text-primary-600'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      ₹{quickAmount}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                <CreditCard className="h-5 w-5 text-blue-600 mr-2" />
                <span className="text-sm text-blue-800">
                  Demo mode - Payment will be simulated
                </span>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowAddMoney(false);
                    setAmount('');
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMoney}
                  disabled={loading || !amount}
                  className="btn-primary flex-1"
                >
                  {loading ? (
                    <div className="loading-spinner mr-2"></div>
                  ) : (
                    'Add Money'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={exportToCSV}
              className="btn-secondary flex items-center text-sm"
            >
              <Download className="h-4 w-4 mr-1" />
              Export
            </button>
            <button className="text-primary-600 hover:text-primary-700 text-sm">
              View All
            </button>
          </div>
        </div>

        {isLoading ? (
          <LoadingSpinner text="Loading transactions..." />
        ) : transactions?.length > 0 ? (
          <div className="space-y-4">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getTransactionIcon(transaction.type)}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">{transaction.description}</p>
                    <p className="text-sm text-gray-600">
                      {transaction.date ? new Date(transaction.date).toLocaleString() : 
                       transaction.createdAt ? new Date(transaction.createdAt).toLocaleString() :
                       'Date not available'}
                    </p>
                    <p className="text-xs text-gray-500">Status: {transaction.status}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
                    {transaction.type === 'recharge' ? '-' : '+'}₹{transaction.amount}
                  </p>
                  <p className="text-xs text-gray-500">
                    {transaction.operator && `${transaction.operator}`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <WalletIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No transactions yet</p>
            <button
              onClick={() => setShowAddMoney(true)}
              className="btn-primary"
            >
              Add Money to Get Started
            </button>
          </div>
        )}
      </div>

      {/* Wallet Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <Smartphone className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Instant Recharges</h3>
          <p className="text-sm text-gray-600">Use wallet balance for instant recharges</p>
        </div>

        <div className="card text-center">
          <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <CreditCard className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Secure Payments</h3>
          <p className="text-sm text-gray-600">Bank-grade security for all transactions</p>
        </div>

        <div className="card text-center">
          <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="font-semibold text-gray-900 mb-2">Cashback Rewards</h3>
          <p className="text-sm text-gray-600">Earn cashback on every transaction</p>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Wallet;