# Tripsaverz Admin Dashboard

A comprehensive admin dashboard built with Next.js for monitoring Tripsaverz metrics and performance indicators.

## Features

- **Authentication**: Secure login system with NextAuth.js
- **Real-time Metrics**: View prices clicks and leads generated tracking
- **Time Range Filters**: Today, yesterday, current/last week, current/last month, and custom date ranges
- **Interactive Charts**: Line and bar charts using Recharts
- **Responsive Design**: Mobile-friendly interface with Tailwind CSS
- **Modern UI**: Built with shadcn/ui components and Framer Motion animations
- **Protected Routes**: Middleware-based route protection

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **UI Components**: shadcn/ui with Radix UI primitives
- **Charts**: Recharts
- **Database**: MongoDB with native driver
- **Authentication**: NextAuth.js with JWT
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB instance (local or Atlas)

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:

   ```bash
   cp env.example .env.local
   ```

   Update `.env.local` with your configuration:

   ```
   # MongoDB Connection
   MONGODB_URI=mongodb+srv://username:password@budget.zpw5dc.mongodb.net/flight_analytics
   # or for local MongoDB:
   MONGODB_URI=mongodb://localhost:27017/flight_analytics

   # Authentication
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-key-here
   ADMIN_EMAIL=your email
   ADMIN_PASSWORD=password
   ```

4. Run the development server:

   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Authentication

The dashboard includes a secure authentication system:

- **Login Page**: Access the dashboard at `/login`
- **Protected Routes**: All dashboard routes are protected by middleware
- **Session Management**: JWT-based sessions with NextAuth.js

### Customizing Authentication

To change the admin credentials, update the environment variables:

```bash
ADMIN_EMAIL=your-email@example.com
ADMIN_PASSWORD=your-secure-password
```

## Database Schema

The dashboard expects MongoDB documents with the following structure:

```json
{
  "_id": "ObjectId",
  "sessionId": "string",
  "events": [
    {
      "eventId": "string",
      "timestamp": "Date",
      "eventType": "view_prices_click",
      "airline": "string",
      "flightCode": "string",
      "departureTime": "string",
      "arrivalTime": "string",
      "providersClicked": [
        {
          "eventId": "string",
          "timestamp": "Date",
          "eventType": "provider_click",
          "parentEventId": "string",
          "provider": "string",
          "providerFare": "string"
        }
      ]
    }
  ],
  "flightMetadata": {
    "from_city": "string",
    "to_city": "string",
    "doj": "string",
    "doa": "string"
  },
  "username": "string"
}
```

## API Endpoints

### GET /api/metrics

Fetches metrics data based on time range.

**Query Parameters:**

- `timeRange`: `today` | `yesterday` | `week` | `lastWeek` | `month` | `lastMonth` | `custom`
- `startDate`: Start date for custom range (ISO format)
- `endDate`: End date for custom range (ISO format)

**Response:**

```json
{
  "viewPricesClicks": {
    "total": 150,
    "data": [
      { "date": "2025-01-01", "count": 25 },
      { "date": "2025-01-02", "count": 30 }
    ]
  },
  "leadsGenerated": {
    "total": 45,
    "data": [
      { "date": "2025-01-01", "count": 8 },
      { "date": "2025-01-02", "count": 12 }
    ]
  }
}
```

## Project Structure

```
src/
├── app/
│   ├── api/metrics/          # API routes
│   ├── globals.css           # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Dashboard page
├── components/
│   ├── MetricCard.tsx       # Metric summary cards
│   ├── MetricsChart.tsx     # Chart components
│   └── TimeRangeFilter.tsx  # Time range selector
├── lib/
│   └── mongodb.ts           # Database connection
└── ui-components/           # Reusable UI components
    ├── button.tsx
    ├── card.tsx
    ├── input.tsx
    ├── select.tsx
    └── lib/utils.ts
```

## Customization

### Adding New Metrics

1. Update the API route in `src/app/api/metrics/route.ts`
2. Add new metric cards in `src/components/MetricCard.tsx`
3. Update the dashboard page to display new metrics

### Styling

The project uses Tailwind CSS with custom CSS variables for theming. Modify `src/app/globals.css` to customize colors and styling.

### Database Configuration

Update the database and collection names in `src/app/api/metrics/route.ts`:

```typescript
const db = client.db("your_database_name");
const collection = db.collection("your_collection_name");
```

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The app can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.
# tripsaverz-admin
