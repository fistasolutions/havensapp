# 🏠 Havens App

<div align="center">

![React Native](https://img.shields.io/badge/React%20Native-0.82.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-20+-339933?style=for-the-badge&logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-14+-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![License](https://img.shields.io/badge/License-Private-red?style=for-the-badge)

**A comprehensive mental health and wellness mobile application providing 24/7 AI-powered emotional support through evidence-based therapeutic techniques.**

[Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Architecture](#-architecture) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Development Guide](#-development-guide)
- [Testing](#-testing)
- [API Documentation](#-api-documentation)
- [Security & Privacy](#-security--privacy)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [Support](#-support)
- [License](#-license)

---

## 🎯 Overview

**Havens App** is a React Native mobile application designed to provide accessible, evidence-based mental health and wellness support. The app offers 24/7 AI-powered emotional support through a sophisticated chatbot, comprehensive mood tracking, guided journaling, and self-help resources—all built on proven therapeutic techniques including CBT, ACT, DBT, and Mindfulness.

### Key Highlights

- 🤖 **AI-Powered Chatbot**: 24/7 emotional support using evidence-based therapeutic techniques
- 📊 **Mood Tracking**: Visual mood wheel and trend analysis to build self-awareness
- 📝 **Guided Journaling**: AI-generated personalized prompts with sentiment analysis
- 🧘 **Self-Help Resources**: Breathing exercises, mindfulness, and distress tolerance techniques
- 👥 **Multi-Role Support**: Individual, Provider, Partner, Family-Friends, and Kid modes
- 🔒 **Privacy-First**: HIPAA-compliant, GDPR-compliant, with end-to-end encryption
- 📱 **Offline-First**: Core features work offline with seamless sync
- ♿ **Accessible**: WCAG 2.1 AA compliant design

### Mission

To make mental health support accessible, private, and effective for everyone, regardless of their circumstances or location.

---

## ✨ Features

### Core Features

#### 1. **AI Chatbot for 24/7 Emotional Support** (Priority: P1)
- Text-based conversation with AI coach using evidence-based techniques
- 5-10 predefined conversation flows (anxiety relief, stress management, depression support)
- Contextual responses based on conversation history and mood data
- Crisis detection with immediate resource provision
- Personalized therapeutic interventions (CBT, ACT, DBT, Mindfulness)

#### 2. **Daily Mood Tracking** (Priority: P1)
- Quick check-in interface with 10-20 emotion labels
- Visual mood wheel for intuitive emotion selection
- Trend graphs showing patterns over time (daily, weekly, monthly)
- Offline logging with automatic sync
- Data export for sharing with therapists

#### 3. **Guided Journaling Prompts** (Priority: P2)
- AI-generated personalized prompts based on mood logs
- 10-15 journaling templates (gratitude, goal-setting, stress reflection)
- Sentiment analysis with insights and reframing suggestions
- Offline journaling with secure local storage
- Chronological entry history with sentiment indicators

#### 4. **Self-Help Resources** (Priority: P2)
- Breathing guides (4-7-8 technique, box breathing)
- Mindfulness tips and short meditation sessions (1-5 minutes)
- Positive affirmations
- Distress tolerance exercises (DBT-based TIPP)
- Progressive muscle relaxation
- Progress tracking to encourage daily use

#### 5. **Multi-User Role Support** (Priority: P2)
- **Individual**: Standard wellness features
- **Provider**: HIPAA-compliant tools for client support
- **Partner**: Relationship-focused wellness features with shared journals
- **Family-Friends**: Group support tools and anonymous mood polls
- **Kid**: Age-appropriate, parent-supervised interactions (COPPA-compliant)

#### 6. **Analytics & Feedback** (Priority: P3)
- Privacy-compliant analytics (anonymized, aggregated)
- User feedback forms after sessions
- Explicit consent for data collection
- Internal dashboards for beta testing and iteration

### Advanced Features

- 🔐 **Secure Authentication**: JWT-based with MFA support for providers
- 📦 **Offline Support**: Core features work without internet connectivity
- 🔄 **Data Sync**: Automatic synchronization when connectivity returns
- 📤 **Data Export**: Complete data export in privacy-compliant formats
- 🗑️ **Data Deletion**: Permanent data deletion with user confirmation
- 🚨 **Crisis Detection**: Automatic detection of high-risk language with escalation protocols
- 🎨 **Accessibility**: WCAG 2.1 AA compliant with screen reader support
- 🌍 **Multi-Region Compliance**: GDPR, CCPA, and healthcare data regulations

---

## 🛠️ Tech Stack

### Frontend (Mobile App)

| Technology | Version | Purpose |
|------------|---------|---------|
| **React Native** | 0.82.1 | Cross-platform mobile framework |
| **TypeScript** | 5.8+ | Type-safe development |
| **React Navigation** | 7.x | Navigation and routing |
| **React Native Reanimated** | 4.1.5 | Smooth animations (60fps target) |
| **AsyncStorage** | 2.2.0 | Local data persistence |
| **Axios** | 1.13.2 | HTTP client for API calls |

### Backend (API Server)

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 20+ | Runtime environment |
| **Express** | 5.1.0 | Web framework |
| **TypeScript** | 5.9+ | Type-safe backend development |
| **Prisma** | 6.19.0 | ORM and database management |
| **PostgreSQL** | 14+ | Primary database |
| **JWT** | 9.0.2 | Authentication tokens |
| **bcrypt** | 6.0.0 | Password hashing |

### Development Tools

- **Jest**: Testing framework
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **React Native Testing Library**: Component testing
- **Nodemon**: Development server auto-reload

### Infrastructure & Services

- **PostgreSQL**: Database with pgcrypto extension for encryption
- **AI/ML Services**: Chatbot, sentiment analysis, personalization
- **Analytics Platform**: Privacy-compliant analytics (anonymized)

---

## 🏗️ Architecture

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    React Native Mobile App                    │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Chat   │  │   Mood   │  │ Journal  │  │ Resources│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Offline Storage (AsyncStorage)               │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │ HTTPS/TLS 1.3
                            │
┌───────────────────────────▼─────────────────────────────────┐
│                    Express API Server                        │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │  Mood    │  │ Journal  │  │  Chatbot │   │
│  │Middleware│  │Controller│  │Controller│  │Controller│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                               │
│  ┌──────────────────────────────────────────────────────┐   │
│  │         Services Layer (AI, Analytics, etc.)         │   │
│  └──────────────────────────────────────────────────────┘   │
└───────────────────────────┬─────────────────────────────────┘
                            │
┌───────────────────────────▼─────────────────────────────────┐
│              PostgreSQL Database (Encrypted)                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │  Users   │  │   Mood   │  │ Journal  │  │  Chat    │   │
│  │          │  │ Entries  │  │ Entries  │  │Conversat.│   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Data Flow

1. **User Interaction**: User interacts with React Native app
2. **Local Storage**: Data stored locally via AsyncStorage (offline support)
3. **API Request**: HTTP requests to Express backend (when online)
4. **Authentication**: JWT token validation via middleware
5. **Business Logic**: Controllers process requests and call services
6. **Database**: Prisma ORM interacts with PostgreSQL
7. **Response**: Encrypted data returned to mobile app
8. **Sync**: Offline data synced when connectivity returns

### Security Architecture

- **Encryption at Rest**: AES-256 encryption for sensitive data
- **Encryption in Transit**: TLS 1.3 for all communications
- **Authentication**: JWT tokens with secure storage
- **Authorization**: Role-based access control (RBAC)
- **Audit Logging**: Comprehensive audit trails for provider mode
- **Data Privacy**: GDPR, CCPA, HIPAA compliance

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software

- **Node.js**: >= 20.0.0 ([Download](https://nodejs.org/))
- **npm** or **yarn**: Package manager
- **PostgreSQL**: >= 14.0 ([Download](https://www.postgresql.org/download/))
- **Git**: Version control ([Download](https://git-scm.com/))

### Platform-Specific Requirements

#### iOS Development
- **macOS**: Required for iOS development
- **Xcode**: >= 14.0 ([Download from App Store](https://apps.apple.com/us/app/xcode/id497799835))
- **CocoaPods**: `sudo gem install cocoapods`
- **Ruby**: >= 2.7 (usually pre-installed on macOS)

#### Android Development
- **Android Studio**: Latest version ([Download](https://developer.android.com/studio))
- **Java Development Kit (JDK)**: 17 or higher
- **Android SDK**: API Level 21+ (Android 5.0+)
- **Android Emulator** or physical device

### Recommended Tools

- **VS Code**: Code editor with React Native extensions
- **Postman** or **Insomnia**: API testing
- **Prisma Studio**: Database GUI (`npx prisma studio`)

---

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd havensapp
```

### 2. Install Dependencies

#### Frontend (Mobile App)

```bash
# Install Node.js dependencies
npm install

# iOS: Install CocoaPods dependencies
cd ios
bundle install
bundle exec pod install
cd ..
```

#### Backend (API Server)

```bash
cd api
npm install
cd ..
```

### 3. Set Up Environment Variables

#### Frontend

Create `.env` file in the root directory:

```env
API_BASE_URL=http://localhost:3000/api/v1
ENVIRONMENT=development
```

#### Backend

Create `.env` file in the `api` directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/havensapp?schema=public"

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=development

# AI Services (if applicable)
OPENAI_API_KEY=your-openai-api-key
# or
ANTHROPIC_API_KEY=your-anthropic-api-key

# Encryption
ENCRYPTION_KEY=your-32-character-encryption-key
```

### 4. Set Up Database

```bash
cd api

# Generate Prisma Client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# (Optional) Seed database
npx prisma db seed
```

### 5. Start Development Servers

#### Terminal 1: Metro Bundler

```bash
npm start
```

#### Terminal 2: Backend API Server

```bash
cd api
npm run dev
```

#### Terminal 3: Run Mobile App

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

### 6. Verify Installation

- ✅ Metro bundler running on port 8081
- ✅ API server running on port 3000
- ✅ Mobile app launches on simulator/device
- ✅ Database connection successful

---

## 📁 Project Structure

```
havensapp/
├── api/                          # Backend API server
│   ├── prisma/                   # Database schema and migrations
│   │   ├── schema.prisma         # Prisma schema definition
│   │   └── seed.ts               # Database seed script
│   ├── src/
│   │   ├── config/               # Configuration files
│   │   │   └── database.ts       # Database connection
│   │   ├── controllers/          # Request handlers
│   │   │   ├── analyticsController.ts
│   │   │   ├── chatbotController.ts
│   │   │   ├── exerciseController.ts
│   │   │   ├── journalController.ts
│   │   │   └── moodController.ts
│   │   ├── middleware/           # Express middleware
│   │   │   ├── auth.ts           # Authentication middleware
│   │   │   ├── errorHandler.ts   # Error handling
│   │   │   └── roleAuth.ts       # Role-based authorization
│   │   ├── routes/               # API routes
│   │   │   ├── auth.ts
│   │   │   ├── chatbot.ts
│   │   │   ├── exercises.ts
│   │   │   ├── journal.ts
│   │   │   ├── mood.ts
│   │   │   └── index.ts
│   │   ├── services/             # Business logic
│   │   │   ├── aiService.ts      # AI/ML integration
│   │   │   ├── analyticsService.ts
│   │   │   ├── chatbotService.ts
│   │   │   ├── crisisDetection.ts
│   │   │   ├── exerciseService.ts
│   │   │   ├── journalService.ts
│   │   │   ├── moodService.ts
│   │   │   └── sentimentAnalysis.ts
│   │   ├── utils/                # Utility functions
│   │   │   ├── jwt.ts            # JWT utilities
│   │   │   └── password.ts       # Password hashing
│   │   └── server.ts             # Express server entry point
│   ├── tests/                    # Backend tests
│   │   ├── contract/             # Contract tests
│   │   ├── e2e/                  # End-to-end tests
│   │   ├── integration/          # Integration tests
│   │   └── unit/                 # Unit tests
│   ├── package.json
│   └── tsconfig.json
│
├── src/                          # React Native mobile app
│   ├── components/               # Reusable UI components
│   │   ├── chatbot/             # Chatbot components
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── CrisisButton.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── common/              # Common components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Input.tsx
│   │   │   └── LoadingIndicator.tsx
│   │   ├── exercises/           # Exercise components
│   │   ├── journal/             # Journal components
│   │   └── mood/                # Mood tracking components
│   ├── constants/               # Design system constants
│   │   ├── colors.ts            # Color palette
│   │   ├── emotions.ts          # Emotion definitions
│   │   ├── spacing.ts           # Spacing scale
│   │   └── typography.ts        # Typography styles
│   ├── contexts/                # React contexts
│   │   └── RoleContext.tsx      # User role context
│   ├── navigation/              # Navigation configuration
│   │   ├── AppNavigator.tsx     # Main navigator
│   │   ├── StackNavigator.tsx   # Stack navigation
│   │   └── TabNavigator.tsx     # Tab navigation
│   ├── screens/                 # Screen components
│   │   ├── auth/                # Authentication screens
│   │   ├── chat/                # Chatbot screens
│   │   ├── journal/             # Journaling screens
│   │   ├── mood/                # Mood tracking screens
│   │   ├── onboarding/          # Onboarding screens
│   │   ├── resources/           # Self-help resources
│   │   └── settings/            # Settings screens
│   ├── services/                # Business logic and API calls
│   │   ├── api/                 # API client
│   │   │   └── client.ts        # Axios configuration
│   │   ├── auth/                # Authentication service
│   │   ├── chatbot/             # Chatbot service
│   │   ├── data/                # Data management
│   │   ├── exercises/           # Exercise service
│   │   ├── journal/             # Journal service
│   │   ├── mood/                # Mood service
│   │   └── storage/             # Local storage utilities
│   ├── types/                   # TypeScript type definitions
│   └── utils/                   # Utility functions
│
├── __tests__/                   # Frontend tests
│   ├── components/              # Component tests
│   ├── e2e/                     # End-to-end tests
│   ├── integration/             # Integration tests
│   ├── screens/                 # Screen tests
│   └── services/                # Service tests
│
├── android/                     # Android native code
├── ios/                         # iOS native code
│
├── specs/                       # Project specifications
│   └── 001-havens-mvp/         # MVP specification
│       ├── spec.md             # Feature specification
│       ├── data-model.md       # Database schema documentation
│       ├── quickstart.md       # Quick start guide
│       └── tasks.md            # Task breakdown
│
├── App.tsx                      # Main app component
├── package.json                 # Frontend dependencies
├── tsconfig.json                # TypeScript configuration
├── babel.config.js              # Babel configuration
├── metro.config.js              # Metro bundler configuration
└── README.md                    # This file
```

---

## 💻 Development Guide

### Development Workflow

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the coding standards (see [Contributing](#-contributing))
   - Write tests for new features
   - Update documentation as needed

3. **Test your changes**
   ```bash
   # Run frontend tests
   npm test

   # Run backend tests
   cd api && npm test
   ```

4. **Commit your changes**
   ```bash
   git commit -m "feat: add new feature description"
   ```

5. **Push and create a Pull Request**
   ```bash
   git push origin feature/your-feature-name
   ```

### Code Organization

- **Components**: Reusable UI components in `src/components/`
- **Screens**: Screen components in `src/screens/`
- **Services**: Business logic and API calls in `src/services/`
- **Navigation**: Navigation configuration in `src/navigation/`
- **Constants**: Design tokens in `src/constants/`
- **Types**: TypeScript definitions in `src/types/`

### Coding Standards

- **TypeScript**: Strict mode enabled, no `any` types
- **ESLint**: Follow ESLint rules (run `npm run lint`)
- **Prettier**: Auto-format on save
- **Naming**: Use descriptive names, camelCase for variables, PascalCase for components
- **Comments**: Document complex logic and business rules

### Design System

The app uses a consistent design system defined in `src/constants/`:

- **Colors**: Serene blue, soft teal, warm lavender palette
- **Spacing**: 4px base unit (xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48)
- **Typography**: System fonts with defined sizes and weights
- **Accessibility**: WCAG 2.1 AA compliant contrast ratios

### Performance Guidelines

- **Target 60fps** for all animations
- **Optimize images** and use appropriate formats
- **Use FlatList** for long lists with proper `keyExtractor`
- **Implement caching** for API responses
- **Lazy load** screens and components when possible

### Offline Support

Core features (mood tracking, journaling) work offline:

1. Data stored locally via AsyncStorage
2. Queue sync requests when offline
3. Automatic sync when connectivity returns
4. Conflict resolution for concurrent edits

---

## 🧪 Testing

### Frontend Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- ChatbotScreen.test.tsx
```

### Backend Testing

```bash
cd api

# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run with coverage
npm test -- --coverage
```

### Test Structure

- **Unit Tests**: Test individual functions and components
- **Integration Tests**: Test API endpoints and services
- **E2E Tests**: Test complete user flows
- **Contract Tests**: Test API contracts between frontend and backend

### Writing Tests

```typescript
// Example: Component test
import { render, fireEvent } from '@testing-library/react-native';
import { MoodLoggingScreen } from '../src/screens/mood/MoodLoggingScreen';

describe('MoodLoggingScreen', () => {
  it('should render mood wheel', () => {
    const { getByTestId } = render(<MoodLoggingScreen />);
    expect(getByTestId('mood-wheel')).toBeTruthy();
  });

  it('should log mood when emotion is selected', () => {
    const { getByText, getByTestId } = render(<MoodLoggingScreen />);
    fireEvent.press(getByText('Happy'));
    expect(getByTestId('mood-logged')).toBeTruthy();
  });
});
```

---

## 📡 API Documentation

### Base URL

- **Development**: `http://localhost:3000/api/v1`
- **Production**: `https://api.havensapp.com/v1`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Authentication

- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user

#### Mood Tracking

- `GET /mood/entries` - Get user's mood entries
- `POST /mood/entries` - Create new mood entry
- `GET /mood/trends` - Get mood trends (daily/weekly/monthly)
- `GET /mood/entries/:id` - Get specific mood entry

#### Journaling

- `GET /journal/entries` - Get user's journal entries
- `POST /journal/entries` - Create new journal entry
- `GET /journal/prompts` - Get personalized journaling prompts
- `GET /journal/entries/:id` - Get specific journal entry
- `PUT /journal/entries/:id` - Update journal entry
- `DELETE /journal/entries/:id` - Delete journal entry

#### Chatbot

- `POST /chatbot/conversations` - Start new conversation
- `POST /chatbot/conversations/:id/messages` - Send message
- `GET /chatbot/conversations/:id` - Get conversation history
- `GET /chatbot/flows` - Get available conversation flows

#### Exercises

- `GET /exercises` - Get available exercises
- `GET /exercises/:id` - Get exercise details
- `POST /exercises/:id/complete` - Mark exercise as complete
- `GET /exercises/progress` - Get user's exercise progress

#### Analytics (Internal)

- `POST /analytics/events` - Log analytics event (anonymized)

### API Response Format

```typescript
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error message",
    "details": { ... }
  }
}
```

### Rate Limiting

- **Standard users**: 100 requests per minute
- **Provider users**: 200 requests per minute

### OpenAPI Specification

Full API documentation available at `/api-docs` (when Swagger is configured).

---

## 🔒 Security & Privacy

### Data Encryption

- **At Rest**: AES-256 encryption for sensitive data (mood notes, journal entries, chatbot conversations)
- **In Transit**: TLS 1.3 for all API communications
- **Database**: PostgreSQL with pgcrypto extension

### Authentication & Authorization

- **JWT Tokens**: Secure token-based authentication
- **MFA**: Multi-factor authentication required for provider accounts
- **Role-Based Access Control**: Different permissions for different user roles
- **Session Management**: Secure token storage and refresh

### Privacy Compliance

- **HIPAA**: Compliant for provider mode with audit logs
- **GDPR**: Right to access, delete, and export data
- **CCPA**: California Consumer Privacy Act compliance
- **COPPA**: Children's Online Privacy Protection Act for Kid mode

### Data Handling

- **Explicit Consent**: Users must consent to data collection
- **Data Minimization**: Only collect necessary data
- **Data Retention**: User-configurable retention periods
- **Data Deletion**: Permanent deletion within 24 hours
- **Data Export**: Complete data export in machine-readable format

### Security Best Practices

- Regular security audits
- Dependency vulnerability scanning
- Secure coding practices
- Input validation and sanitization
- SQL injection prevention (Prisma ORM)
- XSS protection
- CSRF protection

---

## 🚀 Deployment

### Prerequisites

- Production database (PostgreSQL)
- Environment variables configured
- SSL certificates for HTTPS
- CI/CD pipeline configured

### Build Process

#### Frontend (Mobile App)

**iOS:**
```bash
# Build for iOS
cd ios
xcodebuild -workspace HavensApp.xcworkspace -scheme HavensApp -configuration Release
```

**Android:**
```bash
# Build APK
cd android
./gradlew assembleRelease

# Build AAB (for Play Store)
./gradlew bundleRelease
```

#### Backend (API Server)

```bash
cd api

# Build TypeScript
npm run build

# Start production server
npm start
```

### Environment Variables (Production)

Ensure all production environment variables are set:

- `DATABASE_URL`: Production database connection
- `JWT_SECRET`: Strong, random secret key
- `NODE_ENV=production`
- `PORT`: Production port (typically 3000 or 80/443)

### Database Migrations

```bash
cd api

# Run migrations in production
npx prisma migrate deploy

# Generate Prisma Client
npm run prisma:generate
```

### Monitoring

- **Error Tracking**: Set up error monitoring (e.g., Sentry)
- **Performance Monitoring**: Monitor API response times
- **Logging**: Centralized logging for debugging
- **Analytics**: Privacy-compliant analytics tracking

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Write tests for your changes
5. Ensure all tests pass
6. Commit your changes (`git commit -m 'feat: add amazing feature'`)
7. Push to the branch (`git push origin feature/amazing-feature`)
8. Open a Pull Request

### Commit Message Format

We follow [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, etc.)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Code Review Process

1. All PRs require at least one approval
2. All tests must pass
3. Code must follow style guidelines
4. Documentation must be updated

### Development Guidelines

- Write clear, self-documenting code
- Add comments for complex logic
- Follow TypeScript best practices
- Maintain test coverage above 80%
- Update documentation for new features

---

## 📞 Support

### Documentation

- **Specification**: `specs/001-havens-mvp/spec.md`
- **Data Model**: `specs/001-havens-mvp/data-model.md`
- **Quick Start**: `specs/001-havens-mvp/quickstart.md`
- **Tasks**: `specs/001-havens-mvp/tasks.md`

### Getting Help

- **Issues**: Open an issue on GitHub for bugs or feature requests
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact the development team

### Reporting Bugs

When reporting bugs, please include:

- Description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Device/OS information
- App version

### Feature Requests

We welcome feature requests! Please:

- Check if the feature already exists
- Describe the use case
- Explain the expected behavior
- Consider implementation complexity

---

## 📄 License

This project is **private** and proprietary. All rights reserved.

**Copyright © 2025 FISTA Solutions. All rights reserved.**

Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

## 🙏 Acknowledgments

- **React Native Community**: For the amazing framework
- **Mental Health Professionals**: For reviewing therapeutic content
- **Open Source Contributors**: For the libraries that make this possible
- **Beta Testers**: For valuable feedback and testing

---

## 📊 Project Status

**Current Version**: 0.0.1 (MVP Development)

**Status**: 🟡 In Active Development

### Completed Features

- ✅ Project structure and setup
- ✅ Design system and constants
- ✅ Navigation structure
- ✅ Component library foundation
- ✅ Database schema (Prisma)
- ✅ API server foundation
- ✅ Authentication system
- ✅ Basic screen implementations

### In Progress

- 🚧 AI chatbot integration
- 🚧 Mood tracking implementation
- 🚧 Journaling features
- 🚧 Self-help exercises
- 🚧 Offline sync functionality

### Planned Features

- 📋 Provider mode enhancements
- 📋 Partner pairing features
- 📋 Family/Friends group features
- 📋 Advanced analytics
- 📋 Push notifications

---

## 🔗 Related Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

---

<div align="center">

**Built with ❤️ by the Havens App Team**

[⬆ Back to Top](#-havens-app)

</div>
