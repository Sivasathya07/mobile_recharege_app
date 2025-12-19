const Plan = require('../models/Plan');

const seedPlans = async () => {
  try {
    // Check if plans already exist
    const existingPlans = await Plan.countDocuments();
    if (existingPlans > 0) {
      console.log('Plans already exist, skipping seed');
      return;
    }

    const plans = [
      // AIRTEL PREPAID PLANS
      // Full Talktime Plans
      { planId: 'AIR_99', operator: 'airtel_prepaid', planType: 'fulltt', amount: 99, validity: '14 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
      { planId: 'AIR_155', operator: 'airtel_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_179', operator: 'airtel_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'AIR_265', operator: 'airtel_prepaid', planType: 'fulltt', amount: 265, validity: '28 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day', 'Airtel Thanks'] },
      { planId: 'AIR_299', operator: 'airtel_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Airtel Thanks'] },
      { planId: 'AIR_359', operator: 'airtel_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Airtel Thanks'] },
      { planId: 'AIR_399', operator: 'airtel_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_449', operator: 'airtel_prepaid', planType: 'fulltt', amount: 449, validity: '28 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_549', operator: 'airtel_prepaid', planType: 'fulltt', amount: 549, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_699', operator: 'airtel_prepaid', planType: 'fulltt', amount: 699, validity: '56 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_839', operator: 'airtel_prepaid', planType: 'fulltt', amount: 839, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_1799', operator: 'airtel_prepaid', planType: 'fulltt', amount: 1799, validity: '365 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '3600 SMS/year', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_2999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile', 'Netflix Mobile'] },
      
      // Data Plans
      { planId: 'AIR_D19', operator: 'airtel_prepaid', planType: 'data', amount: 19, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
      { planId: 'AIR_D48', operator: 'airtel_prepaid', planType: 'data', amount: 48, validity: '3 days', description: '3GB Data', benefits: ['3GB Data'] },
      { planId: 'AIR_D65', operator: 'airtel_prepaid', planType: 'data', amount: 65, validity: '7 days', description: '1GB/day', benefits: ['1GB Data/day'] },
      { planId: 'AIR_D118', operator: 'airtel_prepaid', planType: 'data', amount: 118, validity: '14 days', description: '2GB/day', benefits: ['2GB Data/day'] },
      { planId: 'AIR_D181', operator: 'airtel_prepaid', planType: 'data', amount: 181, validity: '30 days', description: '1GB/day', benefits: ['1GB Data/day'] },
      { planId: 'AIR_D301', operator: 'airtel_prepaid', planType: 'data', amount: 301, validity: '30 days', description: '25GB Data', benefits: ['25GB Data'] },
      { planId: 'AIR_D401', operator: 'airtel_prepaid', planType: 'data', amount: 401, validity: '30 days', description: '30GB Data', benefits: ['30GB Data'] },
      
      // Top-up Plans
      { planId: 'AIR_T10', operator: 'airtel_prepaid', planType: 'topup', amount: 10, validity: 'N/A', description: 'Main Balance', benefits: ['₹10 Main Balance'] },
      { planId: 'AIR_T20', operator: 'airtel_prepaid', planType: 'topup', amount: 20, validity: 'N/A', description: 'Main Balance', benefits: ['₹20 Main Balance'] },
      { planId: 'AIR_T50', operator: 'airtel_prepaid', planType: 'topup', amount: 50, validity: 'N/A', description: 'Main Balance', benefits: ['₹50 Main Balance'] },
      { planId: 'AIR_T100', operator: 'airtel_prepaid', planType: 'topup', amount: 100, validity: 'N/A', description: 'Main Balance', benefits: ['₹100 Main Balance'] },
      { planId: 'AIR_T200', operator: 'airtel_prepaid', planType: 'topup', amount: 200, validity: 'N/A', description: 'Main Balance', benefits: ['₹200 Main Balance'] },
      { planId: 'AIR_T500', operator: 'airtel_prepaid', planType: 'topup', amount: 500, validity: 'N/A', description: 'Main Balance', benefits: ['₹500 Main Balance'] },

      // JIO PREPAID PLANS
      // Full Talktime Plans
      { planId: 'JIO_75', operator: 'jio_prepaid', planType: 'fulltt', amount: 75, validity: '6 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_155', operator: 'jio_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_179', operator: 'jio_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_239', operator: 'jio_prepaid', planType: 'fulltt', amount: 239, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_299', operator: 'jio_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_349', operator: 'jio_prepaid', planType: 'fulltt', amount: 349, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_399', operator: 'jio_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_533', operator: 'jio_prepaid', planType: 'fulltt', amount: 533, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_666', operator: 'jio_prepaid', planType: 'fulltt', amount: 666, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_719', operator: 'jio_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps', 'Disney+ Hotstar Mobile'] },
      { planId: 'JIO_999', operator: 'jio_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'JioApps', 'Disney+ Hotstar Mobile'] },
      { planId: 'JIO_1559', operator: 'jio_prepaid', planType: 'fulltt', amount: 1559, validity: '336 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'JioApps'] },
      { planId: 'JIO_2999', operator: 'jio_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'JioApps', 'Netflix Mobile'] },
      
      // Data Plans
      { planId: 'JIO_D15', operator: 'jio_prepaid', planType: 'data', amount: 15, validity: '1 day', description: '1GB Data', benefits: ['1GB Data', 'JioApps'] },
      { planId: 'JIO_D25', operator: 'jio_prepaid', planType: 'data', amount: 25, validity: '2 days', description: '2GB Data', benefits: ['2GB Data', 'JioApps'] },
      { planId: 'JIO_D61', operator: 'jio_prepaid', planType: 'data', amount: 61, validity: '7 days', description: '6GB Data', benefits: ['6GB Data', 'JioApps'] },
      { planId: 'JIO_D151', operator: 'jio_prepaid', planType: 'data', amount: 151, validity: '30 days', description: '12GB Data', benefits: ['12GB Data', 'JioApps'] },
      { planId: 'JIO_D251', operator: 'jio_prepaid', planType: 'data', amount: 251, validity: '30 days', description: '50GB Data', benefits: ['50GB Data', 'JioApps'] },
      
      // Top-up Plans
      { planId: 'JIO_T11', operator: 'jio_prepaid', planType: 'topup', amount: 11, validity: 'N/A', description: 'Main Balance', benefits: ['₹11 Main Balance'] },
      { planId: 'JIO_T22', operator: 'jio_prepaid', planType: 'topup', amount: 22, validity: 'N/A', description: 'Main Balance', benefits: ['₹22 Main Balance'] },
      { planId: 'JIO_T55', operator: 'jio_prepaid', planType: 'topup', amount: 55, validity: 'N/A', description: 'Main Balance', benefits: ['₹55 Main Balance'] },
      { planId: 'JIO_T110', operator: 'jio_prepaid', planType: 'topup', amount: 110, validity: 'N/A', description: 'Main Balance', benefits: ['₹110 Main Balance'] },
      { planId: 'JIO_T220', operator: 'jio_prepaid', planType: 'topup', amount: 220, validity: 'N/A', description: 'Main Balance', benefits: ['₹220 Main Balance'] },

      // VI PREPAID PLANS
      // Full Talktime Plans
      { planId: 'VI_79', operator: 'vi_prepaid', planType: 'fulltt', amount: 79, validity: '18 days', description: 'Unlimited calls + 200MB/day', benefits: ['Unlimited Voice', '200MB Data/day', '100 SMS/day'] },
      { planId: 'VI_155', operator: 'vi_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'VI_179', operator: 'vi_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'VI_269', operator: 'vi_prepaid', planType: 'fulltt', amount: 269, validity: '28 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Weekend Data Rollover'] },
      { planId: 'VI_319', operator: 'vi_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Binge All Night'] },
      { planId: 'VI_359', operator: 'vi_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Binge All Night'] },
      { planId: 'VI_449', operator: 'vi_prepaid', planType: 'fulltt', amount: 449, validity: '28 days', description: 'Unlimited calls + 4GB/day', benefits: ['Unlimited Voice', '4GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'VI_539', operator: 'vi_prepaid', planType: 'fulltt', amount: 539, validity: '56 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day', 'Binge All Night'] },
      { planId: 'VI_719', operator: 'vi_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: 'Unlimited calls + 1.5GB/day', benefits: ['Unlimited Voice', '1.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'VI_999', operator: 'vi_prepaid', planType: 'fulltt', amount: 999, validity: '84 days', description: 'Unlimited calls + 2.5GB/day', benefits: ['Unlimited Voice', '2.5GB Data/day', '100 SMS/day', 'Disney+ Hotstar Mobile'] },
      { planId: 'VI_1799', operator: 'vi_prepaid', planType: 'fulltt', amount: 1799, validity: '365 days', description: 'Unlimited calls + 24GB/month', benefits: ['Unlimited Voice', '24GB Data/month', '3600 SMS/year', 'Disney+ Hotstar Mobile'] },
      
      // Data Plans
      { planId: 'VI_D16', operator: 'vi_prepaid', planType: 'data', amount: 16, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
      { planId: 'VI_D58', operator: 'vi_prepaid', planType: 'data', amount: 58, validity: '7 days', description: '4GB Data', benefits: ['4GB Data'] },
      { planId: 'VI_D118', operator: 'vi_prepaid', planType: 'data', amount: 118, validity: '14 days', description: '12GB Data', benefits: ['12GB Data'] },
      { planId: 'VI_D181', operator: 'vi_prepaid', planType: 'data', amount: 181, validity: '30 days', description: '30GB Data', benefits: ['30GB Data'] },
      
      // Top-up Plans
      { planId: 'VI_T10', operator: 'vi_prepaid', planType: 'topup', amount: 10, validity: 'N/A', description: 'Main Balance', benefits: ['₹10 Main Balance'] },
      { planId: 'VI_T20', operator: 'vi_prepaid', planType: 'topup', amount: 20, validity: 'N/A', description: 'Main Balance', benefits: ['₹20 Main Balance'] },
      { planId: 'VI_T50', operator: 'vi_prepaid', planType: 'topup', amount: 50, validity: 'N/A', description: 'Main Balance', benefits: ['₹50 Main Balance'] },
      { planId: 'VI_T100', operator: 'vi_prepaid', planType: 'topup', amount: 100, validity: 'N/A', description: 'Main Balance', benefits: ['₹100 Main Balance'] },

      // BSNL PREPAID PLANS
      // Full Talktime Plans
      { planId: 'BSNL_108', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 108, validity: '25 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_187', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 187, validity: '28 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_247', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 247, validity: '45 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_319', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 319, validity: '54 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 397, validity: '70 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_666', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 666, validity: '129 days', description: 'Unlimited calls + 1GB/day', benefits: ['Unlimited Voice', '1GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_1188', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1188, validity: '300 days', description: 'Unlimited calls + 2GB/day', benefits: ['Unlimited Voice', '2GB Data/day', '100 SMS/day'] },
      { planId: 'BSNL_1999', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1999, validity: '425 days', description: 'Unlimited calls + 3GB/day', benefits: ['Unlimited Voice', '3GB Data/day', '100 SMS/day'] },
      
      // Data Plans
      { planId: 'BSNL_D17', operator: 'bsnl_prepaid', planType: 'data', amount: 17, validity: '1 day', description: '1GB Data', benefits: ['1GB Data'] },
      { planId: 'BSNL_D47', operator: 'bsnl_prepaid', planType: 'data', amount: 47, validity: '3 days', description: '3GB Data', benefits: ['3GB Data'] },
      { planId: 'BSNL_D107', operator: 'bsnl_prepaid', planType: 'data', amount: 107, validity: '15 days', description: '10GB Data', benefits: ['10GB Data'] },
      
      // Top-up Plans
      { planId: 'BSNL_T10', operator: 'bsnl_prepaid', planType: 'topup', amount: 10, validity: 'N/A', description: 'Main Balance', benefits: ['₹10 Main Balance'] },
      { planId: 'BSNL_T20', operator: 'bsnl_prepaid', planType: 'topup', amount: 20, validity: 'N/A', description: 'Main Balance', benefits: ['₹20 Main Balance'] },
      { planId: 'BSNL_T50', operator: 'bsnl_prepaid', planType: 'topup', amount: 50, validity: 'N/A', description: 'Main Balance', benefits: ['₹50 Main Balance'] },
      { planId: 'BSNL_T100', operator: 'bsnl_prepaid', planType: 'topup', amount: 100, validity: 'N/A', description: 'Main Balance', benefits: ['₹100 Main Balance'] },

      // POSTPAID PLANS
      // Airtel Postpaid
      { planId: 'AIR_P399', operator: 'airtel_postpaid', planType: 'fulltt', amount: 399, validity: '30 days', description: '40GB + Unlimited calls', benefits: ['Unlimited Voice', '40GB Data', 'Unlimited SMS', 'Airtel Thanks'] },
      { planId: 'AIR_P499', operator: 'airtel_postpaid', planType: 'fulltt', amount: 499, validity: '30 days', description: '75GB + Unlimited calls', benefits: ['Unlimited Voice', '75GB Data', 'Unlimited SMS', 'Disney+ Hotstar Mobile'] },
      { planId: 'AIR_P699', operator: 'airtel_postpaid', planType: 'fulltt', amount: 699, validity: '30 days', description: '100GB + Unlimited calls', benefits: ['Unlimited Voice', '100GB Data', 'Unlimited SMS', 'Netflix Mobile', 'Amazon Prime'] },
      { planId: 'AIR_P999', operator: 'airtel_postpaid', planType: 'fulltt', amount: 999, validity: '30 days', description: '150GB + Unlimited calls', benefits: ['Unlimited Voice', '150GB Data', 'Unlimited SMS', 'Netflix Basic', 'Disney+ Hotstar Super'] },
      
      // Jio Postpaid
      { planId: 'JIO_P399', operator: 'jio_postpaid', planType: 'fulltt', amount: 399, validity: '30 days', description: '75GB + Unlimited calls', benefits: ['Unlimited Voice', '75GB Data', 'Unlimited SMS', 'JioApps'] },
      { planId: 'JIO_P599', operator: 'jio_postpaid', planType: 'fulltt', amount: 599, validity: '30 days', description: '100GB + Unlimited calls', benefits: ['Unlimited Voice', '100GB Data', 'Unlimited SMS', 'Netflix Mobile', 'JioApps'] },
      { planId: 'JIO_P799', operator: 'jio_postpaid', planType: 'fulltt', amount: 799, validity: '30 days', description: '150GB + Unlimited calls', benefits: ['Unlimited Voice', '150GB Data', 'Unlimited SMS', 'Netflix Basic', 'Disney+ Hotstar Super'] },
      { planId: 'JIO_P1199', operator: 'jio_postpaid', planType: 'fulltt', amount: 1199, validity: '30 days', description: '200GB + Unlimited calls', benefits: ['Unlimited Voice', '200GB Data', 'Unlimited SMS', 'Netflix Premium', 'Amazon Prime'] },
      
      // Vi Postpaid
      { planId: 'VI_P399', operator: 'vi_postpaid', planType: 'fulltt', amount: 399, validity: '30 days', description: '40GB + Unlimited calls', benefits: ['Unlimited Voice', '40GB Data', 'Unlimited SMS', 'Vi Movies & TV'] },
      { planId: 'VI_P599', operator: 'vi_postpaid', planType: 'fulltt', amount: 599, validity: '30 days', description: '90GB + Unlimited calls', benefits: ['Unlimited Voice', '90GB Data', 'Unlimited SMS', 'Netflix Mobile', 'Vi Movies & TV'] },
      { planId: 'VI_P799', operator: 'vi_postpaid', planType: 'fulltt', amount: 799, validity: '30 days', description: '120GB + Unlimited calls', benefits: ['Unlimited Voice', '120GB Data', 'Unlimited SMS', 'Netflix Basic', 'Disney+ Hotstar Mobile'] },
      { planId: 'VI_P1099', operator: 'vi_postpaid', planType: 'fulltt', amount: 1099, validity: '30 days', description: '200GB + Unlimited calls', benefits: ['Unlimited Voice', '200GB Data', 'Unlimited SMS', 'Netflix Premium', 'Amazon Prime'] }
    ];

    await Plan.insertMany(plans);
    console.log(`Successfully seeded ${plans.length} plans to database`);
  } catch (error) {
    console.error('Error seeding plans:', error);
  }
};

module.exports = { seedPlans };