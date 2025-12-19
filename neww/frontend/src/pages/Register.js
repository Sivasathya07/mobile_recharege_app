import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import { validatePassword, getPasswordStrength } from '../utils/passwordValidation';
import { Eye, EyeOff, Smartphone, Mail, Lock, User, Phone } from 'lucide-react';

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm({
    mode: 'onChange'
  });

  const watchedName = watch('name');
  const watchedEmail = watch('email');
  const watchedPhone = watch('phone');
  const watchedTerms = watch('terms');
  const { register: registerUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Clear form when component mounts
  React.useEffect(() => {
    reset();
  }, [reset]);

  const watchedPassword = watch('password', '');

  // Also watch the actual input value for password strength
  const [currentPassword, setCurrentPassword] = useState('');

  // Clear password strength when no password
  React.useEffect(() => {
    if (!currentPassword) {
      setPasswordStrength(null);
      setPassword('');
    }
  }, [currentPassword]);

  React.useEffect(() => {
    if (watchedPassword) {
      setPassword(watchedPassword);
      setPasswordStrength(getPasswordStrength(watchedPassword));
    }
  }, [watchedPassword]);

  React.useEffect(() => {
    if (currentPassword) {
      setPassword(currentPassword);
      setPasswordStrength(getPasswordStrength(currentPassword));
    }
  }, [currentPassword]);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const onSubmit = async (data) => {
    setLoading(true);
    // Set default role as user for all registrations
    const userData = { ...data, role: 'user' };
    const result = await registerUser(userData);
    if (result.success) {
      navigate('/dashboard');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pattern py-12 px-4 sm:px-6 lg:px-8 relative">
      <div className="floating-shapes"></div>
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-primary-600 p-3 rounded-full">
              <Smartphone className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              sign in to existing account
            </Link>
          </p>
        </div>

        <div className="bg-card rounded-xl shadow-xl p-6 relative z-10">
          <form key="register-form" className="space-y-6" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('name', {
                    required: 'Name is required',
                    minLength: {
                      value: 2,
                      message: 'Name must be at least 2 characters'
                    }
                  })}
                  type="text"
                  className="input pl-10"
                  placeholder="Enter your full name"
                  autoComplete="off"
                />
              </div>
              {errors.name && (watchedName || errors.name.type !== 'required') && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('email', {
                    required: 'Email is required',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                      message: 'Invalid email address'
                    }
                  })}
                  type="email"
                  className="input pl-10"
                  placeholder="Enter your email"
                  autoComplete="off"
                />
              </div>
              {errors.email && (watchedEmail || errors.email.type !== 'required') && (
                <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone', {
                    required: 'Phone number is required',
                    pattern: {
                      value: /^[6-9]\d{9}$/,
                      message: 'Invalid phone number'
                    }
                  })}
                  type="tel"
                  className="input pl-10"
                  placeholder="Enter your phone number"
                  autoComplete="off"
                />
              </div>
              {errors.phone && (watchedPhone || errors.phone.type !== 'required') && (
                <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
              )}
            </div>



            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('password', {
                    required: 'Password is required',
                    validate: (value) => {
                      const validation = validatePassword(value);
                      return validation.isValid || validation.errors[0];
                    }
                  })}
                  type={showPassword ? 'text' : 'password'}
                  className="input pl-10 pr-10"
                  placeholder="Create a strong password"
                  autoComplete="new-password"
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                  }}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
              )}
              {(password || currentPassword) && passwordStrength && (
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Password Strength:</span>
                    <span className={`font-medium text-${passwordStrength.color}-600`}>
                      {passwordStrength.strength}
                    </span>
                  </div>
                  <div className="mt-1 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full bg-${passwordStrength.color}-500 transition-all duration-300`}
                      style={{ 
                        width: passwordStrength.strength === 'Weak' ? '25%' : 
                               passwordStrength.strength === 'Medium' ? '50%' : 
                               passwordStrength.strength === 'Strong' ? '75%' : '100%' 
                      }}
                    ></div>
                  </div>
                  <div className="mt-2 text-xs text-gray-600">
                    <p>Password must contain:</p>
                    <ul className="list-disc list-inside mt-1 space-y-1">
                      <li className={(password || currentPassword).length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                        At least 8 characters
                      </li>
                      <li className={/[a-z]/.test(password || currentPassword) ? 'text-green-600' : 'text-gray-500'}>
                        One lowercase letter
                      </li>
                      <li className={/[A-Z]/.test(password || currentPassword) ? 'text-green-600' : 'text-gray-500'}>
                        One uppercase letter
                      </li>
                      <li className={/\d/.test(password || currentPassword) ? 'text-green-600' : 'text-gray-500'}>
                        One number
                      </li>
                      <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password || currentPassword) ? 'text-green-600' : 'text-gray-500'}>
                        One special character
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center">
              <input
                {...register('terms', {
                  required: 'You must accept the terms and conditions'
                })}
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                I agree to the{' '}
                <Link to="/terms" className="text-primary-600 hover:text-primary-500">
                  Terms and Conditions
                </Link>{' '}
                and{' '}
                <Link to="/privacy" className="text-primary-600 hover:text-primary-500">
                  Privacy Policy
                </Link>
              </label>
            </div>
            {errors.terms && (watchedTerms || errors.terms.type !== 'required') && (
              <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex justify-center py-3"
            >
              {loading ? (
                <div className="loading-spinner"></div>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Benefits of joining</span>
              </div>
            </div>

            <div className="mt-4 space-y-2">
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Instant recharges and bill payments
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Cashback and rewards on every transaction
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                Secure wallet and payment options
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                24/7 customer support
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;