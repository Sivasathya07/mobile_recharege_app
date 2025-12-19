import React from 'react';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold mb-4">Recharge App</h3>
            <p className="text-gray-400 mb-4">
              Your trusted partner for mobile recharge, bill payments, and wallet management.
            </p>
            <div className="flex items-center text-gray-400 mb-2">
              <Phone className="h-4 w-4 mr-2" />
              <span>+91 98765 43210</span>
            </div>
            <div className="flex items-center text-gray-400 mb-2">
              <Mail className="h-4 w-4 mr-2" />
              <span>support@rechargeapp.com</span>
            </div>
            <div className="flex items-center text-gray-400">
              <MapPin className="h-4 w-4 mr-2" />
              <span>Bangalore, India</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="/recharge" className="hover:text-white transition-colors">Mobile Recharge</a></li>
              <li><a href="/wallet" className="hover:text-white transition-colors">Wallet</a></li>
              <li><a href="/history" className="hover:text-white transition-colors">Transaction History</a></li>
              <li><a href="/plans" className="hover:text-white transition-colors">Recharge Plans</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Mobile Prepaid</li>
              <li>Mobile Postpaid</li>
              <li>DTH Recharge</li>
              <li>Electricity Bills</li>
              <li>Broadband Bills</li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
              <li>Refund Policy</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-8 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2024 Recharge App. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;