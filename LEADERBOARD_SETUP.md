# WordCraft Leaderboard Setup Guide

## 🚀 Overview

The WordCraft leaderboard system allows users to compete and track their writing performance across different writing styles. This guide covers the complete setup and functionality.

## 📋 Prerequisites

1. **Supabase Project**: You need an active Supabase project
2. **Waitlist Setup**: Complete the waitlist setup first (see `WAITLIST_SETUP.md`)
3. **Environment Variables**: Ensure your `.env.local` is configured

## 🗄️ Database Setup

### Step 1: Run the Leaderboard Schema

1. **Open Supabase SQL Editor**: Go to your Supabase project dashboard
2. **Execute the Schema**: Copy and paste the contents of `leaderboard-schema.sql` into the SQL editor
3. **Run the Script**: Execute the complete schema to create all necessary tables and functions

The schema creates:

- **`users` table**: Stores user profiles (both registered and guest users)
- **`games` table**: Records individual game sessions with scores and analysis
- **`leaderboard_view`**: Materialized view for efficient leaderboard queries
- **Database functions**: For leaderboard queries and user management
- **Indexes**: For optimal performance
- **RLS policies**: For secure data access

### Step 2: Optional Sample Data

To test the leaderboard with sample data, uncomment the sample data section at the bottom of `leaderboard-schema.sql` and run it.

## 🔧 Features

### Core Functionality

1. **Automatic Score Saving**: When users complete a writing challenge and view the leaderboard, their score is automatically saved
2. **Real-time Leaderboard**: Displays top performers with live data from the database
3. **Style-based Filtering**: Filter leaderboard by specific writing styles
4. **Guest User Support**: Temporary users can participate without registration
5. **Performance Optimization**: Uses materialized views for fast queries

### User Experience

- **Live Data**: Leaderboard shows real scores from actual users
- **Current User Highlighting**: Users see their position highlighted in the leaderboard
- **Refresh Functionality**: Manual refresh button to update rankings
- **Error Handling**: Graceful fallbacks if database is unavailable
- **Loading States**: Smooth loading indicators during data fetching

## 📊 How It Works

### Game Flow

1. **User selects writing style** → AI generates a prompt
2. **User writes response** → AI analyzes and scores the writing
3. **User views analysis** → Detailed feedback and metrics are shown
4. **User clicks "View Leaderboard"** → Game result is saved to database
5. **Leaderboard displays** → Real-time rankings with user's position

### Database Architecture

```
users
├── id (UUID, Primary Key)
├── username (Unique)
├── display_name
├── is_guest (Boolean)
└── timestamps

games
├── id (UUID, Primary Key)
├── user_id (Foreign Key to users)
├── prompt_text
├── user_response
├── writing_style (Enum)
├── scores (overall, style-specific, metrics)
├── ai_analysis (JSON)
└── timestamps

leaderboard_view (Materialized View)
├── user info
├── best scores per style
├── ranking calculations
└── performance metrics
```

## 🔄 API Endpoints

### GET `/api/leaderboard`

Fetches leaderboard data with optional filtering.

**Query Parameters:**

- `style`: Filter by writing style (optional)
- `limit`: Number of entries to return (default: 50)

**Response:**

```json
{
  "success": true,
  "data": [
    {
      "username": "alex_johnson",
      "display_name": "Alex Johnson",
      "writing_style": "technical",
      "best_score": 95,
      "total_games": 5,
      "avg_score": 87.4
    }
  ],
  "style": "technical",
  "total": 10
}
```

### POST `/api/leaderboard`

Refreshes the materialized view (for performance optimization).

### POST `/api/save-game`

Saves a completed game result to the database.

**Request Body:**

```json
{
  "username": "Guest",
  "promptText": "Explain renewable energy benefits...",
  "userResponse": "Renewable energy sources offer...",
  "writingStyle": "technical",
  "analysisResult": {
    "overallScore": 85,
    "styleSpecificScore": 88,
    "metrics": {
      "clarity": 90,
      "structure": 85,
      "wordChoice": 80,
      "grammar": 95
    },
    "strengths": ["Clear explanations", "Good structure"],
    "weaknesses": ["Could improve word choice"],
    "styleSpecificTips": ["Use more technical terminology"]
  }
}
```

## 🛡️ Security Features

### Row Level Security (RLS)

- **Users can only view their own profiles** (except guest users)
- **Public leaderboard access** for registered users only
- **Secure game creation** with user validation

### Data Validation

- **Score ranges**: All scores validated to be 0-100
- **Required fields**: Prompt, response, style, and analysis required
- **SQL injection protection**: Parameterized queries and RLS policies

## 🎮 User Types

### Guest Users

- **Temporary participation**: Can play without registration
- **Limited persistence**: Scores saved temporarily
- **Unique identification**: Auto-generated guest usernames
- **Leaderboard exclusion**: Guest scores don't appear in public leaderboard

### Registered Users (Future Enhancement)

- **Persistent profiles**: Scores tracked across sessions
- **Public rankings**: Appear in leaderboard
- **Progress tracking**: Historical performance data
- **Authentication**: Secure user management

## 📈 Performance Optimization

### Materialized Views

- **Pre-calculated rankings**: Faster leaderboard queries
- **Automatic refresh**: Triggers update on new games
- **Indexed access**: Optimized for common queries

### Database Indexes

- **User lookups**: Fast username searches
- **Score sorting**: Efficient ranking calculations
- **Style filtering**: Quick category-based queries
- **Time-based queries**: Recent activity tracking

## 🔍 Monitoring & Analytics

### Database Functions

- **`get_leaderboard_by_style()`**: Filtered leaderboard queries
- **`refresh_leaderboard()`**: Manual view refresh
- **`get_or_create_guest_user()`**: Guest user management

### Query Performance

- **Efficient joins**: Optimized table relationships
- **Limited results**: Pagination for large datasets
- **Cached views**: Materialized view caching

## 🚨 Troubleshooting

### Common Issues

1. **Leaderboard not loading**: Check Supabase connection and RLS policies
2. **Scores not saving**: Verify API endpoint and data validation
3. **Slow queries**: Ensure materialized view is refreshed
4. **Missing data**: Check if database schema is complete

### Debug Steps

1. **Check browser console**: Look for API errors
2. **Verify Supabase logs**: Check for database errors
3. **Test API endpoints**: Use tools like Postman
4. **Validate data**: Ensure all required fields are present

## 🔮 Future Enhancements

### Planned Features

1. **User Authentication**: Full registration and login system
2. **Advanced Statistics**: Detailed performance analytics
3. **Achievements System**: Badges and milestones
4. **Social Features**: Follow users and share achievements
5. **Tournament Mode**: Organized writing competitions

### Technical Improvements

1. **Real-time Updates**: WebSocket-based live leaderboard
2. **Caching Layer**: Redis for improved performance
3. **Analytics Dashboard**: Admin interface for insights
4. **API Rate Limiting**: Protection against abuse

## 📞 Support

If you encounter issues with the leaderboard setup:

1. **Check this documentation** for common solutions
2. **Review Supabase logs** for database errors
3. **Verify environment variables** are correctly set
4. **Test with sample data** to isolate issues

The leaderboard system is designed to be robust and scalable, providing an engaging competitive element to the WordCraft writing platform.
