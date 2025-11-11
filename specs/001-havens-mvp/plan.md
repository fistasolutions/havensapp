# Implementation Plan: Havens App MVP

**Branch**: `001-havens-mvp` | **Date**: 2025-11-11 | **Spec**: [spec.md](./spec.md)  
**Input**: Feature specification from `/specs/001-havens-mvp/spec.md`

## Summary

Build a comprehensive mental health and wellness mobile application MVP that provides 24/7 AI-powered emotional support through evidence-based therapeutic techniques. The implementation follows a 4-milestone approach: (1) Frontend UI/UX with 42 screens and minimalist design system, (2) PostgreSQL database with encryption, (3) RESTful API with AI/ML integration, (4) Final integration and polish. The app uses React Native for cross-platform mobile development, implements world-class HCI standards with a calming color palette optimized for mental health applications, and supports multiple user roles (Individual, Provider, Partner, Family-Friends, Kids) with role-specific interfaces.

## Technical Context

**Language/Version**: TypeScript 5.8+, React Native 0.82+, Node.js >= 20  
**Primary Dependencies**: 
- Frontend: React Navigation 6.x, React Native Reanimated 3.x, React Native Paper, AsyncStorage
- Backend: Express.js or Fastify, Prisma/TypeORM, PostgreSQL 14+
- Testing: Jest, React Native Testing Library, Detox (E2E)
- AI/ML: OpenAI API or Anthropic Claude API for chatbot, NLP service for sentiment analysis

**Storage**: 
- Local: React Native AsyncStorage for offline data caching
- Backend: PostgreSQL 14+ with pgcrypto for encrypted sensitive fields
- File Storage: Encrypted file storage for data exports

**Testing**: Jest for unit tests, React Native Testing Library for component tests, Detox for E2E tests, minimum 80% coverage for core features  
**Target Platform**: iOS 13+, Android API 21+ (React Native cross-platform)  
**Project Type**: Mobile application (React Native) with RESTful API backend  
**Performance Goals**: 60fps animations, <2s app launch time, <500ms screen transitions, <200ms API response time (p95)  
**Constraints**: 
- Offline-capable core features (mood tracking, journaling, basic chatbot responses)
- End-to-end encryption for all mental health data (AES-256 at rest, TLS 1.3 in transit)
- HIPAA compliance for provider mode
- WCAG 2.1 AA accessibility compliance
- GDPR, CCPA, and healthcare data regulation compliance

**Scale/Scope**: 
- 10,000+ concurrent users in beta
- 42 screens across 5 main tabs and role-specific flows
- 5-10 chatbot conversation flows
- 10-20 emotion labels for mood tracking
- 10-15 journaling templates
- 3-5 core self-help exercises

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

**Privacy & Security**: ✅ All mental health data (mood entries, journal entries, chatbot conversations) will be encrypted at rest (AES-256) and in transit (TLS 1.3). HIPAA compliance verified for provider mode with access controls, audit logs, and secure data handling. User data sovereignty with export and deletion capabilities.

**Evidence-Based**: ✅ All therapeutic content grounded in CBT, ACT, DBT, Mindfulness, Positive Psychology, and SEL. Professional review process established - all content must be reviewed by licensed mental health professionals before deployment. Safety disclaimers and crisis escalation protocols included.

**Mobile-First**: ✅ React Native 0.82+ prioritized for cross-platform development (iOS and Android). Offline capability designed into core features - mood tracking, journaling, and basic chatbot responses work without connectivity using local storage with sync when online.

**Accessibility**: ✅ WCAG 2.1 AA compliance verified - screen reader support, keyboard navigation, proper contrast ratios (4.5:1 minimum), touch target sizes (44x44px minimum), semantic HTML structure. Empathetic UX design with warm, non-judgmental language and calming color palette.

**TDD**: ✅ Test plan defined - unit tests for business logic, component tests for UI, E2E tests for critical user journeys. Coverage target: 80% minimum for core features. Tests written before implementation following Red-Green-Refactor cycle.

**Modularity**: ✅ Component-based architecture with reusable components and hooks. Feature-based folder structure (chatbot, mood-tracking, journaling, self-help, etc.). Clear separation of concerns with dependency injection for testability.

**Data Integrity**: ✅ Privacy-compliant analytics - anonymized and aggregated data only, explicit user consent required. Data retention policies clearly defined. Export functionality for user data portability. No user-facing analytics dashboards in MVP.

**Continuous Improvement**: ✅ Beta testing plan includes user feedback collection, A/B testing for therapeutic content effectiveness, performance monitoring, and regular dependency updates. Feedback loops integrated into development process.

## Project Structure

### Documentation (this feature)

