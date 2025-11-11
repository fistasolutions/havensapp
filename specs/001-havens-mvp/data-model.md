# Data Model: Havens App MVP

**Date**: 2025-11-11  
**Feature**: Havens App MVP  
**Database**: PostgreSQL 14+ with Prisma ORM

## Entity Relationship Overview

The data model supports multiple user roles (Individual, Provider, Partner, Family-Friends, Kids) with role-specific features. Core entities include Users, Mood Entries, Journal Entries, Chatbot Conversations, and Self-Help Exercises. Relationships support provider-client connections, partner pairings, and family/friend groups.

## Core Entities

### User

**Purpose**: Represents an app user with role-specific attributes and authentication.

**Attributes**:
- `id` (UUID, Primary Key): Unique user identifier
- `email` (String, Unique, Encrypted): User email address
- `passwordHash` (String, Encrypted): Hashed password (bcrypt)
- `role` (Enum): Individual | Provider | Partner | FamilyFriends | Kid
- `firstName` (String, Optional): User's first name
- `lastName` (String, Optional): User's last name
- `age` (Integer, Optional): User age (required for Kids mode)
- `providerLicenseNumber` (String, Optional, Encrypted): Provider license (Provider mode only)
- `providerVerificationStatus` (Enum): Pending | Verified | Rejected (Provider mode)
- `parentUserId` (UUID, Foreign Key, Optional): Parent user ID (Kids mode only)
- `analyticsConsent` (Boolean): User consent for analytics collection
- `dataRetentionPreference` (Integer): Data retention period in days (user preference)
- `createdAt` (Timestamp): Account creation date
- `updatedAt` (Timestamp): Last update date
- `deletedAt` (Timestamp, Optional): Soft delete timestamp
- `lastLoginAt` (Timestamp, Optional): Last login timestamp

**Relationships**:
- One-to-Many: MoodEntry, JournalEntry, ChatbotConversation, UserProgress
- One-to-One: UserProfile (optional extended profile)
- Many-to-Many: ProviderClientRelationship (as provider or client)
- One-to-One: PartnerPairing (as user1 or user2)
- Many-to-Many: FamilyGroup (through FamilyGroupMember)

**Indexes**:
- `email` (unique index)
- `role` (for role-based queries)
- `parentUserId` (for kids mode queries)
- `deletedAt` (for soft delete queries)

**Encryption**: email, passwordHash, providerLicenseNumber encrypted using pgcrypto

### MoodEntry

**Purpose**: Represents a single mood log entry with emotion labels and optional notes.

**Attributes**:
- `id` (UUID, Primary Key): Unique mood entry identifier
- `userId` (UUID, Foreign Key): User who created the entry
- `emotionLabels` (String Array): Array of emotion labels (e.g., ["happy", "grateful"])
- `intensity` (Integer, 1-10, Optional): Mood intensity rating
- `notes` (Text, Optional, Encrypted): Optional notes about the mood
- `moodColor` (String, Optional): Associated mood color for visualization
- `timestamp` (Timestamp): When the mood was logged
- `syncedAt` (Timestamp, Optional): When entry was synced to server
- `isOffline` (Boolean): Whether entry was created offline
- `createdAt` (Timestamp): Entry creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- Many-to-One: User
- One-to-Many: JournalEntry (related entries)

**Indexes**:
- `userId` (for user mood queries)
- `timestamp` (for time-based queries and trends)
- `userId + timestamp` (composite for user mood history)

**Encryption**: notes field encrypted

### MoodTrend

**Purpose**: Aggregated mood data for trend visualization (computed/denormalized).

**Attributes**:
- `id` (UUID, Primary Key): Unique trend record identifier
- `userId` (UUID, Foreign Key): User
- `period` (Enum): Daily | Weekly | Monthly
- `periodStart` (Date): Start of the period
- `periodEnd` (Date): End of the period
- `averageMood` (Float): Average mood intensity for period
- `dominantEmotions` (String Array): Most common emotions in period
- `trendDirection` (Enum): Improving | Stable | Declining
- `entryCount` (Integer): Number of mood entries in period
- `createdAt` (Timestamp): Trend calculation date

**Relationships**:
- Many-to-One: User

**Indexes**:
- `userId + period + periodStart` (composite for trend queries)

### JournalEntry

**Purpose**: Represents a journal entry with prompt, content, and sentiment analysis.

