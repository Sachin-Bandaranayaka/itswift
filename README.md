# itswift - eLearning Platform

A modern, full-featured eLearning platform built with Next.js, TypeScript, and Supabase.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run development server
npm run dev

# Open http://localhost:3000
```

## 📚 Documentation

All project documentation is organized in the [`docs/`](./docs/) directory:

- **[📘 Guides](./docs/guides/)** - User guides and setup instructions
- **[✨ Features](./docs/features/)** - Feature implementations and summaries
- **[🚀 Deployment](./docs/deployment/)** - Deployment guides and checklists
- **[🔧 Fixes](./docs/fixes/)** - Bug fixes and issue resolutions
- **[🔌 Integrations](./docs/integrations/)** - Third-party service integrations
- **[👨‍💻 Development](./docs/development/)** - Developer documentation
- **[🔌 API](./docs/api/)** - API endpoint documentation

**→ [View Complete Documentation Index](./docs/README.md)**

## 🎯 Key Features

### Admin Panel
- **Dashboard** - Analytics and metrics overview
- **Blog Management** - Create, edit, schedule blog posts
- **Content Management** - Dynamic content editing
- **FAQ Management** - Manage FAQs across pages
- **Newsletter** - Email campaigns and subscriber management
- **Social Media** - Social media post scheduling
- **Testimonials** - Customer testimonials management

### Frontend Features
- Dynamic content system
- SEO optimization
- Responsive design
- Fast page loads
- Video optimization

### Integrations
- Brevo (Email marketing)
- Google Analytics
- Social media platforms
- OpenAI (Content generation)

## 🛠️ Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Database**: Supabase (PostgreSQL)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: NextAuth.js
- **Analytics**: Google Analytics
- **Email**: Brevo

## 📦 Project Structure

```
itswift/
├── app/                    # Next.js app directory
│   ├── admin/             # Admin panel pages
│   ├── api/               # API routes
│   └── ...                # Public pages
├── components/            # React components
│   ├── admin/            # Admin-specific components
│   ├── ui/               # UI components
│   └── ...               # Shared components
├── docs/                  # 📚 All documentation
├── lib/                   # Utility functions and services
│   ├── database/         # Database services
│   └── utils/            # Helper functions
├── public/                # Static assets
├── scripts/               # Utility scripts
├── test/                  # Test files
└── types/                 # TypeScript type definitions
```

## 🔐 Environment Variables

Required environment variables (see `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# NextAuth
NEXTAUTH_URL=
NEXTAUTH_SECRET=

# OpenAI (for AI features)
OPENAI_API_KEY=

# Brevo (Email)
BREVO_API_KEY=

# Analytics
NEXT_PUBLIC_GA_MEASUREMENT_ID=
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage

# Run UI tests
npm run test:ui
```

## 📝 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run ESLint
npm test                 # Run tests
npm run setup-admin      # Create admin user
npm run sync-brevo       # Sync subscribers to Brevo
npm run deploy:check     # Check deployment readiness
```

## 🚀 Deployment

See the [Deployment Guide](./docs/deployment/DEPLOYMENT_GUIDE.md) for detailed instructions.

Quick deployment checklist:
1. Review [Deployment Checklist](./docs/deployment/DEPLOYMENT_CHECKLIST.md)
2. Set up environment variables
3. Build the project: `npm run build`
4. Deploy to your platform (Vercel, AWS, etc.)

## 🤝 Contributing

1. Check existing [documentation](./docs/)
2. Follow the coding standards
3. Write tests for new features
4. Update documentation as needed

## 📄 License

[Your License Here]

## 🆘 Support

For help and support:
- Check the [documentation](./docs/README.md)
- Review [troubleshooting guides](./docs/fixes/)
- Contact the development team

## 📧 Contact

[Your Contact Information]

---

Built with ❤️ by the itswift team

