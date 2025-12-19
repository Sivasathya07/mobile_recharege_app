import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { userAPI, authAPI } from '../services/api';
import { validatePassword, getPasswordStrength } from '../utils/passwordValidation';
import toast from 'react-hot-toast';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  Shield, 
  Star,
  Trash2,
  Edit,
  Settings,
  Lock
} from 'lucide-react';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [editingFavorite, setEditingFavorite] = useState(null);
  const [passwordData, setPasswordData] = useState({ current: '', new: '', confirm: '' });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(null);

  useEffect(() => {
    if (passwordData.new) {
      setPasswordStrength(getPasswordStrength(passwordData.new));
    }
  }, [passwordData.new]);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.favorites) {
      setFavorites(user.favorites);
    }
  }, [user]);

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm({
    mode: 'onChange'
  });

  // Clear form completely when component mounts and when user changes
  useEffect(() => {
    reset({
      name: '',
      email: '',
      phone: ''
    });
    
    // Clear all form inputs on the page
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.value = '';
      input.removeAttribute('value');
    });
  }, [reset, user?.id]);

  // Set form values only when user data is available
  useEffect(() => {
    if (user) {
      setTimeout(() => {
        setValue('name', user.name || '');
        setValue('email', user.email || '');
        setValue('phone', user.phone || '');
      }, 100);
    }
  }, [user, setValue]);

  const tabs = [
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'favorites', name: 'Favorites', icon: Star },
    { id: 'preferences', name: 'Preferences', icon: Settings },
    { id: 'security', name: 'Security', icon: Shield }
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      updateUser(data);
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Update failed');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        updateUser({ avatar: e.target.result });
        toast.success('Avatar updated successfully');
      };
      reader.readAsDataURL(file);
    } catch (error) {
      toast.error('Avatar upload failed');
    }
  };

  const removeFavorite = async (favoriteId) => {
    try {
      const response = await userAPI.deleteFavorite(favoriteId);
      setFavorites(response.data);
      toast.success('Favorite removed');
    } catch (error) {
      toast.error('Failed to remove favorite');
    }
  };

  const editFavorite = (favorite) => {
    setEditingFavorite(favorite);
  };

  const saveFavorite = async (updatedFavorite) => {
    try {
      const response = await userAPI.updateFavorite(updatedFavorite._id, updatedFavorite);
      setFavorites(response.data);
      setEditingFavorite(null);
      toast.success('Favorite updated successfully');
    } catch (error) {
      toast.error('Failed to update favorite');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.new !== passwordData.confirm) {
      toast.error('New passwords do not match');
      return;
    }
    
    const validation = validatePassword(passwordData.new);
    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }
    
    setPasswordLoading(true);
    try {
      await userAPI.updatePassword({
        currentPassword: passwordData.current,
        newPassword: passwordData.new
      });
      toast.success('Password updated successfully');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      const message = error.response?.data?.message || 'Password update failed';
      toast.error(message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const toggleTwoFactor = async () => {
    try {
      if (twoFactorEnabled) {
        await authAPI.disable2FA();
        setTwoFactorEnabled(false);
        toast.success('2FA disabled successfully');
      } else {
        const response = await authAPI.enable2FA();
        setTwoFactorEnabled(true);
        toast.success('2FA enabled successfully');
        if (response.data.qrCode) {
          // Show QR code in a modal or new window
          console.log('QR Code:', response.data.qrCode);
        }
      }
    } catch (error) {
      const message = error.response?.data?.message || '2FA toggle failed';
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-animated relative p-6">
      <div className="floating-shapes"></div>
      <div className="max-w-4xl mx-auto space-y-6 relative z-10">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600">Manage your account settings and preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="bg-card rounded-xl p-6">
          <nav className="flex space-x-8 border-b border-gray-200 pb-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-4 font-medium text-sm flex items-center rounded-lg transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-purple-100 text-purple-600 shadow-md'
                    : 'text-gray-500 hover:text-purple-600 hover:bg-purple-50'
                }`}
              >
                <tab.icon className="h-4 w-4 mr-2" />
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="bg-card rounded-xl p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center overflow-hidden">
                  {user?.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User className="h-10 w-10 text-white" />
                  )}
                </div>
                <label className="absolute bottom-0 right-0 bg-purple-600 text-white p-2 rounded-full cursor-pointer hover:bg-purple-700 transform hover:scale-110 transition-all">
                  <Camera className="h-4 w-4" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarUpload}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{user?.name}</h2>
                <p className="text-gray-600">{user?.email}</p>
                <div className="flex items-center mt-2">
                  <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                  <span className="text-sm text-gray-600 font-medium">Verified Account</span>
                </div>
                <div className="mt-3 p-3 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg">
                  <p className="text-sm text-gray-600">Wallet Balance</p>
                  <p className="text-xl font-bold text-purple-600">₹{user?.balance || 0}</p>
                </div>
              </div>
            </div>

            <form key={user?.id || 'no-user'} onSubmit={handleSubmit(onSubmit)} className="space-y-6" autoComplete="off">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    {...register('name', { required: 'Name is required' })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    {...register('email')}
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl bg-gray-50"
                    disabled
                  />
                </div>
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                  <input
                    {...register('phone', {
                      pattern: {
                        value: /^[6-9]\d{9}$/,
                        message: 'Invalid phone number'
                      }
                    })}
                    className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none transition-colors"
                  />
                </div>
                {errors.phone && <p className="text-sm text-red-600 mt-1">{errors.phone.message}</p>}
              </div>

              <button type="submit" disabled={loading} className="btn-primary w-full py-3">
                {loading ? 'Updating...' : 'Update Profile'}
              </button>
            </form>
          </div>
        )}

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="bg-card rounded-xl p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Favorite Numbers</h3>
            
            {favorites.length > 0 ? (
              <div className="space-y-4">
                {favorites.map((favorite) => (
                  <div key={favorite._id || favorite.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                        <Star className="h-6 w-6 text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{favorite.nickname}</p>
                        <p className="text-sm text-gray-600">{favorite.number} • {favorite.operator}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => editFavorite(favorite)}
                        className="px-3 py-1 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => removeFavorite(favorite._id || favorite.id)}
                        className="px-3 py-1 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <Star className="h-16 w-16 text-purple-300 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No favorite numbers added yet</p>
              </div>
            )}
            
            {/* Edit Favorite Modal */}
            {editingFavorite && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
                  <h4 className="text-lg font-bold text-gray-900 mb-4">Edit Favorite</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Nickname</label>
                      <input
                        type="text"
                        value={editingFavorite.nickname}
                        onChange={(e) => setEditingFavorite({...editingFavorite, nickname: e.target.value})}
                        className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input
                        type="text"
                        value={editingFavorite.number}
                        onChange={(e) => setEditingFavorite({...editingFavorite, number: e.target.value})}
                        className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
                      <select
                        value={editingFavorite.operator}
                        onChange={(e) => setEditingFavorite({...editingFavorite, operator: e.target.value})}
                        className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none"
                      >
                        <option value="Airtel">Airtel</option>
                        <option value="Jio">Jio</option>
                        <option value="Vi">Vi</option>
                        <option value="BSNL">BSNL</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex space-x-3 mt-6">
                    <button
                      onClick={() => saveFavorite(editingFavorite)}
                      className="flex-1 btn-primary py-2"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditingFavorite(null)}
                      className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Preferences Tab */}
        {activeTab === 'preferences' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Notifications</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Email Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">SMS Notifications</p>
                    <p className="text-sm text-gray-600">Receive updates via SMS</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-purple-600"></div>
                  </label>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Language & Region</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none">
                    <option>English</option>
                    <option>Hindi</option>
                    <option>Tamil</option>
                    <option>Telugu</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                  <select className="w-full p-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none">
                    <option>INR (₹)</option>
                    <option>USD ($)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
              <form onSubmit={handlePasswordUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <input 
                      type="password" 
                      value={passwordData.current}
                      onChange={(e) => setPasswordData({...passwordData, current: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none" 
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <input 
                      type="password" 
                      value={passwordData.new}
                      onChange={(e) => setPasswordData({...passwordData, new: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none" 
                      required
                      placeholder="Enter strong password"
                    />
                  </div>
                  {passwordData.new && passwordStrength && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between text-xs">
                        <span>Password Strength:</span>
                        <span className={`font-medium ${
                          passwordStrength.color === 'red' ? 'text-red-600' :
                          passwordStrength.color === 'orange' ? 'text-orange-600' :
                          'text-green-600'
                        }`}>
                          {passwordStrength.strength}
                        </span>
                      </div>
                      <div className="mt-1 w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className={`h-1 rounded-full transition-all duration-300 ${
                            passwordStrength.color === 'red' ? 'bg-red-500' :
                            passwordStrength.color === 'orange' ? 'bg-orange-500' :
                            'bg-green-500'
                          }`}
                          style={{ 
                            width: passwordStrength.strength === 'Weak' ? '25%' : 
                                   passwordStrength.strength === 'Medium' ? '50%' : 
                                   passwordStrength.strength === 'Strong' ? '75%' : '100%' 
                          }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-400" />
                    <input 
                      type="password" 
                      value={passwordData.confirm}
                      onChange={(e) => setPasswordData({...passwordData, confirm: e.target.value})}
                      className="w-full pl-12 pr-4 py-3 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none" 
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit" 
                  disabled={passwordLoading}
                  className="btn-primary w-full py-3"
                >
                  {passwordLoading ? 'Updating...' : 'Update Password'}
                </button>
              </form>
            </div>
            
            <div className="bg-card rounded-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-6">Two-Factor Authentication</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">
                    {twoFactorEnabled ? 'Disable 2FA' : 'Enable 2FA'}
                  </p>
                  <p className="text-sm text-gray-600">
                    {twoFactorEnabled ? 'Remove extra security from your account' : 'Add extra security to your account'}
                  </p>
                </div>
                <button 
                  onClick={toggleTwoFactor}
                  className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                    twoFactorEnabled 
                      ? 'bg-red-600 hover:bg-red-700 text-white' 
                      : 'btn-primary'
                  }`}
                >
                  {twoFactorEnabled ? 'Disable' : 'Enable'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;