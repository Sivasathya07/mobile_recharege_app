// Initialize admin dashboard with sample data
export const initializeAdminData = () => {
  // Check if admin plans already exist
  const existingPlans = localStorage.getItem('adminPlans');
  
  if (!existingPlans || JSON.parse(existingPlans).length === 0) {
    const samplePlans = [
      {
        _id: 'admin_1',
        operator: 'airtel_prepaid',
        planId: 'AIR_ADMIN_199',
        amount: 199,
        validity: '28 days',
        description: 'Admin Special - Unlimited calls + 1.5GB/day',
        benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Admin Added'],
        planType: 'fulltt',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'admin_2',
        operator: 'jio_prepaid',
        planId: 'JIO_ADMIN_249',
        amount: 249,
        validity: '28 days',
        description: 'Admin Special - Unlimited calls + 2GB/day',
        benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps', 'Admin Added'],
        planType: 'fulltt',
        createdAt: new Date().toISOString()
      },
      {
        _id: 'admin_3',
        operator: 'vi_prepaid',
        planId: 'VI_ADMIN_99',
        amount: 99,
        validity: '28 days',
        description: 'Admin Data Pack - 6GB Data',
        benefits: ['6GB Data', 'No Voice/SMS', 'Admin Added'],
        planType: 'data',
        createdAt: new Date().toISOString()
      }
    ];
    
    localStorage.setItem('adminPlans', JSON.stringify(samplePlans));
    console.log('Admin sample plans initialized');
  }
  
  // Initialize global transactions if none exist
  const existingTransactions = localStorage.getItem('adminGlobalTransactions');
  
  if (!existingTransactions || JSON.parse(existingTransactions).length === 0) {
    const sampleTransactions = [
      {
        id: Date.now() - 1000,
        type: 'recharge',
        amount: 299,
        status: 'success',
        date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        description: 'Recharge for 9876543210',
        operator: 'Airtel',
        userName: 'Demo User',
        userEmail: 'user@demo.com'
      },
      {
        id: Date.now() - 2000,
        type: 'wallet_add',
        amount: 500,
        status: 'success',
        date: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        description: 'Money added to wallet',
        userName: 'Demo User',
        userEmail: 'user@demo.com'
      },
      {
        id: Date.now() - 3000,
        type: 'recharge',
        amount: 179,
        status: 'success',
        date: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        description: 'Recharge for 9123456789',
        operator: 'Jio',
        userName: 'Test User',
        userEmail: 'test@example.com'
      }
    ];
    
    localStorage.setItem('adminGlobalTransactions', JSON.stringify(sampleTransactions));
    console.log('Admin sample transactions initialized');
  }
};