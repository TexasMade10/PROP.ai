# PROP.ai

## About

PROP.ai is an AI-powered property investment platform that helps real estate investors make smarter decisions through data-driven insights, market analysis, and personalized recommendations.

## Features

### 🏠 **Property Management**
- Add and manage your property portfolio
- Track property values and performance
- View detailed property information and analytics

### 🤖 **AI-Powered Insights**
- Market analysis and trends
- Investment recommendations
- Risk assessment and opportunities
- Predictive analytics for property values

### 📊 **Dashboard & Analytics**
- Comprehensive portfolio overview
- Performance metrics and ROI tracking
- Market trend visualization
- Quick action buttons for common tasks

### 🔐 **User Authentication**
- Secure login and registration
- Social login options (Google, Twitter)
- User profile management

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4
- **Authentication**: Custom implementation (ready for integration)
- **Database**: Ready for integration (PostgreSQL, MongoDB, etc.)
- **AI Integration**: Ready for OpenAI, Anthropic, or other AI services

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TexasMade10/PROP.ai.git
cd PROP.ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
prop-ai/
├── src/
│   └── app/
│       ├── page.tsx              # Homepage
│       ├── dashboard/
│       │   └── page.tsx          # Main dashboard
│       ├── properties/
│       │   └── page.tsx          # Property management
│       └── login/
│           └── page.tsx          # Authentication
├── public/                       # Static assets
└── package.json                  # Dependencies
```

## Pages

### Homepage (`/`)
- Landing page with feature overview
- Call-to-action for signup/login
- Navigation to main application

### Dashboard (`/dashboard`)
- Portfolio overview with key metrics
- Recent properties list
- AI insights and recommendations
- Quick action buttons

### Properties (`/properties`)
- Property portfolio management
- Filtering and sorting options
- Property cards with key information
- Add/edit property functionality

### Login (`/login`)
- User authentication
- Social login options
- Password recovery

## Next Steps

### Immediate Development
1. **Backend API Integration** - Connect to a database and create API endpoints
2. **AI Service Integration** - Implement OpenAI or similar for property analysis
3. **Authentication System** - Add proper user authentication and sessions
4. **Property Forms** - Create add/edit property forms with validation

### Future Features
- Property image upload and management
- Advanced analytics and reporting
- Market data integration
- Investment portfolio optimization
- Mobile app development
- Multi-user collaboration

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, email support@prop.ai or create an issue in this repository.
