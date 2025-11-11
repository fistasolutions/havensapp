# Tasks: Havens App MVP

**Input**: Design documents from `/specs/001-havens-mvp/`  
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are included following TDD approach as specified in constitution (80% coverage minimum for core features).

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Path Conventions

- **Mobile App**: `src/` at repository root
- **Backend API**: `api/src/` at repository root
- **Tests**: `__tests__/` at repository root

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan in repository root
- [x] T002 Initialize React Native project with TypeScript configuration in root directory
- [x] T003 [P] Install core dependencies: React Navigation, Reanimated, AsyncStorage in package.json
- [x] T004 [P] Configure ESLint and Prettier in .eslintrc.js and .prettierrc.js
- [x] T005 [P] Set up Jest testing framework in jest.config.js
- [x] T006 [P] Create design system constants: colors.ts in src/constants/
- [x] T007 [P] Create design system constants: spacing.ts in src/constants/
- [x] T008 [P] Create design system constants: typography.ts in src/constants/
- [x] T009 [P] Create design system constants: emotions.ts in src/constants/
- [x] T010 Create base folder structure: src/components/, src/screens/, src/services/, src/navigation/ in repository root

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

### Database Setup (Milestone 2 Foundation)

- [x] T011 Initialize Prisma in api/ directory with npx prisma init
- [x] T012 Create Prisma schema file with User model in api/prisma/schema.prisma
- [x] T013 Configure PostgreSQL connection and pgcrypto extension in api/prisma/schema.prisma
- [x] T014 Create initial database migration in api/prisma/migrations/
- [x] T015 Generate Prisma client with npx prisma generate

### Authentication Framework

- [x] T016 [P] Create authentication service structure in src/services/auth/
- [x] T017 [P] Implement JWT token generation utility in api/src/utils/jwt.ts
- [x] T018 [P] Implement password hashing utility with bcrypt in api/src/utils/password.ts
- [x] T019 Create authentication middleware in api/src/middleware/auth.ts
- [x] T020 Create login endpoint in api/src/routes/auth.ts
- [x] T021 Create registration endpoint in api/src/routes/auth.ts

### API Infrastructure

- [x] T022 Initialize Express server in api/src/server.ts
- [x] T023 Configure CORS and security middleware in api/src/server.ts
- [x] T024 Set up error handling middleware in api/src/middleware/errorHandler.ts
- [x] T025 Create API route structure in api/src/routes/
- [x] T026 Configure environment variables in api/.env.example

### Frontend Infrastructure

- [x] T027 Create navigation structure: AppNavigator.tsx in src/navigation/
- [x] T028 Create TabNavigator component in src/navigation/TabNavigator.tsx
- [x] T029 Create StackNavigator component in src/navigation/StackNavigator.tsx
- [x] T030 Create API client service in src/services/api/client.ts
- [x] T031 Create local storage service in src/services/storage/localStorage.ts
- [x] T032 Create offline sync service structure in src/services/storage/sync.ts

### Base Components

- [x] T033 [P] Create Button component in src/components/common/Button.tsx
- [x] T034 [P] Create Card component in src/components/common/Card.tsx
- [x] T035 [P] Create Input component in src/components/common/Input.tsx
- [x] T036 [P] Create LoadingIndicator component in src/components/common/LoadingIndicator.tsx
- [x] T037 [P] Create ErrorMessage component in src/components/common/ErrorMessage.tsx

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - AI Chatbot for 24/7 Emotional Support (Priority: P1) 🎯 MVP

**Goal**: Users can access 24/7 AI-powered emotional support through text-based conversations with evidence-based therapeutic techniques (CBT, ACT, DBT, Mindfulness). Chatbot remembers conversations and provides contextual prompts based on mood data.

**Independent Test**: User opens app, taps "Chat with AI Coach", engages in conversation about emotional state, receives empathetic evidence-based responses. Works independently without other features.

### Tests for User Story 1

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [x] T038 [P] [US1] Unit test for chatbot service in __tests__/services/chatbot.test.ts
- [x] T039 [P] [US1] Component test for ChatbotScreen in __tests__/screens/chat/ChatbotScreen.test.tsx
- [x] T040 [P] [US1] Integration test for chatbot conversation flow in __tests__/e2e/chatbot.test.ts
- [x] T041 [P] [US1] Contract test for POST /chatbot/conversations endpoint in api/tests/contract/chatbot.test.ts

### Frontend Implementation (Milestone 1)

