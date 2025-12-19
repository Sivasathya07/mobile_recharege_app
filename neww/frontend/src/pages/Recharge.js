import React, { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { rechargeAPI, walletAPI } from '../services/api';
import toast from 'react-hot-toast';
import { 
  Smartphone, 
  Tv, 
  Zap, 
  Wifi, 
  Search,
  Star,
  CreditCard,
  Wallet,
  CheckCircle,
} from 'lucide-react';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';

// Mock data for operators and plans
const mockOperators = {
  mobile: [
    { name: "Airtel Prepaid", code: "airtel_prepaid" },
    { name: "Airtel Postpaid", code: "airtel_postpaid" },
    { name: "Jio Prepaid", code: "jio_prepaid" },
    { name: "Jio Postpaid", code: "jio_postpaid" },
    { name: "Vi Prepaid", code: "vi_prepaid" },
    { name: "Vi Postpaid", code: "vi_postpaid" },
    { name: "BSNL Prepaid", code: "bsnl_prepaid" },
    { name: "BSNL Postpaid", code: "bsnl_postpaid" }
  ],
  dth: [
    { name: "Tata Play", code: "tataplay" },
    { name: "Airtel Digital TV", code: "airteldth" },
    { name: "Dish TV", code: "dishtv_dth" },
    { name: "Sun Direct", code: "sundirect_dth" },
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
    { name: "ACT Fibernet", code: "act_fiber" },
    { name: "Hathway Broadband", code: "hathway_bb" },
    { name: "Tikona Broadband", code: "tikona_bb" }
  ]
};

const mockPlans = {
  airtel_prepaid: [
    // Full Talktime Plans (15 plans)
    { planId: "AIR_155", amount: 155, validity: "24 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_179", amount: 179, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_199", amount: 199, validity: "24 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "Wynk Music"], planType: "fulltt" },
    { planId: "AIR_265", amount: 265, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_299", amount: 299, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "Airtel Thanks"], planType: "fulltt" },
    { planId: "AIR_359", amount: 359, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_399", amount: 399, validity: "28 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Wynk Music"], planType: "fulltt" },
    { planId: "AIR_449", amount: 449, validity: "56 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_549", amount: 549, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_599", amount: 599, validity: "56 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Wynk Music"], planType: "fulltt" },
    { planId: "AIR_719", amount: 719, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "AIR_839", amount: 839, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_999", amount: 999, validity: "84 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Amazon Prime"], planType: "fulltt" },
    { planId: "AIR_1799", amount: 1799, validity: "365 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "100 SMS/day", "Disney+ Hotstar Mobile"], planType: "fulltt" },
    { planId: "AIR_2999", amount: 2999, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Disney+ Hotstar Mobile", "Amazon Prime"], planType: "fulltt" },
    
    // Data Only Plans (12 plans)
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
    { planId: "AIR_D601", amount: 601, validity: "30 days", description: "120GB Data", benefits: ["120GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans (8 plans)
    { planId: "AIR_T10", amount: 10, validity: "1 day", description: "Quick Top-up", benefits: ["₹7.5 Talk Time", "Local/STD Calls"], planType: "topup" },
    { planId: "AIR_T20", amount: 20, validity: "2 days", description: "Mini Top-up", benefits: ["₹15 Talk Time", "100MB Data"], planType: "topup" },
    { planId: "AIR_T30", amount: 30, validity: "3 days", description: "Smart Top-up", benefits: ["₹22 Talk Time", "200MB Data"], planType: "topup" },
    { planId: "AIR_T50", amount: 50, validity: "7 days", description: "Weekly Top-up", benefits: ["₹38 Talk Time", "500MB Data"], planType: "topup" },
    { planId: "AIR_T100", amount: 100, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹80 Talk Time", "1GB Data"], planType: "topup" },
    { planId: "AIR_T200", amount: 200, validity: "28 days", description: "Monthly Top-up", benefits: ["₹165 Talk Time", "2GB Data"], planType: "topup" },
    { planId: "AIR_T500", amount: 500, validity: "56 days", description: "Mega Top-up", benefits: ["₹425 Talk Time", "5GB Data"], planType: "topup" },
    { planId: "AIR_T1000", amount: 1000, validity: "84 days", description: "Super Top-up", benefits: ["₹875 Talk Time", "10GB Data"], planType: "topup" }
  ],
  airtel_postpaid: [
    { planId: "AIRP_299", amount: 299, validity: "30 days", description: "25GB Data + Unlimited Calls", benefits: ["25GB Data", "Unlimited Voice", "100 SMS/day"], planType: "postpaid" },
    { planId: "AIRP_399", amount: 399, validity: "30 days", description: "40GB Data + Unlimited Calls", benefits: ["40GB Data", "Unlimited Voice", "100 SMS/day", "Netflix Basic"], planType: "postpaid" },
    { planId: "AIRP_499", amount: 499, validity: "30 days", description: "75GB Data + Unlimited Calls", benefits: ["75GB Data", "Unlimited Voice", "100 SMS/day", "Netflix Basic + Amazon Prime"], planType: "postpaid" },
    { planId: "AIRP_699", amount: 699, validity: "30 days", description: "100GB Data + Unlimited Calls", benefits: ["100GB Data", "Unlimited Voice", "100 SMS/day", "Netflix Premium + Disney+"], planType: "postpaid" },
    { planId: "AIRP_999", amount: 999, validity: "30 days", description: "150GB Data + Unlimited Calls", benefits: ["150GB Data", "Unlimited Voice", "100 SMS/day", "All OTT Apps"], planType: "postpaid" }
  ],
  jio_prepaid: [
    // Full Talktime Plans (14 plans)
    { planId: "JIO_155", amount: 155, validity: "24 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_179", amount: 179, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_209", amount: 209, validity: "28 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_239", amount: 239, validity: "28 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_299", amount: 299, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_349", amount: 349, validity: "28 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
    { planId: "JIO_395", amount: 395, validity: "84 days", description: "Unlimited calls + 6GB total", benefits: ["Unlimited Voice", "6GB Total Data", "1000 SMS", "JioApps"], planType: "fulltt" },
    { planId: "JIO_533", amount: 533, validity: "56 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_666", amount: 666, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_719", amount: 719, validity: "84 days", description: "Unlimited calls + 1.5GB/day", benefits: ["Unlimited Voice", "1.5GB Data/day", "100 SMS/day", "JioApps"], planType: "fulltt" },
    { planId: "JIO_999", amount: 999, validity: "84 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
    { planId: "JIO_1559", amount: 1559, validity: "336 days", description: "Unlimited calls + 24GB/month", benefits: ["Unlimited Voice", "24GB Data/month", "3600 SMS", "JioApps"], planType: "fulltt" },
    { planId: "JIO_2999", amount: 2999, validity: "365 days", description: "Unlimited calls + 2.5GB/day", benefits: ["Unlimited Voice", "2.5GB Data/day", "100 SMS/day", "JioApps", "Netflix Mobile"], planType: "fulltt" },
    { planId: "JIO_4199", amount: 4199, validity: "365 days", description: "Unlimited calls + 3GB/day", benefits: ["Unlimited Voice", "3GB Data/day", "100 SMS/day", "JioApps", "Netflix Premium"], planType: "fulltt" },
    
    // Data Only Plans (10 plans)
    { planId: "JIO_D15", amount: 15, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D25", amount: 25, validity: "2 days", description: "1.5GB Data", benefits: ["1.5GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D39", amount: 39, validity: "7 days", description: "2.5GB Data", benefits: ["2.5GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D69", amount: 69, validity: "28 days", description: "6GB Data", benefits: ["6GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D99", amount: 99, validity: "28 days", description: "10GB Data", benefits: ["10GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D149", amount: 149, validity: "30 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D199", amount: 199, validity: "30 days", description: "25GB Data", benefits: ["25GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D299", amount: 299, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D399", amount: 399, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "JIO_D499", amount: 499, validity: "30 days", description: "100GB Data", benefits: ["100GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans (8 plans)
    { planId: "JIO_T11", amount: 11, validity: "1 day", description: "Quick Top-up", benefits: ["₹8 Talk Time", "JioApps Access"], planType: "topup" },
    { planId: "JIO_T22", amount: 22, validity: "2 days", description: "Mini Top-up", benefits: ["₹18 Talk Time", "150MB Data"], planType: "topup" },
    { planId: "JIO_T33", amount: 33, validity: "3 days", description: "Smart Top-up", benefits: ["₹28 Talk Time", "300MB Data"], planType: "topup" },
    { planId: "JIO_T55", amount: 55, validity: "7 days", description: "Weekly Top-up", benefits: ["₹45 Talk Time", "600MB Data"], planType: "topup" },
    { planId: "JIO_T110", amount: 110, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹95 Talk Time", "1.2GB Data"], planType: "topup" },
    { planId: "JIO_T220", amount: 220, validity: "28 days", description: "Monthly Top-up", benefits: ["₹190 Talk Time", "2.5GB Data"], planType: "topup" },
    { planId: "JIO_T550", amount: 550, validity: "56 days", description: "Mega Top-up", benefits: ["₹480 Talk Time", "6GB Data"], planType: "topup" },
    { planId: "JIO_T1100", amount: 1100, validity: "84 days", description: "Super Top-up", benefits: ["₹980 Talk Time", "12GB Data"], planType: "topup" }
  ],
  jio_postpaid: [
    { planId: "JIOP_399", amount: 399, validity: "30 days", description: "75GB Data + Unlimited Calls", benefits: ["75GB Data", "Unlimited Voice", "100 SMS/day", "Netflix + Prime"], planType: "postpaid" },
    { planId: "JIOP_599", amount: 599, validity: "30 days", description: "100GB Data + Unlimited Calls", benefits: ["100GB Data", "Unlimited Voice", "100 SMS/day", "All JioApps"], planType: "postpaid" },
    { planId: "JIOP_799", amount: 799, validity: "30 days", description: "150GB Data + Unlimited Calls", benefits: ["150GB Data", "Unlimited Voice", "100 SMS/day", "Premium OTT"], planType: "postpaid" }
  ],
  vi_prepaid: [
    // Full Talktime Plans (12 plans)
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
    { planId: "VI_2899", amount: 2899, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day", "Vi Movies & TV", "Netflix Mobile"], planType: "fulltt" },
    
    // Data Only Plans (9 plans)
    { planId: "VI_D16", amount: 16, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D29", amount: 29, validity: "2 days", description: "2GB Data", benefits: ["2GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D48", amount: 48, validity: "7 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D58", amount: 58, validity: "28 days", description: "3GB Data", benefits: ["3GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D118", amount: 118, validity: "28 days", description: "12GB Data", benefits: ["12GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D181", amount: 181, validity: "30 days", description: "30GB Data", benefits: ["30GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D301", amount: 301, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D401", amount: 401, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "VI_D501", amount: 501, validity: "30 days", description: "100GB Data", benefits: ["100GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans (7 plans)
    { planId: "VI_T10", amount: 10, validity: "1 day", description: "Quick Top-up", benefits: ["₹7 Talk Time", "Local Calls"], planType: "topup" },
    { planId: "VI_T20", amount: 20, validity: "2 days", description: "Mini Top-up", benefits: ["₹16 Talk Time", "120MB Data"], planType: "topup" },
    { planId: "VI_T30", amount: 30, validity: "3 days", description: "Smart Top-up", benefits: ["₹25 Talk Time", "250MB Data"], planType: "topup" },
    { planId: "VI_T50", amount: 50, validity: "7 days", description: "Weekly Top-up", benefits: ["₹42 Talk Time", "550MB Data"], planType: "topup" },
    { planId: "VI_T100", amount: 100, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹85 Talk Time", "1.1GB Data"], planType: "topup" },
    { planId: "VI_T200", amount: 200, validity: "28 days", description: "Monthly Top-up", benefits: ["₹175 Talk Time", "2.2GB Data"], planType: "topup" },
    { planId: "VI_T500", amount: 500, validity: "56 days", description: "Mega Top-up", benefits: ["₹450 Talk Time", "5.5GB Data"], planType: "topup" }
  ],
  vi_postpaid: [
    { planId: "VIP_399", amount: 399, validity: "30 days", description: "40GB Data + Unlimited Calls", benefits: ["40GB Data", "Unlimited Voice", "100 SMS/day", "Vi Movies & TV"], planType: "postpaid" },
    { planId: "VIP_599", amount: 599, validity: "30 days", description: "75GB Data + Unlimited Calls", benefits: ["75GB Data", "Unlimited Voice", "100 SMS/day", "Netflix + Prime"], planType: "postpaid" },
    { planId: "VIP_799", amount: 799, validity: "30 days", description: "100GB Data + Unlimited Calls", benefits: ["100GB Data", "Unlimited Voice", "100 SMS/day", "All OTT Apps"], planType: "postpaid" }
  ],
  bsnl_prepaid: [
    // Full Talktime Plans (10 plans)
    { planId: "BSNL_108", amount: 108, validity: "25 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_187", amount: 187, validity: "28 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_247", amount: 247, validity: "45 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_297", amount: 297, validity: "54 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_397", amount: 397, validity: "80 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_499", amount: 499, validity: "90 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_666", amount: 666, validity: "160 days", description: "Unlimited calls + 1GB/day", benefits: ["Unlimited Voice", "1GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_997", amount: 997, validity: "180 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_1999", amount: 1999, validity: "365 days", description: "Unlimited calls + 2GB/day", benefits: ["Unlimited Voice", "2GB Data/day", "100 SMS/day"], planType: "fulltt" },
    { planId: "BSNL_2399", amount: 2399, validity: "365 days", description: "Unlimited calls + 3GB/day", benefits: ["Unlimited Voice", "3GB Data/day", "100 SMS/day"], planType: "fulltt" },
    
    // Data Only Plans (8 plans)
    { planId: "BSNL_D17", amount: 17, validity: "1 day", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D22", amount: 22, validity: "2 days", description: "1GB Data", benefits: ["1GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D47", amount: 47, validity: "30 days", description: "2GB Data", benefits: ["2GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D97", amount: 97, validity: "30 days", description: "10GB Data", benefits: ["10GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D147", amount: 147, validity: "30 days", description: "20GB Data", benefits: ["20GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D197", amount: 197, validity: "30 days", description: "35GB Data", benefits: ["35GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D297", amount: 297, validity: "30 days", description: "50GB Data", benefits: ["50GB Data", "No Voice/SMS"], planType: "data" },
    { planId: "BSNL_D397", amount: 397, validity: "30 days", description: "75GB Data", benefits: ["75GB Data", "No Voice/SMS"], planType: "data" },
    
    // Top-up Plans (6 plans)
    { planId: "BSNL_T10", amount: 10, validity: "1 day", description: "Quick Top-up", benefits: ["₹8.5 Talk Time", "Local Calls"], planType: "topup" },
    { planId: "BSNL_T20", amount: 20, validity: "2 days", description: "Mini Top-up", benefits: ["₹17 Talk Time", "100MB Data"], planType: "topup" },
    { planId: "BSNL_T50", amount: 50, validity: "7 days", description: "Weekly Top-up", benefits: ["₹43 Talk Time", "400MB Data"], planType: "topup" },
    { planId: "BSNL_T100", amount: 100, validity: "14 days", description: "Fortnightly Top-up", benefits: ["₹87 Talk Time", "900MB Data"], planType: "topup" },
    { planId: "BSNL_T200", amount: 200, validity: "28 days", description: "Monthly Top-up", benefits: ["₹180 Talk Time", "1.8GB Data"], planType: "topup" },
    { planId: "BSNL_T500", amount: 500, validity: "56 days", description: "Mega Top-up", benefits: ["₹465 Talk Time", "4.5GB Data"], planType: "topup" }
  ],
  bsnl_postpaid: [
    { planId: "BSNLP_199", amount: 199, validity: "30 days", description: "25GB Data + Unlimited Calls", benefits: ["25GB Data", "Unlimited Voice", "100 SMS/day"], planType: "postpaid" },
    { planId: "BSNLP_325", amount: 325, validity: "30 days", description: "50GB Data + Unlimited Calls", benefits: ["50GB Data", "Unlimited Voice", "100 SMS/day"], planType: "postpaid" },
    { planId: "BSNLP_525", amount: 525, validity: "30 days", description: "100GB Data + Unlimited Calls", benefits: ["100GB Data", "Unlimited Voice", "100 SMS/day"], planType: "postpaid" }
  ],
  
  // DTH Plans
  tataplay: [
    { planId: "TP_153", amount: 153, validity: "30 days", description: "South Gold HD", benefits: ["150+ Channels", "50+ HD Channels", "Regional Content"], planType: "dth" },
    { planId: "TP_240", amount: 240, validity: "30 days", description: "South Platinum HD", benefits: ["200+ Channels", "80+ HD Channels", "Premium Content"], planType: "dth" },
    { planId: "TP_315", amount: 315, validity: "30 days", description: "South Diamond", benefits: ["250+ Channels", "100+ HD Channels", "Sports & Movies"], planType: "dth" }
  ],
  
  airteldth: [
    { planId: "ADT_154", amount: 154, validity: "30 days", description: "Entertainment Pack", benefits: ["140+ Channels", "45+ HD Channels", "Kids Content"], planType: "dth" },
    { planId: "ADT_299", amount: 299, validity: "30 days", description: "Family Pack", benefits: ["180+ Channels", "70+ HD Channels", "Movies & Sports"], planType: "dth" },
    { planId: "ADT_499", amount: 499, validity: "30 days", description: "Premium Pack", benefits: ["220+ Channels", "90+ HD Channels", "All Premium Content"], planType: "dth" }
  ],
  
  dishtv_dth: [
    { planId: "DISH_153", amount: 153, validity: "30 days", description: "Family Sports Pack", benefits: ["100+ Channels", "Sports Channels", "Regional Content"], planType: "dth" },
    { planId: "DISH_230", amount: 230, validity: "30 days", description: "Super Family Pack", benefits: ["200+ Channels", "HD Channels", "Kids Channels"], planType: "dth" },
    { planId: "DISH_340", amount: 340, validity: "30 days", description: "Premium HD Pack", benefits: ["300+ Channels", "Premium HD", "Movie Channels"], planType: "dth" },
    { planId: "DISH_590", amount: 590, validity: "30 days", description: "Ultimate Entertainment", benefits: ["400+ Channels", "All Premium HD", "Sports & Movies"], planType: "dth" },
    { planId: "DISH_99", amount: 99, validity: "30 days", description: "Basic Pack", benefits: ["50+ Channels", "Regional Content", "News Channels"], planType: "dth" },
    { planId: "DISH_459", amount: 459, validity: "60 days", description: "Family Sports Pack", benefits: ["100+ Channels", "Sports Channels", "2 Month Validity"], planType: "dth" },
    { planId: "DISH_690", amount: 690, validity: "60 days", description: "Super Family Pack", benefits: ["200+ Channels", "HD Channels", "2 Month Validity"], planType: "dth" },
    { planId: "DISH_1020", amount: 1020, validity: "60 days", description: "Premium HD Pack", benefits: ["300+ Channels", "Premium HD", "2 Month Validity"], planType: "dth" },
    { planId: "DISH_1770", amount: 1770, validity: "60 days", description: "Ultimate Entertainment", benefits: ["400+ Channels", "All Premium HD", "2 Month Validity"], planType: "dth" },
    { planId: "DISH_297", amount: 297, validity: "60 days", description: "Basic Pack", benefits: ["50+ Channels", "Regional Content", "2 Month Validity"], planType: "dth" }
  ],
  
  sundirect_dth: [
    { planId: "SUN_130", amount: 130, validity: "30 days", description: "Value Sports Pack", benefits: ["80+ Channels", "Sports Channels", "South Indian Content"], planType: "dth" },
    { planId: "SUN_200", amount: 200, validity: "30 days", description: "Family Entertainment", benefits: ["150+ Channels", "HD Channels", "Regional Movies"], planType: "dth" },
    { planId: "SUN_300", amount: 300, validity: "30 days", description: "Premium HD Pack", benefits: ["250+ Channels", "Premium HD", "Movie & Sports"], planType: "dth" },
    { planId: "SUN_500", amount: 500, validity: "30 days", description: "Ultimate Pack", benefits: ["350+ Channels", "All Premium HD", "Complete Entertainment"], planType: "dth" },
    { planId: "SUN_75", amount: 75, validity: "30 days", description: "Basic Pack", benefits: ["40+ Channels", "Regional Content", "News & Music"], planType: "dth" },
    { planId: "SUN_390", amount: 390, validity: "60 days", description: "Value Sports Pack", benefits: ["80+ Channels", "Sports Channels", "2 Month Validity"], planType: "dth" },
    { planId: "SUN_600", amount: 600, validity: "60 days", description: "Family Entertainment", benefits: ["150+ Channels", "HD Channels", "2 Month Validity"], planType: "dth" },
    { planId: "SUN_900", amount: 900, validity: "60 days", description: "Premium HD Pack", benefits: ["250+ Channels", "Premium HD", "2 Month Validity"], planType: "dth" },
    { planId: "SUN_1500", amount: 1500, validity: "60 days", description: "Ultimate Pack", benefits: ["350+ Channels", "All Premium HD", "2 Month Validity"], planType: "dth" },
    { planId: "SUN_225", amount: 225, validity: "60 days", description: "Basic Pack", benefits: ["40+ Channels", "Regional Content", "2 Month Validity"], planType: "dth" }
  ],
  
  d2h: [
    { planId: "D2H_155", amount: 155, validity: "30 days", description: "Family Pack", benefits: ["120+ Channels", "HD Channels", "Regional Content"], planType: "dth" },
    { planId: "D2H_250", amount: 250, validity: "30 days", description: "Super Pack", benefits: ["180+ Channels", "Premium HD", "Sports Channels"], planType: "dth" },
    { planId: "D2H_350", amount: 350, validity: "30 days", description: "Premium Pack", benefits: ["250+ Channels", "All HD Channels", "Movie Channels"], planType: "dth" }
  ],
  
  // Electricity Bills
  bescom: [
    { planId: "BES_MIN", amount: 100, validity: "Instant", description: "Minimum Bill Payment", benefits: ["Instant Payment", "No Extra Charges", "SMS Confirmation"], planType: "bill" },
    { planId: "BES_500", amount: 500, validity: "Instant", description: "Quick Payment", benefits: ["Fast Processing", "Email Receipt", "Auto-reminder"], planType: "bill" },
    { planId: "BES_1000", amount: 1000, validity: "Instant", description: "Standard Payment", benefits: ["Instant Processing", "Digital Receipt", "Payment History"], planType: "bill" },
    { planId: "BES_2000", amount: 2000, validity: "Instant", description: "High Amount Payment", benefits: ["Priority Processing", "SMS & Email Alert", "24x7 Support"], planType: "bill" },
    { planId: "BES_5000", amount: 5000, validity: "Instant", description: "Bulk Payment", benefits: ["Express Processing", "Dedicated Support", "Payment Confirmation"], planType: "bill" }
  ],
  
  msedcl: [
    { planId: "MSE_MIN", amount: 150, validity: "Instant", description: "Minimum Bill Payment", benefits: ["Instant Payment", "No Service Charges", "SMS Alert"], planType: "bill" },
    { planId: "MSE_500", amount: 500, validity: "Instant", description: "Quick Payment", benefits: ["Fast Processing", "Digital Receipt", "Payment History"], planType: "bill" },
    { planId: "MSE_1000", amount: 1000, validity: "Instant", description: "Standard Payment", benefits: ["Instant Processing", "Email Confirmation", "Auto-reminder Setup"], planType: "bill" },
    { planId: "MSE_2500", amount: 2500, validity: "Instant", description: "High Value Payment", benefits: ["Priority Processing", "Dedicated Support", "Multiple Alerts"], planType: "bill" },
    { planId: "MSE_5000", amount: 5000, validity: "Instant", description: "Commercial Payment", benefits: ["Express Processing", "Business Support", "Detailed Receipt"], planType: "bill" }
  ],
  
  tneb: [
    { planId: "TNE_MIN", amount: 120, validity: "Instant", description: "Minimum Bill Payment", benefits: ["Instant Payment", "Zero Charges", "SMS Confirmation"], planType: "bill" },
    { planId: "TNE_400", amount: 400, validity: "Instant", description: "Quick Payment", benefits: ["Fast Processing", "Digital Receipt", "Payment Tracking"], planType: "bill" },
    { planId: "TNE_800", amount: 800, validity: "Instant", description: "Standard Payment", benefits: ["Instant Processing", "Email & SMS Alert", "Payment History"], planType: "bill" },
    { planId: "TNE_1500", amount: 1500, validity: "Instant", description: "High Amount Payment", benefits: ["Priority Processing", "Customer Support", "Multiple Notifications"], planType: "bill" },
    { planId: "TNE_3000", amount: 3000, validity: "Instant", description: "Commercial Payment", benefits: ["Express Processing", "Business Support", "Detailed Confirmation"], planType: "bill" }
  ],
  
  kseb: [
    { planId: "KSE_MIN", amount: 100, validity: "Instant", description: "Minimum Bill Payment", benefits: ["Instant Payment", "No Extra Fees", "SMS Alert"], planType: "bill" },
    { planId: "KSE_350", amount: 350, validity: "Instant", description: "Quick Payment", benefits: ["Fast Processing", "Digital Receipt", "Payment Confirmation"], planType: "bill" },
    { planId: "KSE_750", amount: 750, validity: "Instant", description: "Standard Payment", benefits: ["Instant Processing", "Email Receipt", "Auto-reminder"], planType: "bill" },
    { planId: "KSE_1200", amount: 1200, validity: "Instant", description: "High Value Payment", benefits: ["Priority Processing", "Dedicated Support", "Multiple Alerts"], planType: "bill" },
    { planId: "KSE_2500", amount: 2500, validity: "Instant", description: "Commercial Payment", benefits: ["Express Processing", "Business Support", "Detailed Receipt"], planType: "bill" }
  ],
  
  // Broadband Plans
  airtel_bb: [
    { planId: "ABB_399", amount: 399, validity: "30 days", description: "40 Mbps Unlimited", benefits: ["40 Mbps Speed", "Unlimited Data", "Free Installation"], planType: "broadband" },
    { planId: "ABB_499", amount: 499, validity: "30 days", description: "60 Mbps Unlimited", benefits: ["60 Mbps Speed", "Unlimited Data", "Free Router"], planType: "broadband" },
    { planId: "ABB_699", amount: 699, validity: "30 days", description: "100 Mbps Unlimited", benefits: ["100 Mbps Speed", "Unlimited Data", "Airtel Thanks"], planType: "broadband" },
    { planId: "ABB_799", amount: 799, validity: "30 days", description: "200 Mbps Unlimited", benefits: ["200 Mbps Speed", "Unlimited Data", "Netflix Basic"], planType: "broadband" },
    { planId: "ABB_999", amount: 999, validity: "30 days", description: "300 Mbps Unlimited", benefits: ["300 Mbps Speed", "Unlimited Data", "Netflix Premium"], planType: "broadband" },
    { planId: "ABB_1499", amount: 1499, validity: "30 days", description: "1 Gbps Unlimited", benefits: ["1 Gbps Speed", "Unlimited Data", "All OTT Apps"], planType: "broadband" }
  ],
  
  jio_fiber: [
    { planId: "JF_399", amount: 399, validity: "30 days", description: "30 Mbps Unlimited", benefits: ["30 Mbps Speed", "Unlimited Data", "JioApps"], planType: "broadband" },
    { planId: "JF_699", amount: 699, validity: "30 days", description: "100 Mbps Unlimited", benefits: ["100 Mbps Speed", "Unlimited Data", "Netflix + Prime"], planType: "broadband" },
    { planId: "JF_999", amount: 999, validity: "30 days", description: "150 Mbps Unlimited", benefits: ["150 Mbps Speed", "Unlimited Data", "14 OTT Apps"], planType: "broadband" },
    { planId: "JF_1499", amount: 1499, validity: "30 days", description: "300 Mbps Unlimited", benefits: ["300 Mbps Speed", "Unlimited Data", "All Premium OTT"], planType: "broadband" },
    { planId: "JF_2499", amount: 2499, validity: "30 days", description: "500 Mbps Unlimited", benefits: ["500 Mbps Speed", "Unlimited Data", "Gaming Priority"], planType: "broadband" },
    { planId: "JF_3999", amount: 3999, validity: "30 days", description: "1 Gbps Unlimited", benefits: ["1 Gbps Speed", "Unlimited Data", "Business Grade"], planType: "broadband" }
  ],
  
  bsnl_bb: [
    { planId: "BBB_299", amount: 299, validity: "30 days", description: "10 Mbps - 3.3TB FUP", benefits: ["10 Mbps Speed", "3.3TB Data", "Unlimited Calls"], planType: "broadband" },
    { planId: "BBB_399", amount: 399, validity: "30 days", description: "20 Mbps - 3.3TB FUP", benefits: ["20 Mbps Speed", "3.3TB Data", "Free Email"], planType: "broadband" },
    { planId: "BBB_499", amount: 499, validity: "30 days", description: "25 Mbps Unlimited", benefits: ["25 Mbps Speed", "Unlimited Data", "Static IP"], planType: "broadband" },
    { planId: "BBB_777", amount: 777, validity: "30 days", description: "50 Mbps Unlimited", benefits: ["50 Mbps Speed", "Unlimited Data", "Free Router"], planType: "broadband" },
    { planId: "BBB_1277", amount: 1277, validity: "30 days", description: "100 Mbps Unlimited", benefits: ["100 Mbps Speed", "Unlimited Data", "Priority Support"], planType: "broadband" }
  ],
  
  act_fiber: [
    { planId: "ACT_549", amount: 549, validity: "30 days", description: "40 Mbps Unlimited", benefits: ["40 Mbps Speed", "Unlimited Data", "Free Installation"], planType: "broadband" },
    { planId: "ACT_729", amount: 729, validity: "30 days", description: "75 Mbps Unlimited", benefits: ["75 Mbps Speed", "Unlimited Data", "Netflix Basic"], planType: "broadband" },
    { planId: "ACT_999", amount: 999, validity: "30 days", description: "150 Mbps Unlimited", benefits: ["150 Mbps Speed", "Unlimited Data", "Disney+ Hotstar"], planType: "broadband" },
    { planId: "ACT_1499", amount: 1499, validity: "30 days", description: "300 Mbps Unlimited", benefits: ["300 Mbps Speed", "Unlimited Data", "All OTT Apps"], planType: "broadband" },
    { planId: "ACT_2999", amount: 2999, validity: "30 days", description: "1 Gbps Unlimited", benefits: ["1 Gbps Speed", "Unlimited Data", "Gaming Optimized"], planType: "broadband" }
  ],
  
  hathway_bb: [
    { planId: "HTW_399", amount: 399, validity: "30 days", description: "25 Mbps - 500GB FUP", benefits: ["25 Mbps Speed", "500GB Data", "Free Modem"], planType: "broadband" },
    { planId: "HTW_599", amount: 599, validity: "30 days", description: "50 Mbps - 1TB FUP", benefits: ["50 Mbps Speed", "1TB Data", "Free Installation"], planType: "broadband" },
    { planId: "HTW_899", amount: 899, validity: "30 days", description: "100 Mbps Unlimited", benefits: ["100 Mbps Speed", "Unlimited Data", "24x7 Support"], planType: "broadband" },
    { planId: "HTW_1299", amount: 1299, validity: "30 days", description: "200 Mbps Unlimited", benefits: ["200 Mbps Speed", "Unlimited Data", "Premium Support"], planType: "broadband" }
  ],
  
  tikona_bb: [
    { planId: "TIK_299", amount: 299, validity: "30 days", description: "10 Mbps - 150GB FUP", benefits: ["10 Mbps Speed", "150GB Data", "Basic Plan"], planType: "broadband" },
    { planId: "TIK_499", amount: 499, validity: "30 days", description: "20 Mbps - 300GB FUP", benefits: ["20 Mbps Speed", "300GB Data", "Standard Plan"], planType: "broadband" },
    { planId: "TIK_799", amount: 799, validity: "30 days", description: "50 Mbps - 500GB FUP", benefits: ["50 Mbps Speed", "500GB Data", "Premium Plan"], planType: "broadband" },
    { planId: "TIK_1199", amount: 1199, validity: "30 days", description: "100 Mbps Unlimited", benefits: ["100 Mbps Speed", "Unlimited Data", "Ultra Plan"], planType: "broadband" }
  ]
};

const Recharge = () => {
  const navigate = useNavigate();
  const { addTransaction, updateBalance, user } = useAuth();
  const [searchParams] = useSearchParams();
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'mobile');
  const [selectedOperator, setSelectedOperator] = useState('');
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [customAmount, setCustomAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [upiPin, setUpiPin] = useState('');
  const [paymentLoading, setPaymentLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, reset } = useForm();

  // Set form values from URL params only when component mounts
  useEffect(() => {
    const number = searchParams.get('number');
    const operator = searchParams.get('operator');
    if (number) setValue('number', number);
    if (operator) setValue('operator', operator);
    
    // Cleanup function to reset form when component unmounts
    return () => {
      reset();
    };
  }, [searchParams, setValue, reset]);

  
  

  const rechargeTypes = [
    { id: 'mobile', name: 'Mobile', icon: Smartphone, color: 'bg-purple-500' },
    { id: 'dth', name: 'DTH', icon: Tv, color: 'bg-indigo-500' },
    { id: 'electricity', name: 'Electricity', icon: Zap, color: 'bg-pink-500' },
    { id: 'broadband', name: 'Broadband', icon: Wifi, color: 'bg-violet-500' }
  ];

  // Get operators for the selected service type
  const operators = useMemo(() => mockOperators[selectedType] || [], [selectedType]);
  const operatorsLoading = false;

  // Get plans for the selected operator
  const [plans, setPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(false);
  const [planFilter, setPlanFilter] = useState('all');

  useEffect(() => {
    if (selectedOperator) {
      fetchPlans();
    } else {
      setPlans([]);
    }
  }, [selectedOperator]);

  const fetchPlans = async () => {
    setPlansLoading(true);
    try {
      // Fetch plans from database
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000/api'}/plans/all`);
      const data = await response.json();
      
      let operatorPlans = [];
      if (data.plansByOperator && data.plansByOperator[selectedOperator]) {
        operatorPlans = data.plansByOperator[selectedOperator];
      }
      
      // Fallback to mock plans if no database plans
      if (operatorPlans.length === 0) {
        operatorPlans = mockPlans[selectedOperator] || [];
      }
      
      console.log(`Loading ${operatorPlans.length} plans for ${selectedOperator}`);
      setPlans(operatorPlans);
    } catch (error) {
      console.error('Failed to load plans:', error);
      // Fallback to mock plans
      setPlans(mockPlans[selectedOperator] || []);
    } finally {
      setPlansLoading(false);
    }
  };

  

  const onSubmit = async (data) => {
    const rechargeData = {
      type: selectedType,
      number: data.number,
      operator: data.operator,
      amount: selectedPlan ? selectedPlan.amount : parseFloat(customAmount),
      plan: selectedPlan,
      paymentMethod: data.paymentMethod
    };

    // Check if user is logged in for wallet payments
    const token = localStorage.getItem('token');
    if (data.paymentMethod === 'wallet' && !token) {
      toast.error('Please login to use wallet payment');
      navigate('/login?redirect=/recharge');
      return;
    }

    if (data.paymentMethod === 'wallet' && token) {
      // Direct wallet payment for logged-in users
      setLoading(true);
      try {
        const amount = selectedPlan ? selectedPlan.amount : parseFloat(customAmount);
        
        // Check if user has sufficient balance
        if (user?.balance < amount) {
          toast.error('Insufficient wallet balance');
          setLoading(false);
          return;
        }
        
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Deduct amount from wallet balance
        const newBalance = user.balance - amount;
        updateBalance(newBalance);
        
        const operatorName = data.operator.split('_')[0].charAt(0).toUpperCase() + data.operator.split('_')[0].slice(1);
        addTransaction({
          type: 'recharge',
          amount: amount,
          status: 'success',
          description: `Recharge for ${data.number}`,
          operator: operatorName
        });
        
        toast.success('Recharge completed successfully!');
        setSelectedPlan(null);
        setCustomAmount('');
      } catch (error) {
        toast.error('Recharge failed');
      } finally {
        setLoading(false);
      }
    } else {
      // Show payment modal for card/UPI (works for both guest and logged-in users)
      setPaymentData(rechargeData);
      setShowPaymentModal(true);
    }
  };

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setCustomAmount('');
    // Auto-populate the amount field
    setValue('amount', plan.amount);
  };

  const handleCustomAmount = (amount) => {
    setCustomAmount(amount);
    setSelectedPlan(null);
    setValue('amount', amount);
  };

  const handlePayment = async () => {
    if (paymentData?.paymentMethod === 'upi' && (!upiPin || upiPin.length !== 4)) {
      toast.error('Please enter a valid 4-digit UPI PIN');
      return;
    }

    setPaymentLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const token = localStorage.getItem('token');
      if (token) {
        // Add transaction for logged-in users
        const operatorName = paymentData.operator.split('_')[0].charAt(0).toUpperCase() + paymentData.operator.split('_')[0].slice(1);
        addTransaction({
          type: 'recharge',
          amount: paymentData.amount,
          status: 'success',
          description: `Recharge for ${paymentData.number}`,
          operator: operatorName
        });
        
        // If payment was from wallet, deduct the amount
        if (paymentData.paymentMethod === 'wallet' && user?.balance >= paymentData.amount) {
          const newBalance = user.balance - paymentData.amount;
          updateBalance(newBalance);
        }
      }
      
      toast.success('Payment Successful! Recharge completed.');
      
      setShowPaymentModal(false);
      setUpiPin('');
      setPaymentData(null);
      setSelectedPlan(null);
      setCustomAmount('');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-pattern relative">
      <div className="floating-shapes"></div>
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Quick Recharge</h1>
        <p className="text-gray-600">Choose your service and recharge instantly</p>
      </div>

        {/* Service Type Selection */}
        <div className="bg-card rounded-2xl shadow-xl p-6 relative z-10">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Select Service</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {rechargeTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => {
                setSelectedType(type.id);
                setSelectedOperator('');
                setSelectedPlan(null);
                setValue('operator', '');
              }}
              className={`p-4 rounded-lg border-2 transition-all ${
                selectedType === type.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className={`${type.color} w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2`}>
                <type.icon className="h-6 w-6 text-white" />
              </div>
              <p className="font-medium text-gray-900">{type.name}</p>
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
          {/* Recharge Form */}
          <div className="bg-card rounded-2xl shadow-xl p-6 relative z-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recharge Details</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {selectedType === 'mobile' ? 'Mobile Number' : 
                 selectedType === 'dth' ? 'Customer ID' : 
                 selectedType === 'electricity' ? 'Consumer Number' : 'Account Number'}
              </label>
              <input
                {...register('number', {
                  required: 'Number is required',
                  pattern: selectedType === 'mobile' ? {
                    value: /^[6-9]\d{9}$/,
                    message: 'Invalid mobile number'
                  } : undefined
                })}
                type="text"
                className="input"
                placeholder={`Enter ${selectedType === 'mobile' ? 'mobile number' : 'number'}`}
              />
              {errors.number && (
                <p className="mt-1 text-sm text-red-600">{errors.number.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Operator</label>
              {operatorsLoading ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="sm" text="Loading operators..." />
                </div>
              ) : (
                <select
                  {...register('operator', { required: 'Operator is required' })}
                  className="input"
                  onChange={(e) => setSelectedOperator(e.target.value)}
                >
                  <option value="">Select Operator</option>
                  {operators.map((operator) => (
                    <option key={operator.code} value={operator.code}>
                      {operator.name}
                    </option>
                  ))}
                </select>
              )}
              {errors.operator && (
                <p className="mt-1 text-sm text-red-600">{errors.operator.message}</p>
              )}
            </div>

            {selectedType === 'mobile' && (
              <>

              </>
            )}

            {/* Amount Display */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                value={selectedPlan ? selectedPlan.amount : customAmount}
                onChange={(e) => handleCustomAmount(e.target.value)}
                className="input"
                placeholder="Select a plan or enter amount"
                min="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
              <div className="space-y-2">
                {localStorage.getItem('token') && (
                  <label className="flex items-center">
                    <input
                      {...register('paymentMethod', { required: 'Payment method is required' })}
                      type="radio"
                      value="wallet"
                      className="mr-2"
                    />
                    <Wallet className="h-4 w-4 mr-2" />
                    Wallet
                  </label>
                )}
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="card"
                    className="mr-2"
                  />
                  <CreditCard className="h-4 w-4 mr-2" />
                  Credit/Debit Card
                </label>
                <label className="flex items-center">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="upi"
                    className="mr-2"
                  />
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                  </svg>
                  UPI Payment
                </label>
              </div>
              {errors.paymentMethod && (
                <p className="mt-1 text-sm text-red-600">{errors.paymentMethod.message}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || (!selectedPlan && !customAmount)}
              className="btn-primary w-full py-4 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <div className="loading-spinner mr-2"></div>
              ) : (
                <CheckCircle className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Processing...' : `Recharge ₹${selectedPlan?.amount || customAmount || 0}`}
            </button>
          </form>
        </div>

            {/* Plans Section */}
            <div className="bg-card rounded-2xl shadow-xl p-6 relative z-10">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {selectedType === 'mobile' ? 'Recharge Plans' : 'Quick Amounts'}
          </h2>
          
          {selectedType === 'mobile' && selectedOperator && (
            <div className="flex flex-wrap gap-2 mb-4">
              <button 
                onClick={() => setPlanFilter('all')}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all ${
                  planFilter === 'all' ? 'bg-blue-500 text-white' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                }`}
              >
                <Star className="h-3 w-3 mr-1" /> All Plans
              </button>
              <button 
                onClick={() => setPlanFilter('fulltt')}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all ${
                  planFilter === 'fulltt' ? 'bg-green-500 text-white' : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                <Smartphone className="h-3 w-3 mr-1" /> Full Talktime
              </button>
              <button 
                onClick={() => setPlanFilter('data')}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all ${
                  planFilter === 'data' ? 'bg-purple-500 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                }`}
              >
                <Wifi className="h-3 w-3 mr-1" /> Data Packs
              </button>
              <button 
                onClick={() => setPlanFilter('topup')}
                className={`px-3 py-1 rounded-full text-sm font-medium flex items-center transition-all ${
                  planFilter === 'topup' ? 'bg-orange-500 text-white' : 'bg-orange-100 text-orange-700 hover:bg-orange-200'
                }`}
              >
                <CreditCard className="h-3 w-3 mr-1" /> Top-up
              </button>
            </div>
          )}
          
          {!selectedOperator ? (
            <div className="text-center py-8">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Select an operator to view plans</p>
            </div>
          ) : plansLoading ? (
            <LoadingSpinner text="Loading plans..." />
          ) : plans.length > 0 ? (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {(() => {
                const filteredPlans = plans.filter(plan => planFilter === 'all' || plan.planType === planFilter);
                console.log(`Showing ${filteredPlans.length} plans for filter '${planFilter}' out of ${plans.length} total plans`);
                return filteredPlans.map((plan) => (
                <div
                  key={plan.planId}
                  onClick={() => handlePlanSelect(plan)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all ${
                    selectedPlan?.planId === plan.planId
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-semibold text-gray-900">₹{plan.amount}</p>
                      <p className="text-sm text-gray-600">{plan.validity}</p>
                    </div>
                    {plan.planType && (
                      <span className={`badge text-xs ${
                        plan.planType === 'fulltt' ? 'badge-success' :
                        plan.planType === 'data' ? 'badge-info' :
                        plan.planType === 'topup' ? 'badge-warning' : 'badge-info'
                      }`}>
                        {plan.planType === 'fulltt' ? 'Full TT' :
                         plan.planType === 'data' ? 'Data' :
                         plan.planType === 'topup' ? 'Top-up' : plan.planType}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{plan.description}</p>
                  {plan.benefits && plan.benefits.length > 0 && (
                    <div className="space-y-1">
                      {plan.benefits.slice(0, 2).map((benefit, index) => (
                        <p key={index} className="text-xs text-gray-600 flex items-center">
                          <Star className="h-3 w-3 text-yellow-500 mr-1" />
                          {benefit}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
                ));
              })()}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">
                {planFilter === 'all' ? 'No plans available for this operator' : `No ${planFilter} plans available`}
              </p>
              {planFilter !== 'all' && (
                <button 
                  onClick={() => setPlanFilter('all')}
                  className="mt-2 text-blue-600 hover:text-blue-800 text-sm"
                >
                  View all plans
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              {paymentData?.paymentMethod === 'upi' ? 'UPI Payment' : 'Card Payment'}
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Amount to Pay</p>
                <p className="text-2xl font-bold text-gray-900">₹{paymentData?.amount}</p>
                <p className="text-sm text-gray-600">{paymentData?.type} recharge for {paymentData?.number}</p>
              </div>

              {paymentData?.paymentMethod === 'upi' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter UPI PIN
                  </label>
                  <input
                    type="password"
                    maxLength="4"
                    value={upiPin}
                    onChange={(e) => setUpiPin(e.target.value.replace(/\D/g, ''))}
                    className="input text-center text-2xl tracking-widest"
                    placeholder="••••"
                  />
                </div>
              ) : (
                <div className="space-y-3">
                  <input
                    type="text"
                    placeholder="Card Number"
                    className="input"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input"
                    />
                    <input
                      type="text"
                      placeholder="CVV"
                      className="input"
                    />
                  </div>
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setUpiPin('');
                    setPaymentData(null);
                  }}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePayment}
                  disabled={paymentLoading || (paymentData?.paymentMethod === 'upi' && upiPin.length !== 4)}
                  className="btn-primary flex-1"
                >
                  {paymentLoading ? (
                    <div className="loading-spinner mr-2"></div>
                  ) : (
                    'Pay Now'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default Recharge;