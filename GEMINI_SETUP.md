# Gemini AI Setup Guide

This application includes AI-powered features using Google's Gemini API. Follow these steps to enable AI functionality:

## 1. Get Your Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy the generated API key

## 2. Configure the API Key

### Option A: Environment Variable (Recommended)
Create a `.env` file in the project root:
```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

### Option B: Direct Configuration
Update `src/config/gemini.ts` and replace the empty string with your API key:
```typescript
export const GEMINI_CONFIG = {
  apiKey: 'your_api_key_here',
  model: 'gemini-pro',
  enabled: true
};
```

## 3. Restart the Development Server

After setting up the API key, restart your development server:
```bash
npm run dev
```

## 4. Verify AI Features

Once configured, you'll have access to:
- **AI Insights**: Personalized analysis of your test results
- **AI Recommendations**: Customized suggestions based on performance
- **AI Test Generator**: Dynamic question generation
- **AI Scoring**: Enhanced scoring with contextual analysis

## Features Available

### AI Insights Component
- Comprehensive neurological health analysis
- Personalized recommendations
- Risk factor identification
- Next steps guidance

### AI Test Generator
- Dynamic question creation based on user history
- Difficulty adaptation
- Personalized content
- Detailed explanations

### AI Scoring
- Enhanced scoring algorithms
- Contextual adjustments
- Performance factor analysis
- Risk level assessment

## Troubleshooting

### API Key Not Working
- Ensure the key is correctly set in your environment
- Check that the key has proper permissions
- Verify the key is not expired

### AI Features Not Loading
- Check browser console for error messages
- Ensure the API key is properly configured
- Verify network connectivity

### Fallback Behavior
If the API key is not configured, the application will:
- Show fallback insights and recommendations
- Use standard scoring algorithms
- Display helpful setup instructions

## Security Notes

- Never commit your API key to version control
- Use environment variables for production deployments
- Monitor your API usage in the Google AI Studio dashboard
- Consider implementing rate limiting for production use

## Support

For issues with:
- **Gemini API**: Check [Google AI Studio documentation](https://ai.google.dev/docs)
- **Application**: Check the browser console for error messages
- **Setup**: Verify your API key configuration
