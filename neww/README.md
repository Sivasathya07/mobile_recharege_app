# Recharge App - Full Stack Application

A complete mobile recharge and wallet management application built with React.js frontend and Node.js/Express backend with MongoDB.

## Features

### Frontend (React.js)
- Modern UI with Tailwind CSS
- Responsive design for all devices
- User authentication (Login/Register)
- Mobile recharge with multiple operators
- Wallet management system
- Transaction history
- Profile settings with 2FA
- Admin dashboard
- Real-time updates

### Backend (Node.js/Express)
- MongoDB database integration
- JWT authentication
- Password hashing with bcrypt
- 2FA with QR codes
- Payment processing simulation
- Recharge plan management
- Wallet operations
- Transaction tracking
- Security middleware

## Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router DOM
- React Hook Form
- Axios
- React Hot Toast
- Lucide React Icons

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken)
- bcryptjs
- Speakeasy (2FA)
- QRCode generation
- CORS
- dotenv

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Git

### 1. Clone Repository
```bash
git clone <repository-url>
cd neww
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create `.env` file:
```env
MONGODB_URI=mongodb://localhost:27017/recharge-app
JWT_SECRET=your-super-secret-jwt-key-here
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
PORT=5000
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```

### 4. Start Servers

#### Option 1: Use Batch File (Windows)
```bash
# From root directory
start-servers.bat
```

#### Option 2: Manual Start
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user
- `POST /api/auth/enable-2fa` - Enable 2FA
- `POST /api/auth/disable-2fa` - Disable 2FA

### User Management
- `PUT /api/users/profile` - Update profile
- `PUT /api/users/password` - Update password
- `PUT /api/users/preferences` - Update preferences
- `POST /api/users/favorites` - Add favorite number
- `PUT /api/users/favorites/:id` - Update favorite
- `DELETE /api/users/favorites/:id` - Delete favorite

### Recharge
- `GET /api/recharge/plans/:operator` - Get recharge plans
- `POST /api/recharge/process` - Process recharge
- `GET /api/recharge/history` - Get recharge history

### Wallet
- `GET /api/wallet/balance` - Get wallet balance
- `POST /api/wallet/add` - Add money to wallet
- `GET /api/wallet/transactions` - Get wallet transactions
- `GET /api/wallet/all-transactions` - Get all transactions

## Default Credentials

### User Account
- Email: `user@demo.com`
- Password: `password123`

### Admin Account (Keep Secure)
- Email: `superadmin@rechargeapp.com`
- Password: `SuperAdmin@2024!`

## Project Structure

```
neww/
├── backend/
│   ├── models/
│   │   ├── User.js
│   │   └── Transaction.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── users.js
│   │   ├── recharge.js
│   │   └── wallet.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   ├── public/
│   └── package.json
└── README.md
```

## Features in Detail

### 1. User Authentication
- Secure registration and login
- JWT token-based authentication
- Password hashing with bcrypt
- Protected routes

### 2. Mobile Recharge
- Support for multiple operators (Airtel, Jio, Vi, BSNL)
- Prepaid and postpaid plans
- Real-time plan fetching
- Payment via wallet or cards

### 3. Wallet System
- Add money to wallet
- View transaction history
- Real-time balance updates
- Secure payment processing

### 4. Profile Management
- Update personal information
- Change password
- Manage favorite numbers
- Enable/disable 2FA
- Notification preferences

### 5. Admin Features
- User management
- Transaction monitoring
- System analytics
- Plan management

## Security Features

- JWT authentication
- Password hashing
- 2FA with QR codes
- Input validation
- CORS protection
- Rate limiting ready
- Secure headers

## Development

### Adding New Features
1. Create API endpoints in backend
2. Add corresponding frontend services
3. Update UI components
4. Test functionality

### Database Schema
- Users collection with embedded favorites
- Transactions collection for all operations
- Indexes for performance optimization

## Deployment

### Backend Deployment
1. Set environment variables
2. Configure MongoDB connection
3. Deploy to cloud service (Heroku, AWS, etc.)

### Frontend Deployment
1. Update API base URL
2. Build production version: `npm run build`
3. Deploy to hosting service (Netlify, Vercel, etc.)

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Test thoroughly
5. Submit pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue in the repository
- Contact the development team

---

**Note**: This is a demo application. For production use, implement proper payment gateways, enhanced security measures, and production-grade database configurations.