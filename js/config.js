/**
 * ============================================================================
 * SMARTLINK BUSINESS — PRODUCTION & DEPLOYMENT CONFIGURATION
 * ============================================================================
 * Centralized business settings, contact numbers, Indore location details,
 * and social channels. Update these values before launching with real clients!
 */

const SMARTLINK_CONFIG = {
  // Business Identification
  businessName: "SmartLink Business",
  tagline: "One Tap. One Scan. Everything Connected.",
  taglineHi: "एक टैप। एक स्कैन। सब कुछ कनेक्टेड।",

  // City & Operating Region (Indore Focus)
  city: "Indore",
  state: "Madhya Pradesh",
  country: "India",
  serviceAreas: ["Vijay Nagar", "Palasia", "Bhawarkua", "Chappan Dukan", "Sarafa", "Super Corridor", "Rau", "Scheme 54", "AB Road"],
  fullAddress: "Plot 42, Scheme 54 PU-4, Near Vijay Nagar Square, Indore, MP 452010",

  // Direct Communication Channels
  // Format for WhatsApp: country code without '+' or special characters (e.g., 919876543210)
  whatsappNumber: "917697912636", // REPLACE WITH REAL INDORE BUSINESS WHATSAPP
  phoneDisplay: "+91 76979 12636", // REPLACE WITH REAL PHONE NUMBER
  phoneCallable: "+917697912636",
  email: "ayuayu7697@gmail.com", // REPLACE WITH REAL BUSINESS EMAIL
  supportHours: "Mon - Sat: 9:30 AM - 8:00 PM IST",

  // Social Profiles
  socials: {
    instagram: "https://www.instagram.com/smartlink_001?srtk=MWxmODQ4ajhlMWdlNg==",
    googleBusiness: "https://maps.google.com/?q=SmartLink+Business+Indore"
  },

  // Currency & Commercial Defaults (INR Focused)
  currencySymbol: "₹",
  currencyCode: "INR",
  notificationEmail: "ayuayu7697@gmail.com", // Email destination for enquiries
  pricingPlans: {
    starter: {
      inr: "₹1,999",
      name: "Starter QR + static website Kit"
    },
    pro: {
      inr: "₹3,999",
      name: "Pro NFC Business Suite"
    },
    enterprise: {
      inr: "₹8,999",
      name: "Enterprise Multi-Outlet Bespoke"
    }
  },

  // AI & Analytics Status
  aiEngineMode: "client-side-nlp", // Options: 'client-side-nlp' (zero cost/offline) or 'api-webhook'
  aiApiEndpoint: null, // Set to your secure backend URL e.g. "https://api.yourdomain.com/v1/chat" if external LLM is desired
  isDemoAnalytics: true // Always marks sample dashboard metrics as simulated/sample data
};

// Expose globally
if (typeof window !== "undefined") {
  window.SMARTLINK_CONFIG = SMARTLINK_CONFIG;
}
