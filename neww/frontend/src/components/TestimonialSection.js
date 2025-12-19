import React from 'react';
import { Star } from 'lucide-react';

const TestimonialSection = () => {
  const testimonials = [
    {
      id: 1,
      name: 'Priya Sharma',
      rating: 5,
      review: 'Amazing service! Instant recharges and great cashback offers. I\'ve been using this for 2 years and never faced any issues.',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiNGMzY4QTciLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjYwIiByPSIyNSIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0zNSAxMjBDMzUgMTA1IDUwIDkwIDc1IDkwUzExNSAxMDUgMTE1IDEyMFYxNTBIMzVWMTIwWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=='
    },
    {
      id: 2,
      name: 'Rajesh Kumar',
      rating: 5,
      review: 'Super fast recharges and excellent customer support. The app is user-friendly and I love the automatic plan suggestions.',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiM2MzY2RjEiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjYwIiByPSIyNSIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0zNSAxMjBDMzUgMTA1IDUwIDkwIDc1IDkwUzExNSAxMDUgMTE1IDEyMFYxNTBIMzVWMTIwWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=='
    },
    {
      id: 3,
      name: 'Anita Patel',
      rating: 5,
      review: 'Best recharge platform ever! Secure payments, instant processing, and amazing deals. Highly recommended to everyone.',
      avatar: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiMxMEI5ODEiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjYwIiByPSIyNSIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0zNSAxMjBDMzUgMTA1IDUwIDkwIDc1IDkwUzExNSAxMDUgMTE1IDEyMFYxNTBIMzVWMTIwWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg=='
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`w-5 h-5 ${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="testimonial-section">
      <div className="max-w-6xl mx-auto px-4 py-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="testimonial-title">
            What Our Users Say
          </h2>
          <p className="testimonial-subtitle">
            Join millions of satisfied customers who trust us for their recharge needs
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="testimonial-card">
              {/* Star Rating */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-1">
                  {renderStars(testimonial.rating)}
                </div>
              </div>

              {/* Review Text */}
              <blockquote className="testimonial-quote">
                "{testimonial.review}"
              </blockquote>

              {/* User Info */}
              <div className="testimonial-user">
                <div className="testimonial-avatar">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjE1MCIgdmlld0JveD0iMCAwIDE1MCAxNTAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iNzUiIGN5PSI3NSIgcj0iNzUiIGZpbGw9IiM5Q0EzQUYiLz48Y2lyY2xlIGN4PSI3NSIgY3k9IjYwIiByPSIyNSIgZmlsbD0iI0ZGRiIvPjxwYXRoIGQ9Ik0zNSAxMjBDMzUgMTA1IDUwIDkwIDc1IDkwUzExNSAxMDUgMTE1IDEyMFYxNTBIMzVWMTIwWiIgZmlsbD0iI0ZGRiIvPjwvc3ZnPg==';
                    }}
                  />
                </div>
                <h4 className="testimonial-name">
                  {testimonial.name}
                </h4>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialSection;