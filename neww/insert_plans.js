// MongoDB script to insert recharge plans
use('recharge-app');

db.plans.insertMany([
  {
    "operator": "Airtel",
    "type": "prepaid",
    "amount": 199,
    "validity": "28 days",
    "benefits": "1.5GB/day, Unlimited calls, 100 SMS/day",
    "description": "Popular plan with daily data"
  },
  {
    "operator": "Airtel",
    "type": "prepaid",
    "amount": 299,
    "validity": "28 days",
    "benefits": "2GB/day, Unlimited calls, 100 SMS/day",
    "description": "High data plan"
  },
  {
    "operator": "Jio",
    "type": "prepaid",
    "amount": 179,
    "validity": "28 days",
    "benefits": "1.5GB/day, Unlimited calls, 100 SMS/day",
    "description": "Basic daily data plan"
  },
  {
    "operator": "Jio",
    "type": "prepaid",
    "amount": 239,
    "validity": "28 days",
    "benefits": "2GB/day, Unlimited calls, 100 SMS/day",
    "description": "Premium daily data"
  },
  {
    "operator": "Vi",
    "type": "prepaid",
    "amount": 219,
    "validity": "28 days",
    "benefits": "1.5GB/day, Unlimited calls, 100 SMS/day",
    "description": "Standard plan"
  },
  {
    "operator": "BSNL",
    "type": "prepaid",
    "amount": 187,
    "validity": "28 days",
    "benefits": "1GB/day, Unlimited calls, 100 SMS/day",
    "description": "Government network plan"
  }
]);