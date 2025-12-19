import React from 'react';
import { Gift, Zap, Smartphone, CreditCard, Star, TrendingUp } from 'lucide-react';

const RollingBanner = () => {
  const offers = [
    { icon: Gift, text: "Get 5% Cashback on Mobile Recharge" },
    { icon: Zap, text: "Instant Bill Payments Available" },
    { icon: Smartphone, text: "All Operators Supported" },
    { icon: CreditCard, text: "Secure Payment Gateway" },
    { icon: Star, text: "Rated #1 Recharge Platform" },
    { icon: TrendingUp, text: "Save More with Best Plans" }
  ];

  return (
    <div className="rolling-banner py-3 text-white font-semibold">
      <div className="rolling-content">
        {offers.map((offer, index) => (
          <span key={index} className="inline-flex items-center mx-8">
            <offer.icon className="h-4 w-4 mr-2" />
            {offer.text}
          </span>
        ))}
        {/* Duplicate for seamless loop */}
        {offers.map((offer, index) => (
          <span key={`dup-${index}`} className="inline-flex items-center mx-8">
            <offer.icon className="h-4 w-4 mr-2" />
            {offer.text}
          </span>
        ))}
      </div>
    </div>
  );
};

export default RollingBanner;