- [x] T042 [P] [US1] Create ChatbotScreen component in src/screens/chat/ChatbotScreen.tsx
- [x] T043 [P] [US1] Create ConversationFlowSelectionScreen in src/screens/chat/ConversationFlowSelectionScreen.tsx
- [x] T044 [P] [US1] Create ChatMessage component in src/components/chatbot/ChatMessage.tsx
- [x] T045 [P] [US1] Create ChatInput component in src/components/chatbot/ChatInput.tsx
- [x] T046 [P] [US1] Create TypingIndicator component in src/components/chatbot/TypingIndicator.tsx
- [x] T047 [US1] Create chatbot service in src/services/chatbot/chatbotService.ts
- [x] T048 [US1] Add chatbot tab to TabNavigator in src/navigation/TabNavigator.tsx
- [x] T049 [US1] Implement conversation flow selector UI in src/screens/chat/ConversationFlowSelectionScreen.tsx
- [x] T050 [US1] Implement crisis detection UI and resources button in src/components/chatbot/CrisisButton.tsx
- [x] T051 [US1] Add chatbot navigation routes in src/navigation/StackNavigator.tsx

### Database Implementation (Milestone 2)

- [x] T052 [US1] Add ChatbotConversation model to Prisma schema in api/prisma/schema.prisma
- [x] T053 [US1] Create database migration for ChatbotConversation in api/prisma/migrations/
- [x] T054 [US1] Update Prisma client after migration

### API Implementation (Milestone 3)

- [x] T055 [US1] Create chatbot controller in api/src/controllers/chatbotController.ts
- [x] T056 [US1] Create chatbot service in api/src/services/chatbotService.ts
- [x] T057 [US1] Create POST /chatbot/conversations endpoint in api/src/routes/chatbot.ts
- [x] T058 [US1] Create POST /chatbot/conversations/:id/messages endpoint in api/src/routes/chatbot.ts
- [x] T059 [US1] Create GET /chatbot/conversations endpoint in api/src/routes/chatbot.ts
- [x] T060 [US1] Integrate OpenAI/Anthropic API for chatbot responses in api/src/services/aiService.ts
- [x] T061 [US1] Implement crisis detection logic in api/src/services/crisisDetection.ts
- [x] T062 [US1] Implement conversation memory/context management in api/src/services/chatbotService.ts
- [x] T063 [US1] Add chatbot routes to Express server in api/src/server.ts

### Integration (Milestone 3)

- [x] T064 [US1] Connect frontend chatbot service to API endpoints in src/services/chatbot/chatbotService.ts
- [x] T065 [US1] Implement offline message queuing in src/services/storage/sync.ts
- [x] T066 [US1] Add error handling and retry logic in src/services/chatbot/chatbotService.ts

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. User can chat with AI coach, receive evidence-based responses, and access crisis resources.

---

## Phase 4: User Story 2 - Daily Mood Tracking (Priority: P1) 🎯 MVP

**Goal**: Users can quickly log their emotional state using mood wheel or emotion labels, view trend graphs over time, and export mood data. Works offline with sync when online.

**Independent Test**: User opens app, taps "Log My Mood", selects emotion, views mood history and trends. Delivers self-awareness value independently.

### Tests for User Story 2

- [x] T067 [P] [US2] Unit test for mood service in __tests__/services/mood.test.ts
- [x] T068 [P] [US2] Component test for MoodLoggingScreen in __tests__/screens/mood/MoodLoggingScreen.test.tsx
- [x] T069 [P] [US2] Component test for MoodTrendsScreen in __tests__/screens/mood/MoodTrendsScreen.test.tsx
- [x] T070 [P] [US2] Integration test for mood logging flow in __tests__/e2e/mood.test.ts
- [x] T071 [P] [US2] Contract test for POST /mood/entries endpoint in api/tests/contract/mood.test.ts

### Frontend Implementation (Milestone 1)

- [x] T072 [P] [US2] Create MoodLoggingScreen component in src/screens/mood/MoodLoggingScreen.tsx
- [x] T073 [P] [US2] Create MoodTrendsScreen component in src/screens/mood/MoodTrendsScreen.tsx
- [x] T074 [P] [US2] Create MoodDetailScreen component in src/screens/mood/MoodDetailScreen.tsx
- [x] T075 [P] [US2] Create MoodWheel component in src/components/mood/MoodWheel.tsx
- [x] T076 [P] [US2] Create EmotionSelector component in src/components/mood/EmotionSelector.tsx
- [x] T077 [P] [US2] Create MoodTrendChart component in src/components/mood/MoodTrendChart.tsx
- [x] T078 [US2] Create mood service in src/services/mood/moodService.ts
- [x] T079 [US2] Add mood tab to TabNavigator in src/navigation/TabNavigator.tsx
- [x] T080 [US2] Implement offline mood logging in src/services/storage/sync.ts
- [x] T081 [US2] Create data export UI component in src/components/common/DataExportButton.tsx

