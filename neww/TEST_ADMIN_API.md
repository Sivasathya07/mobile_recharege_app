# Test Admin API Endpoints

## Quick Test - Open Browser Console and Run:

```javascript
// Test 1: Check if backend is accessible
fetch('https://mobile-recharge-backend.onrender.com/api/test')
  .then(r => r.json())
  .then(d => console.log('✅ Backend working:', d))
  .catch(e => console.error('❌ Backend error:', e));

// Test 2: Get all users (no auth needed)
fetch('https://mobile-recharge-backend.onrender.com/api/users/all')
  .then(r => r.json())
  .then(d => console.log('👥 Users:', d))
  .catch(e => console.error('❌ Users error:', e));

// Test 3: Get all plans (no auth needed)
fetch('https://mobile-recharge-backend.onrender.com/api/plans/all')
  .then(r => r.json())
  .then(d => console.log('📋 Plans:', d))
  .catch(e => console.error('❌ Plans error:', e));

// Test 4: Get admin plans (needs auth)
const token = localStorage.getItem('token');
fetch('https://mobile-recharge-backend.onrender.com/api/admin/plans', {
  headers: { 'Authorization': `Bearer ${token}` }
})
  .then(r => r.json())
  .then(d => console.log('📋 Admin Plans:', d))
  .catch(e => console.error('❌ Admin Plans error:', e));
```

## Expected Results:
- Backend working: Should show server info
- Users: Should show count and list of users
- Plans: Should show 100+ plans grouped by operator
- Admin Plans: Should show plans (if authenticated)

## If Tests Fail:
1. Backend might be sleeping (Render free tier)
2. CORS issue
3. Authentication problem
4. Wrong API URL