```text
specs/001-havens-mvp/
├── plan.md              # This file (/speckit.plan command output)
├── spec.md              # Feature specification
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
│   ├── api-spec.yaml    # OpenAPI specification
│   └── api-spec.json    # OpenAPI JSON format
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
# Mobile Application (React Native)
src/
├── components/          # Reusable UI components
│   ├── common/          # Buttons, cards, inputs, etc.
│   ├── mood/           # Mood wheel, emotion selector
│   ├── journal/         # Journal editor, prompt cards
│   ├── chatbot/         # Chat bubbles, typing indicator
│   └── exercises/       # Exercise UI components
├── screens/            # Screen components organized by feature
│   ├── onboarding/     # Welcome, role selection, consent
│   ├── auth/           # Login, registration, provider verification
│   ├── home/           # Dashboard screen
│   ├── chat/           # Chatbot screens
│   ├── mood/           # Mood tracking screens
│   ├── journal/        # Journaling screens
│   ├── resources/      # Self-help exercise screens
│   ├── settings/       # Settings and profile screens
│   ├── crisis/         # Crisis resources screens
│   └── role-specific/  # Provider, Partner, Family, Kids screens
├── navigation/         # Navigation configuration
│   ├── AppNavigator.tsx
│   ├── TabNavigator.tsx
│   └── StackNavigator.tsx
├── services/           # Business logic and API services
│   ├── api/            # API client, endpoints
│   ├── storage/        # Local storage, offline sync
│   ├── auth/           # Authentication service
│   ├── chatbot/        # Chatbot service integration
│   ├── mood/           # Mood tracking service
│   ├── journal/        # Journaling service
│   └── analytics/      # Privacy-compliant analytics
├── hooks/              # Custom React hooks
├── utils/              # Utility functions
├── constants/          # App constants, design tokens
│   ├── colors.ts       # Color palette
│   ├── spacing.ts      # Spacing system
│   ├── typography.ts   # Typography system
│   └── emotions.ts     # Emotion labels and colors
├── types/              # TypeScript type definitions
└── contexts/           # React contexts for global state

# Backend API
api/
├── src/
│   ├── controllers/    # Request handlers
│   ├── services/       # Business logic
│   ├── models/         # Data models (Prisma/TypeORM)
│   ├── routes/         # API routes
│   ├── middleware/     # Auth, validation, error handling
│   ├── utils/          # Utility functions
│   └── config/          # Configuration
├── prisma/             # Prisma schema and migrations
│   ├── schema.prisma
│   └── migrations/
└── tests/
    ├── unit/
    ├── integration/
    └── e2e/

# Tests
__tests__/
├── components/         # Component tests
├── screens/            # Screen tests
├── services/           # Service tests
└── e2e/               # End-to-end tests

# Design System Documentation
docs/
├── design-system.md    # Design tokens, components
├── screens/            # Screen mockups and specifications
└── navigation.md       # Navigation flow diagrams
```

**Structure Decision**: Mobile + API architecture selected. React Native mobile app in `src/` directory with feature-based organization. Backend API in `api/` directory using Node.js with Express/Fastify and Prisma/TypeORM for database access. This structure supports the 4-milestone approach: Milestone 1 focuses on `src/` frontend, Milestone 2 on `api/prisma/` database, Milestone 3 on `api/src/` API layer, and Milestone 4 on integration and testing.

## Implementation Milestones

### Milestone 1: Frontend UI/UX Implementation
**Focus**: React Native screens, navigation, design system, mock data

**Deliverables**:
- 42 screens implemented with React Native
- Bottom tab navigation (Home, Chat, Mood, Journal, Resources)
- Stack navigation for secondary flows
- Modal navigation for crisis resources and important actions
- Complete design system (colors, typography, spacing, components)
- All screens accessible and WCAG 2.1 AA compliant
- 60fps animations using React Native Reanimated
- Mock data services for development

**Screens to Implement** (42 total):
- Onboarding & Auth: 7 screens
- Main App (Tabs): 13 screens
- Role-Specific: 11 screens
- Settings & Profile: 5 screens
- Crisis & Safety: 2 screens
- Utility: 4 screens

### Milestone 2: Database Design & Implementation
**Focus**: PostgreSQL schema, migrations, encryption, data retention

**Deliverables**:
- Complete database schema with all tables
- Relationships and foreign keys
- Indexes for performance
- Encryption setup (pgcrypto) for sensitive fields
- Migration system
- Data retention policy implementation
- Backup and recovery procedures

### Milestone 3: API Development & Integration
**Focus**: RESTful API, authentication, AI/ML integration, offline sync

**Deliverables**:
- RESTful API with OpenAPI documentation
- JWT authentication and authorization
- All CRUD endpoints for entities
- AI/ML service integration (chatbot, sentiment analysis)
- Offline sync mechanism
- Frontend-backend integration
- Rate limiting and security middleware

### Milestone 4: Final App Integration & Polish
**Focus**: Testing, optimization, security, app store preparation

**Deliverables**:
- End-to-end testing (all user journeys)
- Performance optimization (60fps, <2s launch)
- Security audit and hardening
- Accessibility audit and fixes
- Beta testing preparation
- App store assets and compliance
- Documentation and deployment guides

## Complexity Tracking

> No constitution violations - all requirements align with established principles.