### Database Implementation (Milestone 2)

- [x] T082 [US2] Add MoodEntry model to Prisma schema in api/prisma/schema.prisma
- [x] T083 [US2] Add MoodTrend model to Prisma schema in api/prisma/schema.prisma
- [x] T084 [US2] Create database migration for MoodEntry and MoodTrend in api/prisma/migrations/
- [x] T085 [US2] Update Prisma client after migration

### API Implementation (Milestone 3)

- [x] T086 [US2] Create mood controller in api/src/controllers/moodController.ts
- [x] T087 [US2] Create mood service in api/src/services/moodService.ts
- [x] T088 [US2] Create POST /mood/entries endpoint in api/src/routes/mood.ts
- [x] T089 [US2] Create GET /mood/entries endpoint in api/src/routes/mood.ts
- [x] T090 [US2] Create GET /mood/trends endpoint in api/src/routes/mood.ts
- [x] T091 [US2] Implement mood trend calculation logic in api/src/services/moodService.ts
- [x] T092 [US2] Add mood routes to Express server in api/src/server.ts

### Integration (Milestone 3)

- [x] T093 [US2] Connect frontend mood service to API endpoints in src/services/mood/moodService.ts
- [x] T094 [US2] Implement mood data export functionality in api/src/controllers/moodController.ts
- [x] T095 [US2] Add mood sync to offline sync service in src/services/storage/sync.ts
- [x] T096 [US2] Integrate mood data with chatbot for contextual prompts in api/src/services/chatbotService.ts

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. User can track moods, view trends, and chatbot can use mood data for context.

---

## Phase 5: User Story 3 - Guided Journaling Prompts (Priority: P2)

**Goal**: Users can access AI-generated journaling prompts personalized by mood data, write journal entries with sentiment analysis, and receive insights/reframing suggestions. Works offline.

**Independent Test**: User opens journaling, receives personalized prompt, writes entry, sees sentiment analysis and insights. Delivers therapeutic value independently.

### Tests for User Story 3

- [x] T097 [P] [US3] Unit test for journal service in __tests__/services/journal.test.ts
- [x] T098 [P] [US3] Component test for JournalingHomeScreen in __tests__/screens/journal/JournalingHomeScreen.test.tsx
- [x] T099 [P] [US3] Component test for JournalEntryScreen in __tests__/screens/journal/JournalEntryScreen.test.tsx
- [x] T100 [P] [US3] Integration test for journaling flow in __tests__/e2e/journal.test.ts
- [x] T101 [P] [US3] Contract test for POST /journal/entries endpoint in api/tests/contract/journal.test.ts

### Frontend Implementation (Milestone 1)

- [x] T102 [P] [US3] Create JournalingHomeScreen component in src/screens/journal/JournalingHomeScreen.tsx
- [x] T103 [P] [US3] Create JournalPromptScreen component in src/screens/journal/JournalPromptScreen.tsx
- [x] T104 [P] [US3] Create JournalEntryScreen component in src/screens/journal/JournalEntryScreen.tsx
- [x] T105 [P] [US3] Create JournalEntryDetailScreen component in src/screens/journal/JournalEntryDetailScreen.tsx
- [x] T106 [P] [US3] Create JournalEditor component in src/components/journal/JournalEditor.tsx
- [x] T107 [P] [US3] Create PromptCard component in src/components/journal/PromptCard.tsx
- [x] T108 [US3] Create journal service in src/services/journal/journalService.ts
- [x] T109 [US3] Add journal tab to TabNavigator in src/navigation/TabNavigator.tsx
- [x] T110 [US3] Implement offline journal entry storage in src/services/storage/sync.ts

### Database Implementation (Milestone 2)

- [x] T111 [US3] Add JournalEntry model to Prisma schema in api/prisma/schema.prisma
- [x] T112 [US3] Add JournalPrompt model to Prisma schema in api/prisma/schema.prisma
- [x] T113 [US3] Create database migration for JournalEntry and JournalPrompt in api/prisma/migrations/
- [x] T114 [US3] Seed initial journal prompts in api/prisma/seed.ts
- [x] T115 [US3] Update Prisma client after migration