**Attributes**:
- `id` (UUID, Primary Key): Unique journal entry identifier
- `userId` (UUID, Foreign Key): User who created the entry
- `promptId` (UUID, Foreign Key, Optional): Journal prompt used
- `promptText` (Text, Optional): Prompt text (denormalized for offline access)
- `content` (Text, Encrypted): Journal entry text content
- `sentimentScore` (Float, -1 to 1, Optional): Sentiment analysis score
- `sentimentLabel` (String, Optional): Positive | Neutral | Negative
- `insights` (Text Array, Optional): AI-generated insights/reframing suggestions
- `relatedMoodEntryId` (UUID, Foreign Key, Optional): Related mood entry
- `isDraft` (Boolean): Whether entry is draft or published
- `syncedAt` (Timestamp, Optional): When entry was synced to server
- `isOffline` (Boolean): Whether entry was created offline
- `createdAt` (Timestamp): Entry creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- Many-to-One: User, JournalPrompt, MoodEntry (optional)

**Indexes**:
- `userId` (for user journal queries)
- `createdAt` (for chronological queries)
- `sentimentLabel` (for sentiment-based queries)
- `userId + isDraft` (for draft queries)

**Encryption**: content field encrypted

### JournalPrompt

**Purpose**: Represents a journaling prompt template with theme and evidence-based technique.

**Attributes**:
- `id` (UUID, Primary Key): Unique prompt identifier
- `theme` (Enum): Gratitude | Goals | Stress | Relationships | Reflection | General
- `promptText` (Text): The prompt question/text
- `evidenceBasedTechnique` (String): CBT | ACT | DBT | Mindfulness | PositivePsychology | SEL
- `targetMoodContext` (String Array, Optional): Mood contexts this prompt is suitable for
- `isActive` (Boolean): Whether prompt is currently available
- `createdAt` (Timestamp): Prompt creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- One-to-Many: JournalEntry

**Indexes**:
- `theme` (for theme-based queries)
- `evidenceBasedTechnique` (for technique-based queries)
- `isActive` (for active prompt queries)

### ChatbotConversation

**Purpose**: Represents a chatbot conversation session with messages and context.

**Attributes**:
- `id` (UUID, Primary Key): Unique conversation identifier
- `userId` (UUID, Foreign Key): User in conversation
- `conversationFlow` (Enum): AnxietyRelief | StressManagement | DepressionSupport | General | Custom
- `messages` (JSONB): Array of message objects (encrypted)
- `personalizationContext` (JSONB, Optional): User context for personalization
- `crisisDetected` (Boolean): Whether crisis language was detected
- `crisisResourcesProvided` (Boolean): Whether crisis resources were shown
- `isActive` (Boolean): Whether conversation is ongoing
- `syncedAt` (Timestamp, Optional): When conversation was synced
- `createdAt` (Timestamp): Conversation start date
- `updatedAt` (Timestamp): Last message date

**Relationships**:
- Many-to-One: User

**Indexes**:
- `userId` (for user conversation queries)
- `createdAt` (for chronological queries)
- `crisisDetected` (for crisis monitoring)
- `userId + isActive` (for active conversation queries)

**Encryption**: messages field encrypted (JSONB with pgcrypto)

### SelfHelpExercise

**Purpose**: Represents a self-help exercise resource (breathing, mindfulness, etc.).

**Attributes**:
- `id` (UUID, Primary Key): Unique exercise identifier
- `type` (Enum): Breathing | Mindfulness | Affirmation | DistressTolerance | ProgressiveRelaxation
- `title` (String): Exercise title
- `description` (Text): Exercise description
- `instructions` (Text Array): Step-by-step instructions
- `duration` (Integer, Optional): Exercise duration in minutes
- `evidenceBasedTechnique` (String): CBT | ACT | DBT | Mindfulness | PositivePsychology
- `isActive` (Boolean): Whether exercise is available
- `createdAt` (Timestamp): Exercise creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- One-to-Many: ExerciseCompletion

**Indexes**:
- `type` (for type-based queries)
- `isActive` (for active exercise queries)

### ExerciseCompletion

**Purpose**: Tracks user completion of self-help exercises for progress tracking.

**Attributes**:
- `id` (UUID, Primary Key): Unique completion record identifier
- `userId` (UUID, Foreign Key): User who completed exercise
- `exerciseId` (UUID, Foreign Key): Exercise completed
- `completedAt` (Timestamp): Completion timestamp
- `duration` (Integer, Optional): Actual duration in seconds
- `rating` (Integer, 1-5, Optional): User rating of exercise helpfulness

**Relationships**:
- Many-to-One: User, SelfHelpExercise

**Indexes**:
- `userId` (for user progress queries)
- `exerciseId` (for exercise popularity queries)
- `userId + completedAt` (for user progress over time)

### UserProgress

**Purpose**: Aggregated user engagement metrics (denormalized for performance).

**Attributes**:
- `id` (UUID, Primary Key): Unique progress record identifier
- `userId` (UUID, Foreign Key, Unique): User
- `moodLoggingStreak` (Integer): Current consecutive days of mood logging
- `journalingFrequency` (Integer): Journal entries in last 30 days
- `exerciseCompletions` (Integer): Total exercise completions
- `lastActiveDate` (Date): Last app usage date
- `totalMoodEntries` (Integer): Total mood entries
- `totalJournalEntries` (Integer): Total journal entries
- `totalChatbotSessions` (Integer): Total chatbot conversations
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- One-to-One: User

