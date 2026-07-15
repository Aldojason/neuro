// Gemini API Configuration
// The client never uses the secret key directly. Requests are forwarded to
// a Netlify Functions endpoint where the key is stored securely.

export const GEMINI_CONFIG = {
  apiKey: undefined,
  apiEndpoint: '/api/gemini',
  model: 'gemini-pro',
  enabled: true
};

export const getGeminiApiKey = (): string | undefined => {
  return undefined;
};