### API Implementation (Milestone 3)

- [x] T116 [US3] Create journal controller in api/src/controllers/journalController.ts
- [x] T117 [US3] Create journal service in api/src/services/journalService.ts
- [x] T118 [US3] Create POST /journal/entries endpoint in api/src/routes/journal.ts
- [x] T119 [US3] Create GET /journal/entries endpoint in api/src/routes/journal.ts
- [x] T120 [US3] Create GET /journal/prompts endpoint in api/src/routes/journal.ts
- [x] T121 [US3] Implement prompt personalization logic based on mood data in api/src/services/journalService.ts
- [x] T122 [US3] Integrate sentiment analysis service in api/src/services/sentimentAnalysis.ts
- [x] T123 [US3] Implement insights/reframing generation in api/src/services/journalService.ts
- [x] T124 [US3] Add journal routes to Express server in api/src/server.ts

### Integration (Milestone 3)

- [x] T125 [US3] Connect frontend journal service to API endpoints in src/services/journal/journalService.ts
- [x] T126 [US3] Add journal sync to offline sync service in src/services/storage/sync.ts
- [x] T127 [US3] Integrate journal prompts with mood data in api/src/services/journalService.ts

**Checkpoint**: At this point, User Stories 1, 2, AND 3 should all work independently. User can journal with personalized prompts and receive sentiment-based insights.

---

## Phase 6: User Story 4 - Basic Self-Help Resources (Priority: P2)

**Goal**: Users can access on-demand self-help exercises (breathing, mindfulness, affirmations, distress tolerance, progressive relaxation) with progress tracking. Accessible via chatbot or dedicated menu.

**Independent Test**: User opens self-help menu, selects breathing exercise, completes guided session, sees progress tracked. Delivers immediate therapeutic value independently.

### Tests for User Story 4

- [x] T128 [P] [US4] Unit test for exercise service in __tests__/services/exercises.test.ts
- [x] T129 [P] [US4] Component test for SelfHelpResourcesScreen in __tests__/screens/resources/SelfHelpResourcesScreen.test.tsx
- [x] T130 [P] [US4] Component test for ExerciseDetailScreen in __tests__/screens/resources/ExerciseDetailScreen.test.tsx
- [x] T131 [P] [US4] Integration test for exercise completion flow in __tests__/e2e/exercises.test.ts
- [x] T132 [P] [US4] Contract test for POST /exercises/:id/complete endpoint in api/tests/contract/exercises.test.ts

### Frontend Implementation (Milestone 1)

- [x] T133 [P] [US4] Create SelfHelpResourcesScreen component in src/screens/resources/SelfHelpResourcesScreen.tsx
- [x] T134 [P] [US4] Create ExerciseDetailScreen component in src/screens/resources/ExerciseDetailScreen.tsx
- [x] T135 [P] [US4] Create ExerciseExecutionScreen component in src/screens/resources/ExerciseExecutionScreen.tsx
- [x] T136 [P] [US4] Create ExerciseCard component in src/components/exercises/ExerciseCard.tsx
- [x] T137 [P] [US4] Create BreathingExercise component in src/components/exercises/BreathingExercise.tsx
- [x] T138 [P] [US4] Create ProgressTracker component in src/components/exercises/ProgressTracker.tsx
- [x] T139 [US4] Create exercise service in src/services/exercises/exerciseService.ts
- [x] T140 [US4] Add resources tab to TabNavigator in src/navigation/TabNavigator.tsx
- [x] T141 [US4] Integrate exercise suggestions in chatbot service in src/services/chatbot/chatbotService.ts

### Database Implementation (Milestone 2)

- [x] T142 [US4] Add SelfHelpExercise model to Prisma schema in api/prisma/schema.prisma
- [x] T143 [US4] Add ExerciseCompletion model to Prisma schema in api/prisma/schema.prisma
- [x] T144 [US4] Create database migration for SelfHelpExercise and ExerciseCompletion in api/prisma/migrations/
- [x] T145 [US4] Seed initial self-help exercises in api/prisma/seed.ts
- [x] T146 [US4] Update Prisma client after migration

### API Implementation (Milestone 3)

