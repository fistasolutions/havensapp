<!--
Sync Impact Report:
Version change: Template → 1.0.0
Modified principles: All 8 principles added
Added sections: Privacy & Security, Evidence-Based Approach, Mobile-First Architecture, UX & Accessibility, TDD, Modular Code, Data Integrity, Continuous Improvement
Removed sections: None (template replaced)
Templates requiring updates:
  ✅ plan-template.md - Constitution Check section updated
  ✅ spec-template.md - Aligned with privacy and evidence-based requirements
  ✅ tasks-template.md - Reflects TDD and modular architecture principles
Follow-up TODOs: None
-->

# Havens App Constitution

## Core Principles

### I. Privacy & Security First (NON-NEGOTIABLE)
All mental health data MUST be encrypted at rest and in transit. HIPAA-compliant privacy practices are mandatory for provider mode. Users have complete data sovereignty: they control their data, can export it, and delete it at any time. No data sharing occurs without explicit user consent. Secure authentication and authorization are required throughout the application. Regular security audits and vulnerability assessments must be conducted. The app MUST comply with GDPR, CCPA, and healthcare data regulations. Privacy and security are not negotiable - they are foundational to user trust and legal compliance.

### II. Evidence-Based Therapeutic Approach
All therapeutic content MUST be grounded in evidence-based practices: Cognitive Behavioral Therapy (CBT), Acceptance and Commitment Therapy (ACT), Dialectical Behavior Therapy (DBT), Mindfulness, Positive Psychology, and Social-Emotional Learning (SEL). Safety disclaimers must be clear: the app is not a substitute for professional mental health care. Crisis detection and escalation protocols are mandatory for high-risk situations. All therapeutic content must be reviewed by mental health professionals before deployment. Regular updates based on latest research and user feedback are required to maintain evidence-based standards.

### III. Mobile-First Architecture
React Native is the primary framework for cross-platform development. TypeScript is mandatory for type safety and maintainability. Offline-first capabilities are required: core features must work without internet connectivity. Performance optimization is critical: smooth 60fps animations and fast load times are non-negotiable. Native module integration is used when needed for platform-specific features. Responsive design must adapt to various screen sizes and device capabilities. The architecture prioritizes mobile user experience above all else.

### IV. User Experience & Accessibility
The interface design MUST be empathetic and non-judgmental. Accessibility compliance (WCAG 2.1 AA minimum) is mandatory. Navigation must be simple and intuitive - users should never feel lost. Age-appropriate interfaces are required for different user roles, especially kids mode. Multilingual support readiness must be built into the architecture. Dark mode and theme customization are required features. All language throughout the app must be clear, compassionate, and therapeutic in tone.

### V. Test-Driven Development (NON-NEGOTIABLE)
TDD is mandatory: tests MUST be written before implementation. Unit tests are required for all business logic and utilities. Integration tests are required for API interactions and data flows. End-to-end tests are required for critical user journeys. Test coverage minimum is 80% for core features. Manual testing is required for therapeutic content accuracy and empathy. The Red-Green-Refactor cycle is strictly enforced. No code is merged without passing tests.

### VI. Modular & Maintainable Code
Component-based architecture with clear separation of concerns is mandatory. Reusable components and hooks must be prioritized. Feature-based folder structure is required for scalability. Dependency injection is used for testability. Clear documentation is required for complex therapeutic logic. Code reviews are mandatory for all pull requests. Code must be maintainable by any team member, not just the original author.

### VII. Data Integrity & Analytics
Privacy-compliant analytics only: anonymized, aggregated data. User consent is required for all data collection. Data retention policies must be clearly defined and communicated. Export functionality for user data portability is mandatory. Backend analytics for beta testing are internal use only. No user-facing analytics dashboards in MVP. All analytics must respect user privacy and comply with regulations.

### VIII. Continuous Improvement
Regular beta testing with real users is required. Feedback loops must be integrated into the development process. A/B testing for therapeutic content effectiveness is encouraged. Performance monitoring and optimization are ongoing requirements. Regular dependency updates and security patches are mandatory. The app must evolve based on user needs and evidence-based research.

## Technology Stack & Constraints

**Primary Framework**: React Native 0.82+ with TypeScript  
**Runtime**: Node.js >= 20  
**Platform Support**: iOS 13+, Android API 21+  
**State Management**: Context API or Redux (decision pending based on complexity)  
**Navigation**: React Navigation  
**Testing Stack**: Jest, React Native Testing Library, Detox (E2E)  
**Performance Goals**: 60fps animations, <2s app launch time, <500ms screen transitions  
**Offline Capability**: Core features (mood tracking, journaling, chatbot) must work offline  
**Scale**: Designed for 10k+ concurrent users in beta, scalable to 100k+  

## Compliance & Safety Requirements

**HIPAA Compliance**: Required for provider mode with secure data handling and access controls  
**COPPA Compliance**: Mandatory for children's mode with parental consent and oversight  
**Crisis Intervention**: Clear pathways to emergency services must be accessible at all times  
**Content Moderation**: Required for user-generated content to ensure safety  
**Legal Reviews**: Regular compliance reviews with legal and healthcare professionals  
**Safety Disclaimers**: Clear disclaimers that app is not a substitute for professional care  
**Data Encryption**: End-to-end encryption for all sensitive mental health data  

## Development Workflow

**Branch Strategy**: Feature branches with descriptive names following pattern: `feature/description` or `fix/description`  
**Code Review**: Pull requests require minimum 1 approval before merge  
**CI/CD**: Automated pipeline with tests, linting, and security checks  
**Environments**: Development, Staging (for beta testing), Production  
**Deployment**: Production deployments require explicit approval  
**Documentation**: All features must include README updates and API documentation  
**Release Process**: Semantic versioning (MAJOR.MINOR.PATCH) with changelog updates  

## Governance

The Constitution supersedes all other development practices. All team members must acknowledge and follow the Constitution. Amendments require team consensus, documentation, and version updates. Regular Constitution reviews occur quarterly to ensure relevance. Violations must be addressed immediately. The Constitution is a living document that evolves with the project while maintaining core principles.

**Version**: 1.0.0 | **Ratified**: 2025-11-11 | **Last Amended**: 2025-11-11
