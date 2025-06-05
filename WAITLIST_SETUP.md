# WordCraft Waitlist Setup Guide

## 🚀 Setup Instructions

### 1. Supabase Database Setup

1. **Go to your Supabase project**: https://app.supabase.com/
2. **Open the SQL Editor** and run the SQL from `supabase-setup.sql`
3. **Get your credentials** from Settings > API:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2. Resend Email Setup

1. **Sign up for Resend**: https://resend.com/
2. **Create an API key**: https://resend.com/api-keys
3. **Verify your domain** (or use the test domain for development)

### 3. Environment Variables

Create a `.env.local` file in your project root:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Resend Configuration
RESEND_API_KEY=your_resend_api_key
```

### 4. Update Email Configuration

In `src/app/actions/waitlist.ts`, update the email sender:

```typescript
from: 'WordCraft <hello@yourdomain.com>', // Replace with your verified domain
```

For development, you can use: `from: 'WordCraft <onboarding@resend.dev>'`

## 📊 Database Schema

The waitlist table includes:

- `id`: Unique identifier (UUID)
- `email`: User email (unique)
- `joined_at`: Timestamp when user joined
- `status`: active | invited | unsubscribed
- `created_at` / `updated_at`: Audit timestamps

## 🔒 Security Features

- **Row Level Security (RLS)** enabled
- **Email uniqueness** constraint
- **Input validation** on both client and server
- **Error handling** for duplicate emails

## 📧 Email Features

- **Welcome email** sent automatically
- **Beautiful HTML template** with user's waitlist position
- **Feature highlights** and launch timeline
- **Professional design** matching your brand

## 🎯 Testing

1. **Development**: Use Resend's test domain
2. **Production**: Set up your own domain with Resend
3. **Database**: Check Supabase dashboard for new entries

## 📈 Analytics

Use the `waitlist_stats` view for insights:

```sql
SELECT * FROM waitlist_stats;
```

## 🚀 Going Live

1. Set up your production environment variables
2. Verify your email domain with Resend
3. Test the complete flow
4. Monitor the Supabase dashboard for signups

## 🎨 Customization

- **Email template**: Modify `generateWelcomeEmail()` function
- **Waitlist position**: Real-time count from database
- **Success message**: Customize in the React component