- [x] T147 [US4] Create exercise controller in api/src/controllers/exerciseController.ts
- [x] T148 [US4] Create exercise service in api/src/services/exerciseService.ts
- [x] T149 [US4] Create GET /exercises endpoint in api/src/routes/exercises.ts
- [x] T150 [US4] Create POST /exercises/:id/complete endpoint in api/src/routes/exercises.ts
- [x] T151 [US4] Implement progress tracking logic in api/src/services/exerciseService.ts
- [x] T152 [US4] Add exercise routes to Express server in api/src/server.ts

### Integration (Milestone 3)

- [x] T153 [US4] Connect frontend exercise service to API endpoints in src/services/exercises/exerciseService.ts
- [x] T154 [US4] Integrate exercise recommendations with mood data in api/src/services/exerciseService.ts

**Checkpoint**: At this point, User Stories 1, 2, 3, AND 4 should all work independently. User can access self-help exercises and track progress.

---

## Phase 7: User Story 5 - Multi-User Role Support with Onboarding (Priority: P2)

**Goal**: Users can select role during onboarding (Individual, Provider, Partner, Family-Friends, Kid), triggering role-specific features and chatbot scripts. Each role has tailored interface and functionality.

**Independent Test**: New user completes onboarding, selects role, experiences role-specific features. Delivers personalized value independently.

### Tests for User Story 5

- [x] T155 [P] [US5] Component test for WelcomeScreen in __tests__/screens/onboarding/WelcomeScreen.test.tsx
- [x] T156 [P] [US5] Component test for RoleSelectionScreen in __tests__/screens/onboarding/RoleSelectionScreen.test.tsx
- [x] T157 [P] [US5] Integration test for onboarding flow in __tests__/e2e/onboarding.test.ts
- [x] T158 [P] [US5] Contract test for role-specific endpoints in api/tests/contract/roles.test.ts

### Frontend Implementation (Milestone 1)

- [x] T159 [P] [US5] Create WelcomeScreen component in src/screens/onboarding/WelcomeScreen.tsx
- [x] T160 [P] [US5] Create RoleSelectionScreen component in src/screens/onboarding/RoleSelectionScreen.tsx
- [x] T161 [P] [US5] Create ConsentPrivacyScreen component in src/screens/onboarding/ConsentPrivacyScreen.tsx
- [x] T162 [P] [US5] Create AccountCreationScreen component in src/screens/auth/AccountCreationScreen.tsx
- [x] T163 [P] [US5] Create ProviderVerificationScreen component in src/screens/auth/ProviderVerificationScreen.tsx
- [x] T164 [P] [US5] Create ParentSetupScreen component in src/screens/onboarding/ParentSetupScreen.tsx
- [x] T165 [P] [US5] Create LoginScreen component in src/screens/auth/LoginScreen.tsx
- [x] T166 [P] [US5] Create ProviderDashboard screen in src/screens/role-specific/ProviderDashboard.tsx
- [x] T167 [P] [US5] Create PartnerPairingScreen in src/screens/role-specific/PartnerPairingScreen.tsx
- [x] T168 [P] [US5] Create KidFriendlyHomeScreen in src/screens/role-specific/KidFriendlyHomeScreen.tsx
- [x] T169 [US5] Implement role-based navigation adaptation in src/navigation/AppNavigator.tsx
- [x] T170 [US5] Create role context provider in src/contexts/RoleContext.tsx

### Database Implementation (Milestone 2)

- [x] T171 [US5] Add role-specific fields to User model in api/prisma/schema.prisma
- [x] T172 [US5] Add ProviderClientRelationship model to Prisma schema in api/prisma/schema.prisma
- [x] T173 [US5] Add PartnerPairing model to Prisma schema in api/prisma/schema.prisma
- [x] T174 [US5] Add FamilyGroup and FamilyGroupMember models to Prisma schema in api/prisma/schema.prisma
- [x] T175 [US5] Create database migration for role-specific models in api/prisma/migrations/
- [x] T176 [US5] Update Prisma client after migration

### API Implementation (Milestone 3)

- [x] T177 [US5] Update registration endpoint to handle role selection in api/src/routes/auth.ts
- [x] T178 [US5] Create provider endpoints in api/src/routes/provider.ts
- [x] T179 [US5] Create partner endpoints in api/src/routes/partner.ts
- [x] T180 [US5] Create family group endpoints in api/src/routes/family.ts
- [x] T181 [US5] Implement role-based access control middleware in api/src/middleware/roleAuth.ts
- [x] T182 [US5] Implement HIPAA compliance for provider mode in api/src/services/providerService.ts

### Integration (Milestone 3)

