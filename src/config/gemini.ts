// Gemini API Configuration
// To use AI features, set your Gemini API key in the environment variable VITE_GEMINI_API_KEY
// Get your API key from: https://makersuite.google.com/app/apikey

export const GEMINI_CONFIG = {
  apiKey: import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCYjk7XNjy9pYMeCkFhcseP1GSwvCECEDc',
  model: 'gemini-pro',
  enabled: true
};

export const getGeminiApiKey = (): string => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 'AIzaSyCYjk7XNjy9pYMeCkFhcseP1GSwvCECEDc';
  if (!apiKey) {
    console.warn('Gemini API key not found. AI features will be disabled.');
    console.log('To enable AI features:');
    console.log('1. Get your API key from: https://makersuite.google.com/app/apikey');
    console.log('2. Set VITE_GEMINI_API_KEY in your environment variables');
  }
  return apiKey;
};
