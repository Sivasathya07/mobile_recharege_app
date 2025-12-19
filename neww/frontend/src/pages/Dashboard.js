import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useQuery } from 'react-query';
import { rechargeAPI } from '../services/api';
import {
  Smartphone,
  Tv,
  Zap,
  Wifi,
  Wallet,
  History,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

const Dashboard = () => {
  const { user } = useAuth();
  const [recentRecharges, setRecentRecharges] = useState([]);
  const [stats, setStats] = useState({
    thisMonth: 0,
    totalRecharges: 0,
    cashbackEarned: 0,
    monthlyGrowth: 0
  });

  // Calculate stats and load transactions from localStorage
  const loadDashboardData = () => {
    const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    console.log('Dashboard transactions:', transactions);
    
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Filter recharge transactions
    const rechargeTransactions = transactions.filter(t => t.type === 'recharge');
    
    // This month's total
    const thisMonthTotal = rechargeTransactions
      .filter(t => {
        const date = new Date(t.date || t.createdAt);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Last month's total for growth calculation
    const lastMonthTotal = rechargeTransactions
      .filter(t => {
        const date = new Date(t.date || t.createdAt);
        return date.getMonth() === lastMonth && date.getFullYear() === lastMonthYear;
      })
      .reduce((sum, t) => sum + (t.amount || 0), 0);

    // Calculate growth percentage
    const growth = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100) : 0;

    // Calculate cashback (2% of this month's recharges)
    const cashback = Math.floor(thisMonthTotal * 0.02);

    setStats({
      thisMonth: thisMonthTotal,
      totalRecharges: rechargeTransactions.length,
      cashbackEarned: cashback,
      monthlyGrowth: growth
    });

    // Set recent transactions (all types, not just recharges)
    setRecentRecharges(transactions.slice(0, 5));
  };

  useEffect(() => {
    loadDashboardData();
    
    // Listen for transaction updates
    const handleTransactionUpdate = () => {
      loadDashboardData();
    };
    
    window.addEventListener('transactionAdded', handleTransactionUpdate);
    
    return () => {
      window.removeEventListener('transactionAdded', handleTransactionUpdate);
    };
  }, []);

  const isLoading = false; // No API loading since we use localStorage

  const quickActions = [
    {
      icon: Smartphone,
      title: 'Mobile Recharge',
      description: 'Prepaid & Postpaid',
      color: 'bg-blue-500',
      link: '/recharge?type=mobile'
    },
    {
      icon: Tv,
      title: 'DTH Recharge',
      description: 'All DTH Operators',
      color: 'bg-purple-500',
      link: '/recharge?type=dth'
    },
    {
      icon: Zap,
      title: 'Electricity',
      description: 'Pay Bills Instantly',
      color: 'bg-yellow-500',
      link: '/recharge?type=electricity'
    },
    {
      icon: Wifi,
      title: 'Broadband',
      description: 'Internet Bills',
      color: 'bg-green-500',
      link: '/recharge?type=broadband'
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'failed':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
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

  if (isLoading) {
    return <LoadingSpinner text="Loading dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.name}!
            </h1>
            <p className="text-primary-100">
              Manage your recharges and payments from your dashboard
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center text-primary-100 mb-1">
              <Wallet className="h-4 w-4 mr-1" />
              <span className="text-sm">Wallet Balance</span>
            </div>
            <div className="text-2xl font-bold">₹{user?.balance || 0}</div>
            <Link to="/wallet" className="text-sm text-primary-200 hover:text-white flex items-center">
              Add Money <Plus className="h-3 w-3 ml-1" />
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              className="card hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center"
            >
              <div className={`${action.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3`}>
                <action.icon className="h-6 w-6 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{action.title}</h3>
              <p className="text-sm text-gray-600">{action.description}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="card">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.thisMonth}</p>
              <p className={`text-sm ${stats.monthlyGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {stats.monthlyGrowth >= 0 ? '+' : ''}{stats.monthlyGrowth.toFixed(1)}% from last month
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <History className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Recharges</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalRecharges}</p>
              <p className="text-sm text-blue-600">All time</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Wallet className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Cashback Earned</p>
              <p className="text-2xl font-bold text-gray-900">₹{stats.cashbackEarned}</p>
              <p className="text-sm text-purple-600">This month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="card">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Transactions</h2>
          <Link to="/history" className="text-primary-600 hover:text-primary-700 flex items-center text-sm">
            View All <ArrowRight className="h-4 w-4 ml-1" />
          </Link>
        </div>

        {recentRecharges.length > 0 ? (
          <div className="space-y-4">
            {recentRecharges.map((transaction) => (
              <div key={transaction.id || transaction._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  {getStatusIcon(transaction.status)}
                  <div className="ml-3">
                    <p className="font-medium text-gray-900">
                      {transaction.type === 'wallet_add' ? 'Wallet Top-up' : 
                       transaction.type === 'recharge' ? 'Mobile Recharge' : 
                       transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </p>
                    <p className="text-sm text-gray-600">
                      {transaction.number ? `${transaction.number} • ${transaction.operator}` : transaction.description}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(transaction.date || transaction.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">₹{transaction.amount}</p>
                  <span className={`badge ${getStatusBadge(transaction.status)}`}>
                    {transaction.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No transactions yet</p>
            <Link to="/recharge" className="btn-primary">
              Make Your First Recharge
            </Link>
          </div>
        )}
      </div>

      {/* Favorite Numbers */}
      {user?.favoriteNumbers && user.favoriteNumbers.length > 0 && (
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Favorite Numbers</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {user.favoriteNumbers.slice(0, 4).map((favorite) => (
              <div key={favorite._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{favorite.nickname}</p>
                  <p className="text-sm text-gray-600">{favorite.number} • {favorite.operator}</p>
                </div>
                <Link
                  to={`/recharge?number=${favorite.number}&operator=${favorite.operator}`}
                  className="btn-primary btn text-xs"
                >
                  Recharge
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;