- [x] T183 [US5] Connect frontend onboarding to registration API in src/services/auth/authService.ts
- [x] T184 [US5] Implement role-based feature adaptation in frontend services
- [x] T185 [US5] Add role-specific chatbot scripts in api/src/services/chatbotService.ts

**Checkpoint**: At this point, all user stories should work with role-specific adaptations. Users can select roles and access tailored features.

---

## Phase 8: User Story 6 - User Analytics and Feedback (Backend Only) (Priority: P3)

**Goal**: Privacy-compliant analytics collection (anonymized, aggregated) for beta testing. User feedback forms after sessions. No user-facing dashboards in MVP.

**Independent Test**: Analytics events are collected with consent, anonymized, and accessible to internal team only. Feedback forms collect user input.

### Tests for User Story 6

- [x] T186 [P] [US6] Unit test for analytics service in __tests__/services/analytics.test.ts
- [x] T187 [P] [US6] Contract test for POST /analytics/events endpoint in api/tests/contract/analytics.test.ts
- [x] T188 [P] [US6] Integration test for analytics collection in __tests__/integration/analytics.test.ts

### Frontend Implementation (Milestone 1)

- [x] T189 [US6] Create feedback form component in src/components/common/FeedbackForm.tsx
- [x] T190 [US6] Integrate feedback form in chatbot completion flow in src/screens/chat/ChatbotScreen.tsx
- [x] T191 [US6] Create analytics service in src/services/analytics/analyticsService.ts
- [x] T192 [US6] Implement consent collection UI in src/screens/onboarding/ConsentPrivacyScreen.tsx

### Database Implementation (Milestone 2)

- [x] T193 [US6] Add AnalyticsEvent model to Prisma schema in api/prisma/schema.prisma
- [x] T194 [US6] Add UserFeedback model to Prisma schema in api/prisma/schema.prisma
- [x] T195 [US6] Create database migration for analytics models in api/prisma/migrations/
- [x] T196 [US6] Update Prisma client after migration

### API Implementation (Milestone 3)

- [x] T197 [US6] Create analytics controller in api/src/controllers/analyticsController.ts
- [x] T198 [US6] Create analytics service with anonymization in api/src/services/analyticsService.ts
- [x] T199 [US6] Create POST /analytics/events endpoint in api/src/routes/analytics.ts
- [x] T200 [US6] Create feedback collection endpoint in api/src/routes/feedback.ts
- [x] T201 [US6] Implement data anonymization logic in api/src/services/analyticsService.ts
- [x] T202 [US6] Add analytics routes to Express server in api/src/server.ts

### Integration (Milestone 3)

- [x] T203 [US6] Connect frontend analytics service to API in src/services/analytics/analyticsService.ts
- [x] T204 [US6] Implement consent-based analytics collection in src/services/analytics/analyticsService.ts

**Checkpoint**: Analytics and feedback collection working with privacy compliance. All user stories complete.

---

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Improvements that affect multiple user stories and final app preparation

### Additional Screens & Features

- [ ] T205 [P] Create SettingsScreen component in src/screens/settings/SettingsScreen.tsx
- [ ] T206 [P] Create ProfileScreen component in src/screens/settings/ProfileScreen.tsx
- [ ] T207 [P] Create PrivacySettingsScreen component in src/screens/settings/PrivacySettingsScreen.tsx
- [ ] T208 [P] Create DataExportScreen component in src/screens/settings/DataExportScreen.tsx
- [ ] T209 [P] Create DataDeletionScreen component in src/screens/settings/DataDeletionScreen.tsx
- [ ] T210 [P] Create CrisisResourcesScreen component in src/screens/crisis/CrisisResourcesScreen.tsx
- [ ] T211 [P] Create SafetyPlanningScreen component in src/screens/crisis/SafetyPlanningScreen.tsx
- [ ] T212 [P] Create OfflineIndicatorScreen component in src/screens/common/OfflineIndicatorScreen.tsx
- [ ] T213 [P] Create LoadingScreen component in src/screens/common/LoadingScreen.tsx
- [ ] T214 [P] Create ErrorScreen component in src/screens/common/ErrorScreen.tsx
- [ ] T215 [P] Create empty state components for all features in src/components/common/EmptyState.tsx

### Home/Dashboard Screen