**Indexes**:
- `userId` (unique index)

## Role-Specific Entities

### ProviderClientRelationship

**Purpose**: Represents provider access to client data (HIPAA-compliant).

**Attributes**:
- `id` (UUID, Primary Key): Unique relationship identifier
- `providerId` (UUID, Foreign Key): Provider user
- `clientId` (UUID, Foreign Key): Client user
- `consentStatus` (Enum): Pending | Granted | Revoked
- `accessLevel` (Enum): ReadOnly (enforced)
- `consentGrantedAt` (Timestamp, Optional): When consent was granted
- `consentRevokedAt` (Timestamp, Optional): When consent was revoked
- `hipaaAuditLog` (JSONB): Access audit log (encrypted)
- `createdAt` (Timestamp): Relationship creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- Many-to-One: User (as provider), User (as client)

**Indexes**:
- `providerId` (for provider queries)
- `clientId` (for client queries)
- `consentStatus` (for consent queries)

**Encryption**: hipaaAuditLog encrypted

### PartnerPairing

**Purpose**: Represents shared access between romantic partners.

**Attributes**:
- `id` (UUID, Primary Key): Unique pairing identifier
- `user1Id` (UUID, Foreign Key): First partner
- `user2Id` (UUID, Foreign Key): Second partner
- `pairingStatus` (Enum): Pending | Active | Paused | Ended
- `sharedJournalEnabled` (Boolean): Whether shared journal is enabled
- `jointMoodTrackingEnabled` (Boolean): Whether joint mood tracking is enabled
- `pairingCode` (String, Unique): Code for partner invitation
- `pairedAt` (Timestamp, Optional): When pairing was activated
- `createdAt` (Timestamp): Pairing creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- Many-to-One: User (as user1), User (as user2)

**Indexes**:
- `user1Id` (for user1 queries)
- `user2Id` (for user2 queries)
- `pairingCode` (unique index for invitations)
- `pairingStatus` (for active pairing queries)

### FamilyGroup

**Purpose**: Represents a family or friend group for collective wellness.

**Attributes**:
- `id` (UUID, Primary Key): Unique group identifier
- `name` (String): Group name
- `createdBy` (UUID, Foreign Key): User who created group
- `isActive` (Boolean): Whether group is active
- `createdAt` (Timestamp): Group creation date
- `updatedAt` (Timestamp): Last update date

**Relationships**:
- Many-to-One: User (creator)
- One-to-Many: FamilyGroupMember

**Indexes**:
- `createdBy` (for creator queries)
- `isActive` (for active group queries)

### FamilyGroupMember

**Purpose**: Represents membership in a family/friend group.

**Attributes**:
- `id` (UUID, Primary Key): Unique membership identifier
- `groupId` (UUID, Foreign Key): Family group
- `userId` (UUID, Foreign Key): Group member
- `role` (Enum): Admin | Member
- `joinedAt` (Timestamp): When member joined
- `leftAt` (Timestamp, Optional): When member left

**Relationships**:
- Many-to-One: FamilyGroup, User

**Indexes**:
- `groupId` (for group member queries)
- `userId` (for user group queries)

### GroupMoodPoll

**Purpose**: Represents an anonymous mood poll within a family/friend group.

**Attributes**:
- `id` (UUID, Primary Key): Unique poll identifier
- `groupId` (UUID, Foreign Key): Family group
- `createdBy` (UUID, Foreign Key): User who created poll
- `question` (Text): Poll question
- `isActive` (Boolean): Whether poll is accepting responses
- `createdAt` (Timestamp): Poll creation date
- `expiresAt` (Timestamp, Optional): Poll expiration date

**Relationships**:
- Many-to-One: FamilyGroup, User
- One-to-Many: GroupMoodPollResponse

**Indexes**:
- `groupId` (for group poll queries)
- `isActive` (for active poll queries)

### GroupMoodPollResponse

**Purpose**: Represents an anonymous response to a group mood poll.

**Attributes**:
- `id` (UUID, Primary Key): Unique response identifier
- `pollId` (UUID, Foreign Key): Mood poll
- `userId` (UUID, Foreign Key): Responding user (for aggregation, kept anonymous in results)
- `emotionLabels` (String Array): Selected emotions
- `responseText` (Text, Optional): Optional text response
- `respondedAt` (Timestamp): Response timestamp

**Relationships**:
- Many-to-One: GroupMoodPoll, User

**Indexes**:
- `pollId` (for poll response queries)
- `pollId + respondedAt` (for poll results)

## Analytics & Feedback Entities

### AnalyticsEvent

