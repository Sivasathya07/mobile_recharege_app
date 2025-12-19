import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { adminAPI } from '../services/api';
import { Users, DollarSign, CreditCard, TrendingUp, Eye, Edit, Trash2, Plus, Settings, BarChart3 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { initializeAdminData } from '../utils/initAdminData';

const AdminDashboard = () => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [rechargeData, setRechargeData] = useState([]);
  const [showAddPlan, setShowAddPlan] = useState(false);
  const [showEditPlan, setShowEditPlan] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [planForm, setPlanForm] = useState({
    operator: '',
    planId: '',
    amount: '',
    validity: '',
    description: '',
    benefits: '',
    planType: 'fulltt'
  });

  useEffect(() => {
    if (!isAuthenticated) {
      toast.error('Please login to access admin panel');
      navigate('/login');
      return;
    }
    if (user?.role !== 'admin') {
      toast.error('Access denied. Admin privileges required.');
      navigate('/dashboard');
      return;
    }
    // Initialize sample data
    initializeAdminData();
    fetchData();
  }, [user, isAuthenticated, navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast.error('Authentication required');
        navigate('/login');
        return;
      }

      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // Fetch real data from backend
      const [usersRes, statsRes, plansRes, transactionsRes] = await Promise.all([
        fetch('/api/admin/users', { headers }),
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/plans', { headers }),
        fetch('/api/admin/transactions', { headers })
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData.users || []);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }

      if (plansRes.ok) {
        const plansData = await plansRes.json();
        setPlans(plansData || []);
      }

      if (transactionsRes.ok) {
        const transactionsData = await transactionsRes.json();
        const transactions = transactionsData.transactions || [];
        
        // Calculate recharge analytics
        const operatorStats = { 'Airtel': { amount: 0, count: 0 }, 'Jio': { amount: 0, count: 0 }, 'Vi': { amount: 0, count: 0 }, 'BSNL': { amount: 0, count: 0 } };
        transactions.filter(t => t.type === 'recharge').forEach(t => {
          const operator = t.operator || 'Airtel';
          if (operatorStats[operator]) {
            operatorStats[operator].amount += t.amount;
            operatorStats[operator].count += 1;
          }
        });
        
        const totalAmount = Object.values(operatorStats).reduce((sum, op) => sum + op.amount, 0);
        const rechargeAnalytics = Object.entries(operatorStats).map(([operator, stats]) => ({
          operator,
          amount: stats.amount,
          count: stats.count,
          percentage: totalAmount > 0 ? Math.round((stats.amount / totalAmount) * 100) : 25
        }));
        setRechargeData(rechargeAnalytics);
      }
      
    } catch (error) {
      console.error('Admin data error:', error);
      toast.error('Failed to load admin data');
      
      // Fallback to demo data if API fails
      initializeAdminData();
      const adminPlans = JSON.parse(localStorage.getItem('adminPlans') || '[]');
      setPlans(adminPlans);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const benefits = planForm.benefits.split(',').map(b => b.trim());
      const planData = { 
        ...planForm, 
        benefits,
        amount: parseInt(planForm.amount)
      };
      
      const response = await fetch('/api/admin/plans', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
      });
      
      if (response.ok) {
        const newPlan = await response.json();
        setPlans(prev => [newPlan, ...prev]);
        toast.success('Plan added successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to add plan');
      }
      
      setShowAddPlan(false);
      setPlanForm({ operator: '', planId: '', amount: '', validity: '', description: '', benefits: '', planType: 'fulltt' });
    } catch (error) {
      console.error('Plan addition error:', error);
      toast.error('Failed to add plan');
    }
  };

  const handleDeletePlan = async (planId) => {
    if (window.confirm('Are you sure you want to delete this plan?')) {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch(`/api/admin/plans/${planId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          setPlans(prev => prev.filter(plan => plan._id !== planId));
          toast.success('Plan deleted successfully');
        } else {
          const error = await response.json();
          toast.error(error.message || 'Failed to delete plan');
        }
      } catch (error) {
        console.error('Plan deletion error:', error);
        toast.error('Failed to delete plan');
      }
    }
  };

  const handleEditPlan = (plan) => {
    setEditingPlan(plan);
    setPlanForm({
      operator: plan.operator,
      planId: plan.planId,
      amount: plan.amount.toString(),
      validity: plan.validity,
      description: plan.description,
      benefits: plan.benefits.join(', '),
      planType: plan.planType
    });
    setShowEditPlan(true);
  };

  const handleUpdatePlan = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const benefits = planForm.benefits.split(',').map(b => b.trim());
      const planData = { 
        ...planForm, 
        benefits,
        amount: parseInt(planForm.amount)
      };
      
      const response = await fetch(`/api/admin/plans/${editingPlan._id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(planData)
      });
      
      if (response.ok) {
        const updatedPlan = await response.json();
        setPlans(prev => prev.map(plan => 
          plan._id === editingPlan._id ? updatedPlan : plan
        ));
        toast.success('Plan updated successfully');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to update plan');
      }
      
      setShowEditPlan(false);
      setEditingPlan(null);
      setPlanForm({ operator: '', planId: '', amount: '', validity: '', description: '', benefits: '', planType: 'fulltt' });
    } catch (error) {
      console.error('Plan update error:', error);
      toast.error('Failed to update plan');
    }
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You need admin privileges to access this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pattern">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users and monitor system activity</p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'overview'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                User Management
              </button>
              <button
                onClick={() => setActiveTab('plans')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'plans'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Plan Management
              </button>
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'analytics'
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Recharge Analytics
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'overview' && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalUsers || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                    <p className="text-2xl font-bold text-gray-900">₹{stats?.totalRevenue || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Transactions</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalTransactions || 0}</p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Admins</p>
                    <p className="text-2xl font-bold text-gray-900">{stats?.totalAdmins || 0}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-card rounded-xl p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Transactions</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {stats?.recentTransactions?.map((transaction, index) => (
                      <tr key={transaction._id || transaction.id || index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {transaction.type === 'wallet_add' ? 'Wallet Top-up' : transaction.type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ₹{transaction.amount}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            transaction.status === 'success' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(transaction.createdAt || transaction.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {(!stats?.recentTransactions || stats.recentTransactions.length === 0) && (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600">No transactions found</p>
                    <p className="text-sm text-gray-500 mt-2">Transactions will appear here as users make recharges</p>
                  </div>
                )}
              </div>
            </div>
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-card rounded-xl p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">User Management</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Balance
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                              <span className="text-primary-600 font-medium">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          user.role === 'admin' 
                            ? 'bg-purple-100 text-purple-800' 
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{user.balance}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button className="text-indigo-600 hover:text-indigo-900">
                            <Eye className="h-4 w-4" />
                          </button>
                          <button className="text-green-600 hover:text-green-900">
                            <Edit className="h-4 w-4" />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {users.length === 0 && (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No users found</p>
                  <p className="text-sm text-gray-500 mt-2">Registered users will appear here</p>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'plans' && (
          <div className="bg-card rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Plan Management</h2>
              <button
                onClick={() => setShowAddPlan(true)}
                className="btn-primary flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add New Plan
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Plan</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Operator</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {plans.map((plan) => (
                    <tr key={plan._id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{plan.planId}</div>
                          <div className="text-sm text-gray-500">{plan.description}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {plan.operator.replace('_', ' ').toUpperCase()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₹{plan.amount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          plan.planType === 'fulltt' ? 'bg-green-100 text-green-800' :
                          plan.planType === 'data' ? 'bg-blue-100 text-blue-800' :
                          'bg-orange-100 text-orange-800'
                        }`}>
                          {plan.planType === 'fulltt' ? 'Full TT' :
                           plan.planType === 'data' ? 'Data' : 'Top-up'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button 
                            onClick={() => handleEditPlan(plan)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button 
                            onClick={() => handleDeletePlan(plan._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {plans.length === 0 && (
                <div className="text-center py-8">
                  <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No plans found</p>
                  <p className="text-sm text-gray-500 mt-2">Add your first recharge plan using the button above</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Add Plan Modal */}
        {showAddPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Add New Plan</h3>
              <form onSubmit={handleAddPlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                  <select
                    value={planForm.operator}
                    onChange={(e) => setPlanForm({...planForm, operator: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="">Select Operator</option>
                    <option value="airtel_prepaid">Airtel Prepaid</option>
                    <option value="jio_prepaid">Jio Prepaid</option>
                    <option value="vi_prepaid">Vi Prepaid</option>
                    <option value="bsnl_prepaid">BSNL Prepaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan ID</label>
                  <input
                    type="text"
                    value={planForm.planId}
                    onChange={(e) => setPlanForm({...planForm, planId: e.target.value})}
                    className="input"
                    placeholder="e.g., AIR_299"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={planForm.amount}
                    onChange={(e) => setPlanForm({...planForm, amount: e.target.value})}
                    className="input"
                    placeholder="299"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
                  <input
                    type="text"
                    value={planForm.validity}
                    onChange={(e) => setPlanForm({...planForm, validity: e.target.value})}
                    className="input"
                    placeholder="28 days"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={planForm.description}
                    onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                    className="input"
                    placeholder="Unlimited calls + 2GB/day"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (comma separated)</label>
                  <input
                    type="text"
                    value={planForm.benefits}
                    onChange={(e) => setPlanForm({...planForm, benefits: e.target.value})}
                    className="input"
                    placeholder="Unlimited Voice, 2GB Data/day, 100 SMS/day"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                  <select
                    value={planForm.planType}
                    onChange={(e) => setPlanForm({...planForm, planType: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="fulltt">Full Talktime</option>
                    <option value="data">Data Only</option>
                    <option value="topup">Top-up</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddPlan(false)}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Add Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* Analytics Header */}
            <div className="bg-card rounded-xl p-6">
              <div className="flex items-center mb-4">
                <BarChart3 className="h-6 w-6 text-primary-600 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">Recharge Analytics</h2>
              </div>
              <p className="text-gray-600">Monitor recharge patterns and operator performance</p>
            </div>

            {/* Recharge by Operator Chart */}
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Recharge Volume by Operator</h3>
              <div className="space-y-4">
                {rechargeData.map((item, index) => (
                  <div key={item.operator} className="flex items-center">
                    <div className="w-20 text-sm font-medium text-gray-700">
                      {item.operator}
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-gray-200 rounded-full h-6 relative overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${
                            index === 0 ? 'bg-gradient-to-r from-blue-500 to-blue-600' :
                            index === 1 ? 'bg-gradient-to-r from-green-500 to-green-600' :
                            index === 2 ? 'bg-gradient-to-r from-purple-500 to-purple-600' :
                            'bg-gradient-to-r from-orange-500 to-orange-600'
                          }`}
                          style={{ width: `${item.percentage}%` }}
                        ></div>
                        <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-white">
                          {item.percentage}%
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">₹{item.amount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">{item.count} recharges</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <TrendingUp className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Recharge Volume</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{rechargeData.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Recharges</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {rechargeData.reduce((sum, item) => sum + item.count, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-card rounded-xl p-6">
                <div className="flex items-center">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <DollarSign className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Average Recharge</p>
                    <p className="text-2xl font-bold text-gray-900">
                      ₹{rechargeData.reduce((sum, item) => sum + item.count, 0) > 0 
                        ? Math.round(rechargeData.reduce((sum, item) => sum + item.amount, 0) / rechargeData.reduce((sum, item) => sum + item.count, 0))
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Top Performing Plans */}
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(() => {
                  const planStats = {};
                  const allTransactions = stats?.recentTransactions || [];
                  
                  // Add sample data for demonstration
                  const samplePlans = [
                    { amount: 199, count: 24 },
                    { amount: 299, count: 19 },
                    { amount: 399, count: 16 },
                    { amount: 179, count: 22 },
                    { amount: 549, count: 11 },
                    { amount: 155, count: 28 },
                    { amount: 719, count: 9 },
                    { amount: 359, count: 14 }
                  ];
                  
                  // Process sample data
                  samplePlans.forEach(plan => {
                    const planKey = `₹${plan.amount}`;
                    planStats[planKey] = { count: plan.count, total: plan.amount * plan.count };
                  });
                  
                  // Process real transactions
                  allTransactions
                    .filter(t => t.type === 'recharge')
                    .forEach(t => {
                      const planKey = `₹${t.amount}`;
                      if (!planStats[planKey]) {
                        planStats[planKey] = { count: 0, total: 0 };
                      }
                      planStats[planKey].count += 1;
                      planStats[planKey].total += t.amount;
                    });
                    
                  return Object.entries(planStats)
                    .sort(([,a], [,b]) => b.total - a.total)
                    .slice(0, 4)
                    .map(([plan, data], index) => {
                      const colors = [
                        'from-blue-50 to-blue-100 text-blue-800 text-blue-600 text-blue-900',
                        'from-green-50 to-green-100 text-green-800 text-green-600 text-green-900',
                        'from-purple-50 to-purple-100 text-purple-800 text-purple-600 text-purple-900',
                        'from-orange-50 to-orange-100 text-orange-800 text-orange-600 text-orange-900'
                      ];
                      const colorClasses = colors[index].split(' ');
                      
                      return (
                        <div key={plan} className={`bg-gradient-to-r ${colorClasses[0]} ${colorClasses[1]} rounded-lg p-4`}>
                          <div className={`text-sm font-medium ${colorClasses[2]}`}>{plan} Plan</div>
                          <div className={`text-xs ${colorClasses[3]}`}>{data.count} recharges</div>
                          <div className={`text-lg font-bold ${colorClasses[4]}`}>₹{data.total.toLocaleString()}</div>
                        </div>
                      );
                    });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Edit Plan Modal */}
        {showEditPlan && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Edit Plan</h3>
              <form onSubmit={handleUpdatePlan} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Operator</label>
                  <select
                    value={planForm.operator}
                    onChange={(e) => setPlanForm({...planForm, operator: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="">Select Operator</option>
                    <option value="airtel_prepaid">Airtel Prepaid</option>
                    <option value="jio_prepaid">Jio Prepaid</option>
                    <option value="vi_prepaid">Vi Prepaid</option>
                    <option value="bsnl_prepaid">BSNL Prepaid</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan ID</label>
                  <input
                    type="text"
                    value={planForm.planId}
                    onChange={(e) => setPlanForm({...planForm, planId: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount (₹)</label>
                  <input
                    type="number"
                    value={planForm.amount}
                    onChange={(e) => setPlanForm({...planForm, amount: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Validity</label>
                  <input
                    type="text"
                    value={planForm.validity}
                    onChange={(e) => setPlanForm({...planForm, validity: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <input
                    type="text"
                    value={planForm.description}
                    onChange={(e) => setPlanForm({...planForm, description: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Benefits (comma separated)</label>
                  <input
                    type="text"
                    value={planForm.benefits}
                    onChange={(e) => setPlanForm({...planForm, benefits: e.target.value})}
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type</label>
                  <select
                    value={planForm.planType}
                    onChange={(e) => setPlanForm({...planForm, planType: e.target.value})}
                    className="input"
                    required
                  >
                    <option value="fulltt">Full Talktime</option>
                    <option value="data">Data Only</option>
                    <option value="topup">Top-up</option>
                  </select>
                </div>
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowEditPlan(false);
                      setEditingPlan(null);
                      setPlanForm({ operator: '', planId: '', amount: '', validity: '', description: '', benefits: '', planType: 'fulltt' });
                    }}
                    className="btn-secondary flex-1"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn-primary flex-1"
                  >
                    Update Plan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;