- [ ] T216 Create HomeScreen component with all widgets in src/screens/home/HomeScreen.tsx
- [ ] T217 Integrate quick mood check-in widget in src/screens/home/HomeScreen.tsx
- [ ] T218 Integrate recent chatbot preview in src/screens/home/HomeScreen.tsx
- [ ] T219 Integrate daily journaling prompt card in src/screens/home/HomeScreen.tsx
- [ ] T220 Integrate self-help exercise suggestions in src/screens/home/HomeScreen.tsx
- [ ] T221 Integrate mood trend summary in src/screens/home/HomeScreen.tsx

### Data Export & Deletion

- [ ] T222 Implement data export API endpoint in api/src/controllers/dataController.ts
- [ ] T223 Implement data deletion API endpoint in api/src/controllers/dataController.ts
- [ ] T224 Create data export service in src/services/data/dataExportService.ts
- [ ] T225 Create data deletion service in src/services/data/dataDeletionService.ts

### Performance & Optimization

- [ ] T226 [P] Optimize images and assets for performance
- [ ] T227 [P] Implement code splitting and lazy loading in src/navigation/
- [ ] T228 [P] Optimize database queries with proper indexing
- [ ] T229 [P] Implement caching strategy in api/src/services/
- [ ] T230 Verify 60fps animations across all screens

### Security & Compliance

- [ ] T231 [P] Implement field-level encryption for sensitive data in api/src/services/encryption.ts
- [ ] T232 [P] Add HIPAA audit logging for provider mode in api/src/services/providerService.ts
- [ ] T233 [P] Implement data retention policy enforcement in api/src/services/dataRetention.ts
- [ ] T234 [P] Security audit and penetration testing
- [ ] T235 [P] GDPR/CCPA compliance verification

### Accessibility

- [ ] T236 [P] WCAG 2.1 AA compliance audit across all screens
- [ ] T237 [P] Screen reader testing and fixes
- [ ] T238 [P] Keyboard navigation testing and fixes
- [ ] T239 [P] Contrast ratio verification for all text
- [ ] T240 [P] Touch target size verification (44x44px minimum)

### Testing & Quality

- [ ] T241 [P] Achieve 80% test coverage for core features
- [ ] T242 [P] End-to-end testing for all critical user journeys
- [ ] T243 [P] Performance testing (60fps, <2s launch, <500ms transitions)
- [ ] T244 [P] Load testing for 10k+ concurrent users
- [ ] T245 [P] Accessibility testing with automated tools

### Documentation

- [ ] T246 [P] Update API documentation in contracts/api-spec.yaml
- [ ] T247 [P] Create user documentation in docs/user-guide.md
- [ ] T248 [P] Create developer documentation in docs/developer-guide.md
- [ ] T249 [P] Update quickstart.md with final implementation details

### App Store Preparation

- [ ] T250 [P] Create app store assets (icons, screenshots) in assets/
- [ ] T251 [P] Prepare app store descriptions and metadata
- [ ] T252 [P] iOS App Store compliance verification
- [ ] T253 [P] Google Play Store compliance verification
- [ ] T254 [P] Beta testing preparation and distribution

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Stories (Phase 3-8)**: All depend on Foundational phase completion
  - User stories can then proceed in parallel (if staffed)
  - Or sequentially in priority order (P1 → P2 → P3)
- **Polish (Phase 9)**: Depends on all desired user stories being complete

### User Story Dependencies

- **User Story 1 (P1)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P1)**: Can start after Foundational (Phase 2) - May integrate with US1 but independently testable
- **User Story 3 (P2)**: Can start after Foundational (Phase 2) - May use mood data from US2 but independently testable
- **User Story 4 (P2)**: Can start after Foundational (Phase 2) - May integrate with chatbot (US1) but independently testable
- **User Story 5 (P2)**: Can start after Foundational (Phase 2) - Affects all features but independently testable
- **User Story 6 (P3)**: Can start after Foundational (Phase 2) - Observes other features but independently testable

### Within Each User Story

- Tests (if included) MUST be written and FAIL before implementation
- Frontend screens/components before services
- Database models before API services
- API services before frontend integration
- Core implementation before integration with other stories
- Story complete before moving to next priority

### Milestone Dependencies

- **Milestone 1 (Frontend)**: Can start immediately after Setup, uses mock data
- **Milestone 2 (Database)**: Can start after Setup, independent of frontend
- **Milestone 3 (API & Integration)**: Depends on Milestone 2 (database), integrates with Milestone 1 (frontend)
- **Milestone 4 (Final)**: Depends on all previous milestones

### Parallel Opportunities

