const mongoose = require('mongoose');
const Plan = require('./models/Plan');

const plans = [
  // Airtel Plans (30 plans)
  { planId: 'AIR_19', operator: 'airtel_prepaid', planType: 'data', amount: 19, validity: '1 day', description: '200MB Data', benefits: ['200MB Data'] },
  { planId: 'AIR_29', operator: 'airtel_prepaid', planType: 'data', amount: 29, validity: '2 days', description: '500MB Data', benefits: ['500MB Data'] },
  { planId: 'AIR_49', operator: 'airtel_prepaid', planType: 'data', amount: 49, validity: '3 days', description: '1GB Data', benefits: ['1GB Data'] },
  { planId: 'AIR_65', operator: 'airtel_prepaid', planType: 'data', amount: 65, validity: '4 days', description: '1.5GB Data', benefits: ['1.5GB Data'] },
  { planId: 'AIR_79', operator: 'airtel_prepaid', planType: 'fulltt', amount: 79, validity: '7 days', description: 'Weekly pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'AIR_95', operator: 'airtel_prepaid', planType: 'fulltt', amount: 95, validity: '10 days', description: '10-day pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'AIR_129', operator: 'airtel_prepaid', planType: 'fulltt', amount: 129, validity: '14 days', description: 'Fortnightly pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'AIR_155', operator: 'airtel_prepaid', planType: 'fulltt', amount: 155, validity: '24 days', description: '24-day pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'AIR_179', operator: 'airtel_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Monthly starter', benefits: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_199', operator: 'airtel_prepaid', planType: 'fulltt', amount: 199, validity: '28 days', description: 'Popular pack', benefits: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_239', operator: 'airtel_prepaid', planType: 'fulltt', amount: 239, validity: '28 days', description: 'High data pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_265', operator: 'airtel_prepaid', planType: 'fulltt', amount: 265, validity: '28 days', description: 'Entertainment pack', benefits: ['2GB/day', 'Disney+ Hotstar', 'Unlimited calls'] },
  { planId: 'AIR_299', operator: 'airtel_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'Premium pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_319', operator: 'airtel_prepaid', planType: 'fulltt', amount: 319, validity: '30 days', description: '30-day pack', benefits: ['2.5GB/day', 'Unlimited calls'] },
  { planId: 'AIR_359', operator: 'airtel_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Heavy user pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_399', operator: 'airtel_prepaid', planType: 'fulltt', amount: 399, validity: '56 days', description: '2-month pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_449', operator: 'airtel_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: 'Extended validity', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_479', operator: 'airtel_prepaid', planType: 'fulltt', amount: 479, validity: '56 days', description: 'Long term pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_549', operator: 'airtel_prepaid', planType: 'fulltt', amount: 549, validity: '70 days', description: '70-day pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_599', operator: 'airtel_prepaid', planType: 'fulltt', amount: 599, validity: '84 days', description: 'Quarterly pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_699', operator: 'airtel_prepaid', planType: 'fulltt', amount: 699, validity: '84 days', description: 'Premium quarterly', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_799', operator: 'airtel_prepaid', planType: 'fulltt', amount: 799, validity: '90 days', description: '90-day pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 999, validity: '120 days', description: '4-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_1199', operator: 'airtel_prepaid', planType: 'fulltt', amount: 1199, validity: '150 days', description: '5-month pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_1499', operator: 'airtel_prepaid', planType: 'fulltt', amount: 1499, validity: '180 days', description: '6-month pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_1799', operator: 'airtel_prepaid', planType: 'fulltt', amount: 1799, validity: '240 days', description: '8-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_2399', operator: 'airtel_prepaid', planType: 'fulltt', amount: 2399, validity: '365 days', description: 'Annual pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_2999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Premium annual', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_3359', operator: 'airtel_prepaid', planType: 'fulltt', amount: 3359, validity: '365 days', description: 'Ultimate annual', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'AIR_3999', operator: 'airtel_prepaid', planType: 'fulltt', amount: 3999, validity: '365 days', description: 'Max annual', benefits: ['4GB/day', 'Unlimited calls', '100 SMS/day'] },

  // Jio Plans (30 plans)
  { planId: 'JIO_22', operator: 'jio_prepaid', planType: 'data', amount: 22, validity: '1 day', description: 'Daily booster', benefits: ['200MB Data'] },
  { planId: 'JIO_39', operator: 'jio_prepaid', planType: 'data', amount: 39, validity: '2 days', description: 'Weekend special', benefits: ['500MB Data'] },
  { planId: 'JIO_52', operator: 'jio_prepaid', planType: 'data', amount: 52, validity: '3 days', description: '3-day pack', benefits: ['1GB Data'] },
  { planId: 'JIO_69', operator: 'jio_prepaid', planType: 'fulltt', amount: 69, validity: '7 days', description: 'Weekly pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'JIO_89', operator: 'jio_prepaid', planType: 'fulltt', amount: 89, validity: '10 days', description: '10-day special', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'JIO_119', operator: 'jio_prepaid', planType: 'fulltt', amount: 119, validity: '14 days', description: '2-week pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'JIO_149', operator: 'jio_prepaid', planType: 'fulltt', amount: 149, validity: '20 days', description: '20-day pack', benefits: ['1.5GB/day', 'Unlimited calls'] },
  { planId: 'JIO_179', operator: 'jio_prepaid', planType: 'fulltt', amount: 179, validity: '28 days', description: 'Monthly basic', benefits: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_209', operator: 'jio_prepaid', planType: 'fulltt', amount: 209, validity: '28 days', description: 'App bundle', benefits: ['1.5GB/day', 'JioApps', 'Unlimited calls'] },
  { planId: 'JIO_239', operator: 'jio_prepaid', planType: 'fulltt', amount: 239, validity: '28 days', description: 'Standard pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_269', operator: 'jio_prepaid', planType: 'fulltt', amount: 269, validity: '28 days', description: 'Entertainment', benefits: ['2GB/day', 'JioCinema', 'Unlimited calls'] },
  { planId: 'JIO_299', operator: 'jio_prepaid', planType: 'fulltt', amount: 299, validity: '28 days', description: 'High data', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_329', operator: 'jio_prepaid', planType: 'fulltt', amount: 329, validity: '28 days', description: 'Netflix bundle', benefits: ['2.5GB/day', 'Netflix', 'Unlimited calls'] },
  { planId: 'JIO_349', operator: 'jio_prepaid', planType: 'fulltt', amount: 349, validity: '28 days', description: 'Premium pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_379', operator: 'jio_prepaid', planType: 'fulltt', amount: 379, validity: '28 days', description: 'All-in-one', benefits: ['3GB/day', 'JioApps', 'Unlimited calls'] },
  { planId: 'JIO_399', operator: 'jio_prepaid', planType: 'fulltt', amount: 399, validity: '56 days', description: '2-month basic', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_479', operator: 'jio_prepaid', planType: 'fulltt', amount: 479, validity: '56 days', description: '2-month premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_533', operator: 'jio_prepaid', planType: 'fulltt', amount: 533, validity: '56 days', description: '2-month max', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_599', operator: 'jio_prepaid', planType: 'fulltt', amount: 599, validity: '84 days', description: '3-month pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_719', operator: 'jio_prepaid', planType: 'fulltt', amount: 719, validity: '84 days', description: '3-month premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_799', operator: 'jio_prepaid', planType: 'fulltt', amount: 799, validity: '84 days', description: '3-month max', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_999', operator: 'jio_prepaid', planType: 'fulltt', amount: 999, validity: '120 days', description: '4-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_1299', operator: 'jio_prepaid', planType: 'fulltt', amount: 1299, validity: '150 days', description: '5-month pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_1559', operator: 'jio_prepaid', planType: 'fulltt', amount: 1559, validity: '180 days', description: '6-month pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_1899', operator: 'jio_prepaid', planType: 'fulltt', amount: 1899, validity: '240 days', description: '8-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_2545', operator: 'jio_prepaid', planType: 'fulltt', amount: 2545, validity: '336 days', description: '11-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_2879', operator: 'jio_prepaid', planType: 'fulltt', amount: 2879, validity: '365 days', description: 'Annual pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_3119', operator: 'jio_prepaid', planType: 'fulltt', amount: 3119, validity: '365 days', description: 'Annual premium', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_3599', operator: 'jio_prepaid', planType: 'fulltt', amount: 3599, validity: '365 days', description: 'Annual max', benefits: ['3.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'JIO_4199', operator: 'jio_prepaid', planType: 'fulltt', amount: 4199, validity: '365 days', description: 'Ultimate annual', benefits: ['4GB/day', 'Unlimited calls', '100 SMS/day'] },

  // Vi Plans (30 plans)
  { planId: 'VI_24', operator: 'vi_prepaid', planType: 'data', amount: 24, validity: '1 day', description: 'Emergency pack', benefits: ['200MB Data'] },
  { planId: 'VI_44', operator: 'vi_prepaid', planType: 'data', amount: 44, validity: '2 days', description: '2-day pack', benefits: ['500MB Data'] },
  { planId: 'VI_58', operator: 'vi_prepaid', planType: 'data', amount: 58, validity: '3 days', description: '3-day special', benefits: ['1GB Data'] },
  { planId: 'VI_79', operator: 'vi_prepaid', planType: 'fulltt', amount: 79, validity: '7 days', description: 'Weekly pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'VI_99', operator: 'vi_prepaid', planType: 'fulltt', amount: 99, validity: '10 days', description: '10-day pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'VI_139', operator: 'vi_prepaid', planType: 'fulltt', amount: 139, validity: '14 days', description: 'Fortnightly', benefits: ['1.5GB/day', 'Unlimited calls'] },
  { planId: 'VI_169', operator: 'vi_prepaid', planType: 'fulltt', amount: 169, validity: '21 days', description: '3-week pack', benefits: ['1.5GB/day', 'Unlimited calls'] },
  { planId: 'VI_199', operator: 'vi_prepaid', planType: 'fulltt', amount: 199, validity: '28 days', description: 'Monthly starter', benefits: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_219', operator: 'vi_prepaid', planType: 'fulltt', amount: 219, validity: '28 days', description: 'Standard pack', benefits: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_249', operator: 'vi_prepaid', planType: 'fulltt', amount: 249, validity: '28 days', description: 'High data', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_279', operator: 'vi_prepaid', planType: 'fulltt', amount: 279, validity: '28 days', description: 'Entertainment', benefits: ['2GB/day', 'Vi Movies & TV', 'Unlimited calls'] },
  { planId: 'VI_319', operator: 'vi_prepaid', planType: 'fulltt', amount: 319, validity: '28 days', description: 'Premium pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_359', operator: 'vi_prepaid', planType: 'fulltt', amount: 359, validity: '28 days', description: 'Max pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_379', operator: 'vi_prepaid', planType: 'fulltt', amount: 379, validity: '28 days', description: 'Ultimate pack', benefits: ['3GB/day', 'Vi Movies & TV', 'Unlimited calls'] },
  { planId: 'VI_399', operator: 'vi_prepaid', planType: 'fulltt', amount: 399, validity: '28 days', description: 'Super pack', benefits: ['3.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_449', operator: 'vi_prepaid', planType: 'fulltt', amount: 449, validity: '56 days', description: '2-month basic', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_519', operator: 'vi_prepaid', planType: 'fulltt', amount: 519, validity: '56 days', description: '2-month premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_599', operator: 'vi_prepaid', planType: 'fulltt', amount: 599, validity: '56 days', description: '2-month max', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_699', operator: 'vi_prepaid', planType: 'fulltt', amount: 699, validity: '84 days', description: '3-month pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_799', operator: 'vi_prepaid', planType: 'fulltt', amount: 799, validity: '84 days', description: '3-month premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_899', operator: 'vi_prepaid', planType: 'fulltt', amount: 899, validity: '84 days', description: '3-month max', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_1099', operator: 'vi_prepaid', planType: 'fulltt', amount: 1099, validity: '120 days', description: '4-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_1399', operator: 'vi_prepaid', planType: 'fulltt', amount: 1399, validity: '150 days', description: '5-month pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_1699', operator: 'vi_prepaid', planType: 'fulltt', amount: 1699, validity: '180 days', description: '6-month pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_2099', operator: 'vi_prepaid', planType: 'fulltt', amount: 2099, validity: '240 days', description: '8-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_2699', operator: 'vi_prepaid', planType: 'fulltt', amount: 2699, validity: '336 days', description: '11-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_2999', operator: 'vi_prepaid', planType: 'fulltt', amount: 2999, validity: '365 days', description: 'Annual pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_3299', operator: 'vi_prepaid', planType: 'fulltt', amount: 3299, validity: '365 days', description: 'Annual premium', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_3799', operator: 'vi_prepaid', planType: 'fulltt', amount: 3799, validity: '365 days', description: 'Annual max', benefits: ['3.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'VI_4399', operator: 'vi_prepaid', planType: 'fulltt', amount: 4399, validity: '365 days', description: 'Ultimate annual', benefits: ['4GB/day', 'Unlimited calls', '100 SMS/day'] },

  // BSNL Plans (30 plans)
  { planId: 'BSNL_18', operator: 'bsnl_prepaid', planType: 'data', amount: 18, validity: '1 day', description: 'Daily pack', benefits: ['200MB Data'] },
  { planId: 'BSNL_36', operator: 'bsnl_prepaid', planType: 'data', amount: 36, validity: '2 days', description: '2-day pack', benefits: ['500MB Data'] },
  { planId: 'BSNL_54', operator: 'bsnl_prepaid', planType: 'data', amount: 54, validity: '3 days', description: '3-day pack', benefits: ['1GB Data'] },
  { planId: 'BSNL_72', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 72, validity: '7 days', description: 'Weekly pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'BSNL_90', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 90, validity: '10 days', description: '10-day pack', benefits: ['1GB/day', 'Unlimited calls'] },
  { planId: 'BSNL_126', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 126, validity: '14 days', description: 'Fortnightly', benefits: ['1.5GB/day', 'Unlimited calls'] },
  { planId: 'BSNL_153', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 153, validity: '21 days', description: '3-week pack', benefits: ['1.5GB/day', 'Unlimited calls'] },
  { planId: 'BSNL_187', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 187, validity: '28 days', description: 'Monthly basic', benefits: ['1GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_197', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 197, validity: '28 days', description: 'Standard pack', benefits: ['1.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_227', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 227, validity: '28 days', description: 'High data', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_247', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 247, validity: '28 days', description: 'Complete pack', benefits: ['2GB/day', 'Unlimited calls', 'STD calls'] },
  { planId: 'BSNL_297', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 297, validity: '28 days', description: 'Premium pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_327', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 327, validity: '28 days', description: 'Max pack', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_347', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 347, validity: '28 days', description: 'STD pack', benefits: ['3GB/day', 'STD calls', 'Unlimited calls'] },
  { planId: 'BSNL_367', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 367, validity: '28 days', description: 'Super pack', benefits: ['3.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 397, validity: '70 days', description: '70-day pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_447', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 447, validity: '70 days', description: '70-day premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_497', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 497, validity: '70 days', description: '70-day max', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_597', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 597, validity: '90 days', description: '3-month pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_697', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 697, validity: '90 days', description: '3-month premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_797', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 797, validity: '160 days', description: '160-day pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_897', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 897, validity: '160 days', description: '160-day premium', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_997', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 997, validity: '180 days', description: '6-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_1197', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1197, validity: '240 days', description: '8-month pack', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_1397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1397, validity: '300 days', description: '10-month pack', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_1597', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1597, validity: '365 days', description: 'Annual basic', benefits: ['2GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_1797', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1797, validity: '365 days', description: 'Annual standard', benefits: ['2.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_1997', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 1997, validity: '365 days', description: 'Annual premium', benefits: ['3GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_2197', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 2197, validity: '365 days', description: 'Annual max', benefits: ['3.5GB/day', 'Unlimited calls', '100 SMS/day'] },
  { planId: 'BSNL_2397', operator: 'bsnl_prepaid', planType: 'fulltt', amount: 2397, validity: '365 days', description: 'Ultimate annual', benefits: ['4GB/day', 'Unlimited calls', '100 SMS/day'] }
];

const seed119Plans = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/recharge-app');
    console.log('Connected to MongoDB');
    
    await Plan.deleteMany({});
    console.log('Cleared existing plans');
    
    await Plan.insertMany(plans);
    console.log(`Successfully inserted ${plans.length} plans`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding plans:', error);
    process.exit(1);
  }
};

seed119Plans();