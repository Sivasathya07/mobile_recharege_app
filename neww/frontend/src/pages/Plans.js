import React, { useState, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Smartphone, 
  Tv, 
  Zap, 
  Wifi, 
  Star,
  ArrowRight,
  Filter
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';

// Mock data for operators and plans
const mockOperators = {
  mobile: [
    { name: "Airtel Prepaid", code: "airtel_prepaid" },
    { name: "Jio Prepaid", code: "jio_prepaid" },
    { name: "Vi Prepaid", code: "vi_prepaid" },
    { name: "BSNL Prepaid", code: "bsnl_prepaid" },
    { name: "Airtel Postpaid", code: "airtel_postpaid" }
  ],
  dth: [
    { name: "Tata Play", code: "tataplay" },
    { name: "Airtel Digital TV", code: "airteldth" },
    { name: "Dish TV", code: "dishtv" },
    { name: "Sun Direct", code: "sundirect" },
    { name: "D2H", code: "d2h" }
  ],
  electricity: [
    { name: "BESCOM", code: "bescom" },
    { name: "MSEDCL", code: "msedcl" },
    { name: "TNEB", code: "tneb" },
    { name: "KSEB", code: "kseb" }
  ],
  broadband: [
    { name: "Airtel Broadband", code: "airtel_bb" },
    { name: "Jio Fiber", code: "jio_fiber" },
    { name: "BSNL Broadband", code: "bsnl_bb" },
    { name: "ACT Fibernet", code: "act_fiber" }
  ]
};

const mockPlans = {
  airtel_prepaid: [
    // Full Talktime Plans
    { planId: "AIR_155", amount: 155, validity: "24 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_179", amount: 179, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_199", amount: 199, validity: "24 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "Wynk Music"], planType: "fulltt" },
    { planId: "AIR_265", amount: 265, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_299", amount: 299, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "Airtel Thanks"], planType: "fulltt" },
    { planId: "AIR_359", amount: 359, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_399", amount: 399, validity: "28 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Wynk Music"], planType: "fulltt" },
    { planId: "AIR_449", amount: 449, validity: "56 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_549", amount: 549, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_719", amount: 719, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_839", amount: 839, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_999", amount: 999, validity: "84 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Amazon Prime"], planType: "fulltt" },
    { planId: "AIR_1799", amount: 1799, validity: "365 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_2999", amount: 2999, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Amazon Prime"], planType: "fulltt" },
    
    // Data Only Plans
    { planId: "AIR_D19", amount: 19, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D25", amount: 25, validity: "2 days", description: "1.5GB Data", benefits: ["1.5GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D48", amount: 48, validity: "3 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D65", amount: 65, validity: "7 days", description: "4GB Data", benefits: ["4GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D98", amount: 98, validity: "28 days", description: "6GB Data", benefits: ["6GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D118", amount: 118, validity: "28 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D155", amount: 155, validity: "30 days", description: "15GB Data", benefits: ["15GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D181", amount: 181, validity: "30 days", description: "40GB Data", benefits: ["40GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D301", amount: 301, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D401", amount: 401, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "AIR_D501", amount: 501, validity: "30 days", description: "100GB Data", benefits: ["100GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans
    { planId: "AIR_T10", amount: 10, validity: "N/A", description: "Main Balance", benefits: ["₹10 Main Balance"], planType: "topup" },
    { planId: "AIR_T20", amount: 20, validity: "N/A", description: "Main Balance", benefits: ["₹20 Main Balance"], planType: "topup" },
    { planId: "AIR_T30", amount: 30, validity: "N/A", description: "Main Balance", benefits: ["₹30 Main Balance"], planType: "topup" },
    { planId: "AIR_T50", amount: 50, validity: "N/A", description: "Main Balance", benefits: ["₹50 Main Balance"], planType: "topup" },
    { planId: "AIR_T100", amount: 100, validity: "N/A", description: "Main Balance", benefits: ["₹100 Main Balance"], planType: "topup" },
    { planId: "AIR_T200", amount: 200, validity: "N/A", description: "Main Balance", benefits: ["₹200 Main Balance"], planType: "topup" },
    { planId: "AIR_T500", amount: 500, validity: "N/A", description: "Main Balance", benefits: ["₹500 Main Balance"], planType: "topup" },
    
    // Special Plans
    { planId: "AIR_S95", amount: 95, validity: "28 days", description: "Night Data Special", benefits: ["6GB Night Data (12AM-6AM)", "Unlimited Voice", "100 SMS/day"], planType: "special" },
    { planId: "AIR_S148", amount: 148, validity: "30 days", description: "Work From Home", benefits: ["20GB Data", "Unlimited Voice", "100 SMS/day", "Zoom Premium"], planType: "special" },
    { planId: "AIR_S296", amount: 296, validity: "30 days", description: "Student Special", benefits: ["25GB Data", "Unlimited Voice", "100 SMS/day", "Educational Apps"], planType: "special" }
  ],
  airtel_postpaid: [
    { planId: "AIRP_299", amount: 299, validity: "30 days", description: "25GB Data + Unlimited Calls", benefits: ["25GB Data", "Unlimited Voice", "100 SMS/day", "Airtel Thanks"], planType: "postpaid" },
    { planId: "AIRP_399", amount: 399, validity: "30 days", description: "40GB Data + Unlimited Calls", benefits: ["40GB Data", "Unlimited Voice", "100 SMS/day", "Netflix Basic"], planType: "postpaid" },
    { planId: "AIRP_499", amount: 499, validity: "30 days", description: "75GB Data + Unlimited Calls", benefits: ["75GB Data", "Unlimited Voice", "100 SMS/day", "Netflix Basic + Amazon Prime"], planType: "postpaid" },
    { planId: "AIRP_699", amount: 699, validity: "30 days", description: "100GB Data + Unlimited Calls", benefits: ["100GB Data", "Unlimited Voice", "100 SMS/day", "Netflix Premium + Disney+ Hotstar"], planType: "postpaid" },
    { planId: "AIRP_999", amount: 999, validity: "30 days", description: "150GB Data + Unlimited Calls", benefits: ["150GB Data", "Unlimited Voice", "100 SMS/day", "All OTT Apps"], planType: "postpaid" }
  ],
  jio_prepaid: [
    // Full Talktime Plans
    { planId: "JIO_155", amount: 155, validity: "24 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_179", amount: 179, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_209", amount: 209, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_239", amount: 239, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_299", amount: 299, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_349", amount: 349, validity: "28 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
    { planId: "JIO_395", amount: 395, validity: "84 days", description: "Unlimited calls + 6GB total", benefits: ["Unlimited Voice", "6GB Total Data", "1000 SMS", "JioApps"], planType: "fulltt" },
    { planId: "JIO_533", amount: 533, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_719", amount: 719, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_999", amount: 999, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
    { planId: "JIO_1559", amount: 1559, validity: "336 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "3600 SMS", "JioApps"], planType: "fulltt" },
    { planId: "JIO_2999", amount: 2999, validity: "365 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
    
    // Data Only Plans
    { planId: "JIO_D15", amount: 15, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D25", amount: 25, validity: "2 days", description: "1.5GB Data", benefits: ["1.5GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D39", amount: 39, validity: "7 days", description: "2.5GB Data", benefits: ["2.5GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D69", amount: 69, validity: "28 days", description: "6GB Data", benefits: ["6GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D99", amount: 99, validity: "28 days", description: "10GB Data", benefits: ["10GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D149", amount: 149, validity: "30 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D199", amount: 199, validity: "30 days", description: "25GB Data", benefits: ["25GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D299", amount: 299, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D399", amount: 399, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans
    { planId: "JIO_T11", amount: 11, validity: "N/A", description: "Main Balance", benefits: ["₹11 Main Balance"], planType: "topup" },
    { planId: "JIO_T22", amount: 22, validity: "N/A", description: "Main Balance", benefits: ["₹22 Main Balance"], planType: "topup" },
    { planId: "JIO_T33", amount: 33, validity: "N/A", description: "Main Balance", benefits: ["₹33 Main Balance"], planType: "topup" },
    { planId: "JIO_T55", amount: 55, validity: "N/A", description: "Main Balance", benefits: ["₹55 Main Balance"], planType: "topup" },
    { planId: "JIO_T110", amount: 110, validity: "N/A", description: "Main Balance", benefits: ["₹110 Main Balance"], planType: "topup" },
    { planId: "JIO_T220", amount: 220, validity: "N/A", description: "Main Balance", benefits: ["₹220 Main Balance"], planType: "topup" },
    
    // Special Plans
    { planId: "JIO_S75", amount: 75, validity: "28 days", description: "JioPhone Plan", benefits: ["2GB Data", "Unlimited Voice", "300 SMS", "JioApps"], planType: "special" },
    { planId: "JIO_S186", amount: 186, validity: "28 days", description: "Work From Home", benefits: ["2GB Data/day", "Unlimited Voice", "100 SMS/day", "JioMeet Pro"], planType: "special" },
    { planId: "JIO_S666", amount: 666, validity: "84 days", description: "Cricket Special", benefits: ["1.5GB Data/day", "Unlimited Voice", "100 SMS/day", "JioTV Sports"], planType: "special" }
  ],
  vi_prepaid: [
    // Full Talktime Plans
    { planId: "VI_155", amount: 155, validity: "24 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "VI_179", amount: 179, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "VI_219", amount: 219, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day", "Vi Movies & TV"], planType: "fulltt" },
    { planId: "VI_269", amount: 269, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "VI_319", amount: 319, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Binge All Night"], planType: "fulltt" },
    { planId: "VI_359", amount: 359, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Weekend Data Rollover"], planType: "fulltt" },
    { planId: "VI_449", amount: 449, validity: "56 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "VI_539", amount: 539, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "VI_699", amount: 699, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "VI_859", amount: 859, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Weekend Data Rollover"], planType: "fulltt" },
    { planId: "VI_1799", amount: 1799, validity: "365 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "100 SMS/day", "Vi Movies & TV"], planType: "fulltt" },
    
    // Data Only Plans
    { planId: "VI_D16", amount: 16, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D29", amount: 29, validity: "2 days", description: "2GB Data", benefits: ["2GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D48", amount: 48, validity: "7 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D58", amount: 58, validity: "28 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D118", amount: 118, validity: "28 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D181", amount: 181, validity: "30 days", description: "30GB Data", benefits: ["30GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D301", amount: 301, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans
    { planId: "VI_T10", amount: 10, validity: "N/A", description: "Main Balance", benefits: ["₹10 Main Balance"], planType: "topup" },
    { planId: "VI_T20", amount: 20, validity: "N/A", description: "Main Balance", benefits: ["₹20 Main Balance"], planType: "topup" },
    { planId: "VI_T30", amount: 30, validity: "N/A", description: "Main Balance", benefits: ["₹30 Main Balance"], planType: "topup" },
    { planId: "VI_T50", amount: 50, validity: "N/A", description: "Main Balance", benefits: ["₹50 Main Balance"], planType: "topup" },
    { planId: "VI_T100", amount: 100, validity: "N/A", description: "Main Balance", benefits: ["₹100 Main Balance"], planType: "topup" },
    
    // Special Plans
    { planId: "VI_S95", amount: 95, validity: "28 days", description: "Night Unlimited", benefits: ["Unlimited Data (12AM-6AM)", "Unlimited Voice", "100 SMS/day"], planType: "special" },
    { planId: "VI_S199", amount: 199, validity: "28 days", description: "Hero Unlimited", benefits: ["Unlimited Data (2AM-5AM)", "2GB Day Data", "Unlimited Voice"], planType: "special" }
  ],
  bsnl_prepaid: [
    // Full Talktime Plans
    { planId: "BSNL_108", amount: 108, validity: "25 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_187", amount: 187, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_247", amount: 247, validity: "45 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_297", amount: 297, validity: "54 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_397", amount: 397, validity: "80 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_499", amount: 499, validity: "90 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_666", amount: 666, validity: "160 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_997", amount: 997, validity: "180 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_1999", amount: 1999, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    
    // Data Only Plans
    { planId: "BSNL_D17", amount: 17, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D47", amount: 47, validity: "30 days", description: "2GB Data", benefits: ["2GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D97", amount: 97, validity: "30 days", description: "10GB Data", benefits: ["10GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D147", amount: 147, validity: "30 days", description: "20GB Data", benefits: ["20GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans
    { planId: "BSNL_T10", amount: 10, validity: "N/A", description: "Main Balance", benefits: ["₹10 Main Balance"], planType: "topup" },
    { planId: "BSNL_T20", amount: 20, validity: "N/A", description: "Main Balance", benefits: ["₹20 Main Balance"], planType: "topup" },
    { planId: "BSNL_T50", amount: 50, validity: "N/A", description: "Main Balance", benefits: ["₹50 Main Balance"], planType: "topup" },
    { planId: "BSNL_T100", amount: 100, validity: "N/A", description: "Main Balance", benefits: ["₹100 Main Balance"], planType: "topup" },
    
    // Special Plans
    { planId: "BSNL_S56", amount: 56, validity: "28 days", description: "BSNL Chaukka", benefits: ["4GB Data", "Unlimited Voice", "100 SMS/day"], planType: "special" },
    { planId: "BSNL_S84", amount: 84, validity: "28 days", description: "BSNL Sixer", benefits: ["6GB Data", "Unlimited Voice", "100 SMS/day"], planType: "special" }
  ],
  tataplay: [
    { planId: "TP_153", amount: 153, validity: "30 days", description: "South Titanium HD", benefits: ["100+ channels", "HD quality", "Regional content"], planType: "fulltt" },
    { planId: "TP_240", amount: 240, validity: "30 days", description: "Hindi Basic HD", benefits: ["150+ channels", "HD quality", "Hindi entertainment"], planType: "fulltt" },
    { planId: "TP_340", amount: 340, validity: "30 days", description: "Sports Special", benefits: ["200+ channels", "Sports channels", "HD quality"], planType: "fulltt" }
  ],
  airteldth: [
    { planId: "ADT_154", amount: 154, validity: "30 days", description: "South Value Pack", benefits: ["120+ channels", "Regional content", "HD channels"], planType: "fulltt" },
    { planId: "ADT_299", amount: 299, validity: "30 days", description: "Entertainment Pack", benefits: ["200+ channels", "Premium content", "Sports channels"], planType: "fulltt" }
  ],
  dishtv: [
    { planId: "DISH_169", amount: 169, validity: "30 days", description: "Family Pack", benefits: ["130+ channels", "Family entertainment", "Regional channels"], planType: "fulltt" },
    { planId: "DISH_279", amount: 279, validity: "30 days", description: "Gold Pack", benefits: ["180+ channels", "Premium content", "HD channels"], planType: "fulltt" }
  ],
  bescom: [
    { planId: "BESCOM_BILL", amount: 0, validity: "Bill Payment", description: "Pay your BESCOM electricity bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  msedcl: [
    { planId: "MSEDCL_BILL", amount: 0, validity: "Bill Payment", description: "Pay your MSEDCL electricity bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  tneb: [
    { planId: "TNEB_BILL", amount: 0, validity: "Bill Payment", description: "Pay your TNEB electricity bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  kseb: [
    { planId: "KSEB_BILL", amount: 0, validity: "Bill Payment", description: "Pay your KSEB electricity bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  airtel_bb: [
    { planId: "ABB_BILL", amount: 0, validity: "Bill Payment", description: "Pay your Airtel Broadband bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  jio_fiber: [
    { planId: "JF_BILL", amount: 0, validity: "Bill Payment", description: "Pay your Jio Fiber bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  bsnl_bb: [
    { planId: "BBB_BILL", amount: 0, validity: "Bill Payment", description: "Pay your BSNL Broadband bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ],
  act_fiber: [
    { planId: "ACT_BILL", amount: 0, validity: "Bill Payment", description: "Pay your ACT Fibernet bill", benefits: ["Instant payment", "No convenience fee", "SMS confirmation"], planType: "bill" }
  ]
};

const Plans = () => {
  const [searchParams] = useSearchParams();
  const serviceType = searchParams.get('type') || 'mobile';
  const [selectedOperator, setSelectedOperator] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const serviceIcons = {
    mobile: Smartphone,
    dth: Tv,
    electricity: Zap,
    broadband: Wifi
  };

  const ServiceIcon = serviceIcons[serviceType] || Smartphone;

  // Get operators for the selected service type
  const operators = useMemo(() => mockOperators[serviceType] || [], [serviceType]);
  const operatorsLoading = false;

  // Get plans for the selected operator
  const plans = useMemo(() => mockPlans[selectedOperator] || [], [selectedOperator]);
  const plansLoading = false;

  const filteredPlans = plans.filter(plan => 
    planFilter === 'all' || plan.planType === planFilter
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full mb-4">
            <ServiceIcon className="h-6 w-6 mr-2" />
            <span className="font-semibold capitalize">{serviceType} Plans</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Perfect Plan
          </h1>
          <p className="text-gray-600">
            Browse through our extensive collection of plans and find the one that suits you best
          </p>
        </div>

        {/* Operator Selection */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Operator</h2>
          
          {operatorsLoading ? (
            <LoadingSpinner text="Loading operators..." />
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {operators.map((operator) => (
                <button
                  key={operator.code}
                  onClick={() => setSelectedOperator(operator.code)}
                  className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                    selectedOperator === operator.code
                      ? 'border-blue-500 bg-blue-50 shadow-lg'
                      : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mx-auto mb-2">
                      <ServiceIcon className="h-6 w-6 text-white" />
                    </div>
                    <p className="font-medium text-gray-900 text-sm">{operator.name}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Plans Section */}
        {selectedOperator && (
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
            {/* Plan Filters */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Available Plans</h2>
              
              {serviceType === 'mobile' && (
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <select
                    value={planFilter}
                    onChange={(e) => setPlanFilter(e.target.value)}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                  >
                    <option value="all">All Plans</option>
                    <option value="fulltt">Full Talktime</option>
                    <option value="data">Data Packs</option>
                    <option value="topup">Top-up</option>
                    <option value="special">Special Plans</option>
                  </select>
                </div>
              )}
            </div>

            {plansLoading ? (
              <LoadingSpinner text="Loading plans..." />
            ) : filteredPlans.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlans.map((plan) => (
                  <div
                    key={plan.planId}
                    className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-300 hover:border-blue-300"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">₹{plan.amount}</h3>
                        <p className="text-gray-600">{plan.validity}</p>
                      </div>
                      {plan.planType && (
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          plan.planType === 'fulltt' ? 'bg-green-100 text-green-800' :
                          plan.planType === 'data' ? 'bg-blue-100 text-blue-800' :
                          plan.planType === 'topup' ? 'bg-yellow-100 text-yellow-800' :
                          plan.planType === 'special' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {plan.planType === 'fulltt' ? 'Full TT' :
                           plan.planType === 'data' ? 'Data' :
                           plan.planType === 'topup' ? 'Top-up' :
                           plan.planType === 'special' ? 'Special' : plan.planType}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-700 mb-4">{plan.description}</p>
                    
                    {plan.benefits && plan.benefits.length > 0 && (
                      <div className="space-y-2 mb-6">
                        {plan.benefits.map((benefit, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Link
                      to={`/recharge?type=${serviceType}&operator=${selectedOperator}&plan=${plan.planId}&amount=${plan.amount}`}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                    >
                      Recharge Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <ServiceIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Plans Available</h3>
                <p className="text-gray-600">
                  {planFilter === 'all' 
                    ? 'No plans available for this operator'
                    : `No ${planFilter} plans available for this operator`
                  }
                </p>
              </div>
            )}
          </div>
        )}

        {!selectedOperator && (
          <div className="text-center py-16">
            <ServiceIcon className="h-20 w-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">
              Select an Operator
            </h3>
            <p className="text-gray-600 text-lg">
              Choose your operator from the list above to view available plans
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Plans;