- All Setup tasks marked [P] can run in parallel
- All Foundational tasks marked [P] can run in parallel (within Phase 2)
- Once Foundational phase completes, all user stories can start in parallel (if team capacity allows)
- All tests for a user story marked [P] can run in parallel
- Frontend components within a story marked [P] can run in parallel
- Database models within a story marked [P] can run in parallel
- Different user stories can be worked on in parallel by different team members
- Milestone 1 (Frontend) and Milestone 2 (Database) can proceed in parallel

---

## Parallel Example: User Story 1

```bash
# Launch all tests for User Story 1 together:
Task: T038 [P] [US1] Unit test for chatbot service in __tests__/services/chatbot.test.ts
Task: T039 [P] [US1] Component test for ChatbotScreen in __tests__/screens/chat/ChatbotScreen.test.tsx
Task: T040 [P] [US1] Integration test for chatbot conversation flow in __tests__/e2e/chatbot.test.ts
Task: T041 [P] [US1] Contract test for POST /chatbot/conversations endpoint in api/tests/contract/chatbot.test.ts

# Launch all frontend components for User Story 1 together:
Task: T042 [P] [US1] Create ChatbotScreen component in src/screens/chat/ChatbotScreen.tsx
Task: T043 [P] [US1] Create ConversationFlowSelectionScreen in src/screens/chat/ConversationFlowSelectionScreen.tsx
Task: T044 [P] [US1] Create ChatMessage component in src/components/chatbot/ChatMessage.tsx
Task: T045 [P] [US1] Create ChatInput component in src/components/chatbot/ChatInput.tsx
Task: T046 [P] [US1] Create TypingIndicator component in src/components/chatbot/TypingIndicator.tsx
```

---

## Implementation Strategy

### MVP First (User Stories 1 & 2 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (AI Chatbot)
4. Complete Phase 4: User Story 2 (Mood Tracking)
5. **STOP and VALIDATE**: Test User Stories 1 & 2 independently
6. Deploy/demo if ready

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Deploy/Demo (Core MVP!)
3. Add User Story 2 → Test independently → Deploy/Demo (Enhanced MVP!)
4. Add User Story 3 → Test independently → Deploy/Demo
5. Add User Story 4 → Test independently → Deploy/Demo
6. Add User Story 5 → Test independently → Deploy/Demo
7. Add User Story 6 → Test independently → Deploy/Demo
8. Each story adds value without breaking previous stories

### Milestone-Based Approach

1. **Milestone 1**: Complete all frontend screens (42 screens) with mock data
2. **Milestone 2**: Complete database schema and migrations
3. **Milestone 3**: Complete API and integrate with frontend
4. **Milestone 4**: Polish, testing, and app store preparation

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (Frontend → Database → API)
   - Developer B: User Story 2 (Frontend → Database → API)
   - Developer C: User Story 3 (Frontend → Database → API)
3. Stories complete and integrate independently
4. Alternative: Frontend team works on Milestone 1, Backend team works on Milestone 2 in parallel

---

## Task Summary

**Total Tasks**: 254

**Tasks by Phase**:
- Phase 1 (Setup): 10 tasks
- Phase 2 (Foundational): 25 tasks
- Phase 3 (User Story 1): 29 tasks
- Phase 4 (User Story 2): 30 tasks
- Phase 5 (User Story 3): 31 tasks
- Phase 6 (User Story 4): 27 tasks
- Phase 7 (User Story 5): 31 tasks
- Phase 8 (User Story 6): 19 tasks
- Phase 9 (Polish): 52 tasks

**Tasks by User Story**:
- User Story 1 (P1): 29 tasks
- User Story 2 (P1): 30 tasks
- User Story 3 (P2): 31 tasks
- User Story 4 (P2): 27 tasks
- User Story 5 (P2): 31 tasks
- User Story 6 (P3): 19 tasks

**Parallel Opportunities Identified**: 120+ tasks marked [P] can run in parallel

**Independent Test Criteria**:
- **US1**: User can chat with AI coach, receive evidence-based responses, access crisis resources
- **US2**: User can log mood, view trends, export data
- **US3**: User can journal with personalized prompts, receive sentiment insights
- **US4**: User can access self-help exercises, track progress
- **US5**: User can select role, access role-specific features
- **US6**: Analytics collected with consent, anonymized, accessible internally

**Suggested MVP Scope**: User Stories 1 & 2 (P1 priorities) provide core value - AI chatbot and mood tracking. This delivers immediate therapeutic value and can be deployed independently.

**Format Validation**: ✅ ALL tasks follow the checklist format: `- [ ] [TaskID] [P?] [Story?] Description with file path`

