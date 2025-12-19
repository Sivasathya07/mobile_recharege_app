import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Banner from '../components/Banner';
import RollingBanner from '../components/RollingBanner';
import HeroSection from '../components/HeroSection';
import TestimonialSection from '../components/TestimonialSection';
import { 
  Smartphone, 
  Tv, 
  Zap, 
  Wifi, 
  Shield, 
  Clock, 
  CreditCard,
  Users,
  ArrowRight,
  CheckCircle,
  Star,
  Gift,
  
  
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [selectedService, setSelectedService] = useState('mobile');

  const services = [
    {
      icon: Smartphone,
      title: 'Mobile Recharge',
      description: 'Instant mobile recharge for all operators',
      color: 'from-primary-400 to-primary-500'
    },
    {
      icon: Tv,
      title: 'DTH Recharge',
      description: 'Quick DTH and cable TV recharges',
      color: 'from-primary-500 to-primary-600'
    },
    {
      icon: Zap,
      title: 'Electricity Bills',
      description: 'Pay electricity bills instantly',
      color: 'from-primary-600 to-primary-700'
    },
    {
      icon: Wifi,
      title: 'Broadband Bills',
      description: 'Internet and broadband bill payments',
      color: 'from-primary-700 to-primary-800'
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Secure Payments',
      description: 'Bank-grade security for all transactions'
    },
    {
      icon: Clock,
      title: 'Instant Processing',
      description: 'Lightning-fast recharge processing'
    },
    {
      icon: CreditCard,
      title: 'Multiple Payment Options',
      description: 'UPI, Cards, Net Banking & Wallet'
    },
    {
      icon: Users,
      title: '24/7 Support',
      description: 'Round-the-clock customer support'
    }
  ];

  return (
    <div className="min-h-screen">
      <RollingBanner />
      <HeroSection />
      {/* Hero Section */}
      <section className="relative min-h-screen bg-gradient-to-r from-pink-500 via-rose-400 to-orange-400 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-full h-full bg-black opacity-10"></div>
        </div>
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-r from-primary-400 to-primary-500 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-r from-accent-400 to-accent-500 rounded-full opacity-15 animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-20 h-20 bg-gradient-to-r from-primary-400 to-accent-400 rounded-full opacity-10 animate-bounce delay-1000"></div>
        
        <div className="max-w-6xl mx-auto px-4 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-screen">
            
            <div className="text-white">
              <div className="inline-flex items-center bg-white bg-opacity-10 rounded-full px-4 py-2 mb-6">
                <Star className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-sm">India's #1 Recharge Platform</span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-white to-primary-200 bg-clip-text text-transparent">
                  Instant
                </span>
                <br />
                <span className="bg-gradient-to-r from-primary-300 to-accent-300 bg-clip-text text-transparent">
                  Recharges
                </span>
              </h1>
              
              <p className="text-xl text-gray-200 mb-8 leading-relaxed">
                Recharge mobile, DTH, pay bills instantly with cashback rewards. 
                <span className="text-yellow-300 font-semibold">No login required to browse!</span>
              </p>
              
              <div className="flex flex-wrap gap-4 mb-8">
                <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                  <CheckCircle className="h-5 w-5 text-primary-400 mr-2" />
                  <span className="text-sm">Instant Processing</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                  <Shield className="h-5 w-5 text-accent-400 mr-2" />
                  <span className="text-sm">100% Secure</span>
                </div>
                <div className="flex items-center bg-white bg-opacity-10 rounded-lg px-4 py-2">
                  <Gift className="h-5 w-5 text-primary-400 mr-2" />
                  <span className="text-sm">Cashback Rewards</span>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/recharge" className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-8 rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center">
                  <Smartphone className="mr-2 h-5 w-5" />
                  Start Recharging
                </Link>
                {!isAuthenticated && (
                  <Link to="/register" className="border-2 border-white text-white hover:bg-white hover:text-purple-900 font-semibold py-4 px-8 rounded-full transition-all duration-300 flex items-center justify-center">
                    Create Account
                  </Link>
                )}
              </div>
            </div>
            
            <div className="relative">
              <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-3xl p-8 border border-white border-opacity-20">
                <h3 className="text-2xl font-bold text-white mb-6 text-center">Choose Your Service</h3>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { id: 'mobile', icon: Smartphone, name: 'Mobile', color: 'from-primary-400 to-primary-500' },
                    { id: 'dth', icon: Tv, name: 'DTH TV', color: 'from-primary-500 to-primary-600' },
                    { id: 'electricity', icon: Zap, name: 'Electricity', color: 'from-primary-600 to-primary-700' },
                    { id: 'broadband', icon: Wifi, name: 'Broadband', color: 'from-primary-700 to-primary-800' }
                  ].map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                        selectedService === service.id
                          ? `bg-gradient-to-r ${service.color} shadow-2xl`
                          : 'bg-white bg-opacity-10 hover:bg-opacity-20'
                      }`}
                    >
                      <service.icon className="h-8 w-8 text-white mx-auto mb-2" />
                      <p className="text-white font-medium text-sm">{service.name}</p>
                    </button>
                  ))}
                </div>
                
                <Link 
                  to={`/plans?type=${selectedService}`}
                  className="w-full bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  Explore {selectedService.charAt(0).toUpperCase() + selectedService.slice(1)} Plans
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-20 bg-pattern">
        <div className="max-w-6xl mx-auto px-4">
          <Banner />

          <div className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-100">
            <div className="text-center mb-8">
              <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-2 rounded-full mb-4">
                <Smartphone className="h-5 w-5 mr-2" />
                <span className="font-semibold">Quick Recharge</span>
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">Recharge in 30 Seconds</h2>
              <p className="text-gray-600">No registration required • Browse all plans • Pay only when ready</p>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <div className="grid md:grid-cols-4 gap-4">
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Mobile Number" 
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                
                <select className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors">
                  <option value="">Select Operator</option>
                  <option value="airtel_prepaid">Airtel Prepaid</option>
                  <option value="jio_prepaid">Jio Prepaid</option>
                  <option value="vi_prepaid">Vi Prepaid</option>
                  <option value="bsnl_prepaid">BSNL Prepaid</option>
                  <option value="airtel_postpaid">Airtel Postpaid</option>
                </select>
                
                <div className="relative">
                  <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input 
                    type="number" 
                    placeholder="Amount" 
                    className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                  />
                </div>
                
                <Link 
                  to="/recharge" 
                  className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 flex items-center justify-center shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Browse Plans
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Our Services</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Complete recharge and bill payment solutions for all your needs
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 text-center p-8 border border-gray-100 transform hover:-translate-y-2">
                <div className={`bg-gradient-to-r ${service.color} w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg`}>
                  <service.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">{service.title}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link to={`/plans?type=${service.title.toLowerCase().includes('mobile') ? 'mobile' : service.title.toLowerCase().includes('dth') ? 'dth' : service.title.toLowerCase().includes('electricity') ? 'electricity' : 'broadband'}`} className="inline-flex items-center text-blue-600 font-semibold hover:text-blue-700">
                  Explore Plans <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience the best in class recharge and payment services
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-accent-600 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-primary-200">Happy Customers</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">50M+</div>
              <div className="text-primary-200">Transactions</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.9%</div>
              <div className="text-primary-200">Success Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">24/7</div>
              <div className="text-primary-200">Support</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialSection />

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join millions of users who trust us for their recharge and bill payment needs
          </p>
          {!isAuthenticated && (
            <Link to="/register" className="btn-primary text-lg px-8 py-3">
              Create Free Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
