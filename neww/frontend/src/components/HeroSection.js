import React, { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Smartphone, Zap, Clock, Wifi, Gift, Star } from 'lucide-react';

const HeroSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const transitionTimeoutRef = useRef(null);

  const slides = [
    {
      badge: 'Limited Time Offer',
      title: '50% OFF',
      subtitle: 'Annual Premium Plans',
      description: 'Unlock unlimited recharges and exclusive benefits with our yearly subscription',
      price: '₹1,999',
      originalPrice: '₹3,999',
      validity: '365 Days',
      data: 'Unlimited',
      features: ['Free Recharges', 'Priority Support', 'Cashback Rewards'],
      gradient: 'from-red-500 to-pink-600'
    },
    {
      badge: 'Flash Sale',
      title: '30% OFF',
      subtitle: 'Monthly Data Plans',
      description: 'Perfect for heavy users with high-speed data and calling benefits',
      price: '₹399',
      originalPrice: '₹599',
      validity: '30 Days',
      data: '2GB/Day',
      features: ['High Speed Data', 'Unlimited Calls', 'SMS Pack'],
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      badge: 'New User Special',
      title: '70% OFF',
      subtitle: 'First Recharge Bonus',
      description: 'Welcome offer for new customers with extra data and validity',
      price: '₹149',
      originalPrice: '₹499',
      validity: '28 Days',
      data: '1.5GB/Day',
      features: ['Welcome Bonus', 'Extra Validity', 'Free SMS'],
      gradient: 'from-green-500 to-teal-600'
    }
  ];

  const goToSlide = (slideIndex) => {
    if (isTransitioning || slideIndex === currentSlide || slideIndex < 0 || slideIndex >= slides.length) return;
    
    // Clear any existing timeout
    if (transitionTimeoutRef.current) {
      clearTimeout(transitionTimeoutRef.current);
    }
    
    setIsTransitioning(true);
    setCurrentSlide(slideIndex);
    
    transitionTimeoutRef.current = setTimeout(() => {
      setIsTransitioning(false);
      transitionTimeoutRef.current = null;
    }, 800);
  };

  const nextSlide = () => {
    if (isTransitioning) return;
    const nextIndex = currentSlide === slides.length - 1 ? 0 : currentSlide + 1;
    goToSlide(nextIndex);
  };

  const prevSlide = () => {
    if (isTransitioning) return;
    const prevIndex = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;
    goToSlide(prevIndex);
  };

  return (
    <div className="hero-container">
      <div className="hero-wrapper">
        <div className="carousel-wrapper">
          <div 
            className="carousel-track"
            style={{ transform: `translateX(-${currentSlide * 33.333}%)` }}
          >
            {slides.map((slide, index) => (
              <div key={index} className="carousel-slide">
                <div className="hero-content">
                  {/* Left Content */}
                  <div className="hero-left">
                    <div className="hero-badge">
                      <Star className="w-4 h-4 mr-1" />
                      {slide.badge}
                    </div>
                    <h1 className="hero-title">
                      {slide.title}
                    </h1>
                    <h2 className="hero-subtitle">
                      {slide.subtitle}
                    </h2>
                    <p className="hero-description">
                      {slide.description}
                    </p>
                    <div className="hero-features">
                      {slide.features.map((feature, idx) => (
                        <span key={idx} className="feature-tag">
                          {feature}
                        </span>
                      ))}
                    </div>
                    <div className="hero-buttons">
                      <button 
                        className="btn-claim"
                        onClick={() => window.location.href = '/recharge'}
                        type="button"
                      >
                        Claim Now
                      </button>
                      <button 
                        className="btn-learn"
                        onClick={() => window.location.href = '/plans'}
                        type="button"
                      >
                        Learn More
                      </button>
                    </div>
                  </div>

                  {/* Right Content - Phone Mockup */}
                  <div className="hero-right">
                    <div className="phone-mockup">
                      <div className="phone-frame">
                        <div className={`phone-screen phone-screen-slide-${index}`}>
                          <div className="phone-header">
                            <div className="flex items-center">
                              <Smartphone className="w-5 h-5" />
                            </div>
                            <div className="flex space-x-1">
                              <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                              <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                              <div className="w-1 h-3 bg-green-400 rounded-full"></div>
                            </div>
                          </div>
                          
                          <div className="phone-content">
                            <div className="plan-title">₹{slide.price.replace('₹', '')} Plan</div>
                            <div className="plan-subtitle">{slide.data} • {slide.validity}</div>
                            
                            <div className="app-grid">
                              <div className="app-icon"><Smartphone className="w-6 h-6" /></div>
                              <div className="app-icon"><Wifi className="w-6 h-6" /></div>
                              <div className="app-icon"><Clock className="w-6 h-6" /></div>
                              <div className="app-icon"><Zap className="w-6 h-6" /></div>
                              <div className="app-icon"><Gift className="w-6 h-6" /></div>
                              <div className="app-icon"><Star className="w-6 h-6" /></div>
                            </div>
                            
                            <div className="special-offer">
                              <div className="offer-text">
                                <Star className="w-5 h-5 mr-2" />
                                Special Offer!
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <button 
          className="nav-btn nav-prev" 
          onClick={prevSlide}
          disabled={isTransitioning}
          type="button"
        >
          <ChevronLeft />
        </button>
        <button 
          className="nav-btn nav-next" 
          onClick={nextSlide}
          disabled={isTransitioning}
          type="button"
        >
          <ChevronRight />
        </button>

        {/* Dots Indicator */}
        <div className="hero-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentSlide ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
              disabled={isTransitioning}
              type="button"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;