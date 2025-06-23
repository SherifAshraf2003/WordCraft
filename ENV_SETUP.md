# Environment Setup for WordCraft

## Required Environment Variables

To enable the AI-powered prompt generation and writing analysis features, you need to set up the following environment variable:

### OpenRouter API Key

1. Sign up at [OpenRouter](https://openrouter.ai/) if you haven't already
2. Get your API key from the dashboard
3. Add the following to your `.env.local` file:

```
OPENROUTER_API_KEY=your_openrouter_api_key_here
```

## Features Enabled

With the OpenRouter integration, your app will have:

- **Dynamic Prompt Generation**: Each writing style generates unique, AI-crafted prompts
- **AI-Powered Analysis**: Real-time evaluation of writing with detailed feedback
- **Style-Specific Scoring**: Specialized metrics for each writing style (Professional, Creative, Technical, Marketing, Academic)
- **Intelligent Feedback**: Personalized suggestions for improvement

## API Endpoints

- `POST /api/generate-prompt` - Generates writing prompts based on selected style
- `POST /api/analyze-writing` - Analyzes user submissions and provides scoring

The app will gracefully fallback to default prompts and basic scoring if the API key is not configured.