**Purpose**: Privacy-compliant analytics events (anonymized, aggregated).

**Attributes**:
- `id` (UUID, Primary Key): Unique event identifier
- `eventType` (String): Event type (e.g., "mood_logged", "chatbot_session_started")
- `anonymizedUserId` (String): Hashed/anonymized user ID
- `featureUsed` (String): Feature identifier
- `sessionDuration` (Integer, Optional): Session duration in seconds
- `timestamp` (Timestamp): Event timestamp
- `metadata` (JSONB, Optional): Additional anonymized metadata

**Relationships**: None (anonymized, no user relationship)

**Indexes**:
- `eventType` (for event type queries)
- `timestamp` (for time-based analytics)
- `featureUsed` (for feature usage analytics)

**Note**: No personally identifiable information stored. User IDs are hashed/anonymized.

### UserFeedback

**Purpose**: User feedback forms after sessions.

**Attributes**:
- `id` (UUID, Primary Key): Unique feedback identifier
- `userId` (UUID, Foreign Key, Optional): User (optional for anonymous feedback)
- `sessionType` (Enum): Chatbot | MoodLogging | Journaling | Exercise | General
- `rating` (Integer, 1-5): User rating
- `feedbackText` (Text, Optional): Optional feedback text
- `isAnonymous` (Boolean): Whether feedback is anonymous
- `submittedAt` (Timestamp): Feedback submission timestamp

**Relationships**:
- Many-to-One: User (optional)

**Indexes**:
- `sessionType` (for session type queries)
- `submittedAt` (for chronological queries)
- `rating` (for rating analysis)

## Data Retention & Deletion

### Data Retention Policy

- **Default Retention**: 7 years for healthcare data (HIPAA recommendation)
- **User Preference**: Configurable by user (minimum 30 days, maximum 10 years)
- **Deletion**: Immediate on user request, with 30-day grace period for account recovery
- **Backup Retention**: Encrypted backups retained for 90 days after deletion

### Soft Delete Strategy

- Most entities support soft delete (`deletedAt` timestamp)
- Hard delete after retention period expires
- Audit logs retained permanently (anonymized)

## Encryption Strategy

### Encrypted Fields

- User: `email`, `passwordHash`, `providerLicenseNumber`
- MoodEntry: `notes`
- JournalEntry: `content`
- ChatbotConversation: `messages`, `personalizationContext`
- ProviderClientRelationship: `hipaaAuditLog`

### Encryption Method

- **At Rest**: PostgreSQL pgcrypto extension with AES-256
- **In Transit**: TLS 1.3
- **Key Management**: Environment-based encryption keys, rotated quarterly

## Migration Strategy

- Prisma migrations for schema versioning
- Zero-downtime migrations where possible
- Rollback procedures for each migration
- Data migration scripts for schema changes

## Performance Considerations

### Indexing Strategy

- Primary keys: UUID with B-tree indexes
- Foreign keys: Indexed for join performance
- Composite indexes for common query patterns
- Partial indexes for filtered queries (e.g., `isActive = true`)

### Query Optimization

- Denormalized aggregates (MoodTrend, UserProgress) for performance
- Materialized views for complex analytics (if needed)
- Connection pooling for API performance
- Query monitoring and optimization

## Validation Rules

### User
- Email: Valid email format, unique
- Password: Minimum 8 characters, complexity requirements
- Role: Must match user type selection
- Age: Required for Kids mode (8-12), optional for others

### MoodEntry
- EmotionLabels: Must contain at least one valid emotion
- Intensity: 1-10 if provided
- Timestamp: Cannot be in future

### JournalEntry
- Content: Minimum 10 characters, maximum 10,000 characters
- SentimentScore: -1 to 1 if provided

### ChatbotConversation
- Messages: Must be valid JSONB array
- CrisisDetected: If true, crisisResourcesProvided must be true

## Relationships Summary

```
User
├── 1:N MoodEntry
├── 1:N JournalEntry
├── 1:N ChatbotConversation
├── 1:N ExerciseCompletion
├── 1:1 UserProgress
├── 1:1 PartnerPairing (as user1 or user2)
├── M:N ProviderClientRelationship (as provider or client)
└── M:N FamilyGroup (through FamilyGroupMember)

JournalEntry
├── N:1 User
├── N:1 JournalPrompt
└── N:1 MoodEntry (optional)

ChatbotConversation
└── N:1 User

SelfHelpExercise
└── 1:N ExerciseCompletion

ProviderClientRelationship
├── N:1 User (provider)
└── N:1 User (client)

PartnerPairing
├── N:1 User (user1)
└── N:1 User (user2)

FamilyGroup
├── N:1 User (creator)
└── 1:N FamilyGroupMember

FamilyGroupMember
├── N:1 FamilyGroup
└── N:1 User
```

