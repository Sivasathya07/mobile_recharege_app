import React from 'react';
import { Link } from 'react-router-dom';
import { Gift, Smartphone, Zap, CreditCard, ArrowRight } from 'lucide-react';

const Banner = () => {
  return (
    <div className="py-8">
      {/* Main Promotional Banner */}
      <div className="banner-bg rounded-3xl p-8 text-white mb-8 relative overflow-hidden">
        <div className="relative z-10">
          <div className="flex items-center mb-6">
            <Gift className="h-12 w-12 mr-4" />
            <div>
              <h2 className="text-3xl font-bold mb-2">Special Cashback Offers</h2>
              <p className="text-lg opacity-90">Limited time deals - Don't miss out!</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Smartphone className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">Mobile Recharge</h3>
              <p className="text-sm opacity-90">Up to 5% cashback</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <Zap className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">Bill Payments</h3>
              <p className="text-sm opacity-90">Instant rewards</p>
            </div>
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4">
              <CreditCard className="h-6 w-6 mb-2" />
              <h3 className="font-semibold mb-1">First Recharge</h3>
              <p className="text-sm opacity-90">Extra 10% off</p>
            </div>
          </div>
          <Link 
            to="/recharge" 
            className="inline-flex items-center mt-6 bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full font-semibold hover:bg-white/30 transition-all"
          >
            Start Recharging <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </div>
      </div>

      {/* Service Banners */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-20 h-20 bg-white opacity-10 rounded-full -mr-10 -mt-10"></div>
          <Smartphone className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Mobile</h3>
          <p className="text-sm opacity-90 mb-3">All operators</p>
          <Link to="/recharge?type=mobile" className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            Recharge Now
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-accent-500 to-accent-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white opacity-10 rounded-full -ml-8 -mb-8"></div>
          <Zap className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Electricity</h3>
          <p className="text-sm opacity-90 mb-3">Pay bills instantly</p>
          <Link to="/recharge?type=electricity" className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            Pay Now
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl p-6 text-primary-900 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-12 h-12 bg-primary-900 opacity-10 rounded-full -ml-6 -mt-6"></div>
          <Gift className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Offers</h3>
          <p className="text-sm opacity-90 mb-3">Exclusive deals</p>
          <Link to="/plans" className="text-xs font-semibold bg-primary-900/20 px-3 py-1 rounded-full">
            View All
          </Link>
        </div>
        
        <div className="bg-gradient-to-br from-accent-400 to-primary-500 rounded-2xl p-6 text-white relative overflow-hidden">
          <div className="absolute bottom-0 right-0 w-14 h-14 bg-white opacity-10 rounded-full -mr-7 -mb-7"></div>
          <CreditCard className="h-8 w-8 mb-3" />
          <h3 className="text-lg font-bold mb-2">Wallet</h3>
          <p className="text-sm opacity-90 mb-3">Add money</p>
          <Link to="/wallet" className="text-xs font-semibold bg-white/20 px-3 py-1 rounded-full">
            Add Money
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Banner;