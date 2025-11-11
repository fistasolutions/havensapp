# Quickstart Guide: Havens App MVP

**Date**: 2025-11-11  
**Feature**: Havens App MVP  
**Purpose**: Get started with implementation quickly

## Overview

Havens App MVP is a mental health and wellness mobile application built with React Native. The implementation follows a 4-milestone approach:

1. **Milestone 1**: Frontend UI/UX (42 screens, navigation, design system)
2. **Milestone 2**: PostgreSQL database (schema, migrations, encryption)
3. **Milestone 3**: RESTful API (endpoints, authentication, AI integration)
4. **Milestone 4**: Integration, testing, and polish

## Prerequisites

- Node.js >= 20
- React Native 0.82+
- TypeScript 5.8+
- PostgreSQL 14+
- iOS: Xcode 14+ (for iOS development)
- Android: Android Studio (for Android development)

## Milestone 1: Frontend Setup

### 1. Initialize React Native Project

```bash
# Already initialized, but for reference:
npx react-native init HavensApp --template react-native-template-typescript
cd HavensApp
```

### 2. Install Core Dependencies

```bash
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npm install react-native-reanimated react-native-gesture-handler
npm install @react-native-async-storage/async-storage
npm install react-native-paper  # Optional, for base components
npm install --save-dev @types/react @types/react-native
```

### 3. Set Up Design System

Create design tokens in `src/constants/`:

```typescript
// src/constants/colors.ts
export const Colors = {
  primary: '#4A90E2',      // Serene Blue
  secondary: '#5BC8AF',    // Soft Teal
  accent: '#9B8FB8',        // Warm Lavender
  white: '#FFFFFF',
  grayLight: '#F5F7FA',
  grayMedium: '#8E8E93',
  grayDark: '#1C1C1E',
  success: '#34C759',
  warning: '#FF9500',
  crisis: '#FF3B30',
  info: '#007AFF',
};

// src/constants/spacing.ts
export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// src/constants/typography.ts
export const Typography = {
  heading: {
    fontSize: 24,
    fontWeight: '700' as const,
    lineHeight: 32,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    lineHeight: 24,
  },
};
```

### 4. Create Navigation Structure

```typescript
// src/navigation/AppNavigator.tsx
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Implement tab navigation for Home, Chat, Mood, Journal, Resources
// Implement stack navigation for Settings, Profile, etc.
```

### 5. Create First Screen (Home/Dashboard)

```typescript
// src/screens/home/HomeScreen.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Havens</Text>
      {/* Add quick mood check-in widget */}
      {/* Add recent chatbot preview */}
      {/* Add daily journaling prompt card */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.md,
  },
  title: {
    ...Typography.heading,
    color: Colors.grayDark,
  },
});
```

### 6. Use Mock Data for Development

```typescript
// src/services/mockData.ts
export const mockMoodEntries = [
  { id: '1', emotionLabels: ['happy', 'grateful'], timestamp: new Date() },
  // ... more mock data
];
```

## Milestone 2: Database Setup

### 1. Initialize Prisma

```bash
cd api
npm install prisma @prisma/client
npx prisma init
```

### 2. Configure Database Connection

```prisma
// api/prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### 3. Define Schema (See data-model.md for full schema)

```prisma
model User {
  id        String   @id @default(uuid())
  email     String   @unique @db.VarChar(255)
  passwordHash String @db.VarChar(255)
  role      UserRole
  createdAt DateTime @default(now())
  // ... more fields
}

enum UserRole {
  Individual
  Provider
  Partner
  FamilyFriends
  Kid
}
```

### 4. Run Migrations

```bash
npx prisma migrate dev --name init
npx prisma generate
```

### 5. Set Up Encryption

```sql
-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Example encrypted field
ALTER TABLE users ADD COLUMN email_encrypted BYTEA;
```

## Milestone 3: API Development

### 1. Initialize Express Server

```bash
cd api
npm install express cors helmet morgan
npm install --save-dev @types/express @types/cors
npm install jsonwebtoken bcrypt
npm install --save-dev @types/jsonwebtoken @types/bcrypt
```

### 2. Create Basic Server

```typescript
// api/src/server.ts
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/mood', moodRoutes);
// ... more routes

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 3. Implement Authentication

```typescript
// api/src/middleware/auth.ts
import jwt from 'jsonwebtoken';

export const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  });
};
```

### 4. Create API Endpoints

```typescript
// api/src/routes/mood.ts
import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createMoodEntry, getMoodEntries } from '../controllers/mood';

const router = Router();

router.get('/entries', authenticateToken, getMoodEntries);
router.post('/entries', authenticateToken, createMoodEntry);

export default router;
```

### 5. Integrate AI Services

```typescript
// api/src/services/chatbot.ts
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateChatbotResponse = async (messages, context) => {
  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a supportive mental health coach...' },
      ...messages,
    ],
    temperature: 0.7,
  });
  
  return response.choices[0].message.content;
};
```

## Milestone 4: Integration & Testing

### 1. Connect Frontend to API

```typescript
// src/services/api/client.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://api.havensapp.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token interceptor
apiClient.interceptors.request.use((config) => {
  const token = AsyncStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### 2. Implement Offline Sync

```typescript
// src/services/sync.ts
export const syncOfflineData = async () => {
  const offlineEntries = await AsyncStorage.getItem('offlineMoodEntries');
  if (offlineEntries) {
    // Sync to server
    await apiClient.post('/mood/entries', JSON.parse(offlineEntries));
    await AsyncStorage.removeItem('offlineMoodEntries');
  }
};
```

### 3. Set Up Testing

```bash
npm install --save-dev jest @testing-library/react-native
```

```typescript
// __tests__/screens/HomeScreen.test.tsx
import { render } from '@testing-library/react-native';
import { HomeScreen } from '../src/screens/home/HomeScreen';

test('renders home screen', () => {
  const { getByText } = render(<HomeScreen />);
  expect(getByText('Welcome to Havens')).toBeTruthy();
});
```

## Development Workflow

### Daily Development

1. **Start Metro bundler**: `npm start`
2. **Run iOS**: `npm run ios`
3. **Run Android**: `npm run android`
4. **Run tests**: `npm test`

### Code Organization

- **Components**: Reusable UI components in `src/components/`
- **Screens**: Screen components in `src/screens/`
- **Services**: Business logic and API calls in `src/services/`
- **Navigation**: Navigation configuration in `src/navigation/`
- **Constants**: Design tokens in `src/constants/`

### Git Workflow

- Feature branches: `feature/[feature-name]`
- Commit messages: `feat: [description]`, `fix: [description]`
- PR reviews required before merge

## Key Implementation Notes

### Design System
- Use design tokens (colors, spacing, typography) consistently
- Follow HCI principles (minimalist, empathetic, accessible)
- Ensure WCAG 2.1 AA compliance

### Security
- Encrypt sensitive data (mood notes, journal content, chatbot messages)
- Use JWT for authentication
- Implement HIPAA compliance for provider mode

### Performance
- Target 60fps animations
- Optimize images and assets
- Use FlatList for long lists
- Implement proper caching

### Accessibility
- Minimum 44x44px touch targets
- Screen reader support with proper labels
- WCAG 2.1 AA contrast ratios
- Keyboard navigation support

## Next Steps

1. Review [spec.md](./spec.md) for feature requirements
2. Review [data-model.md](./data-model.md) for database schema
3. Review [contracts/api-spec.yaml](./contracts/api-spec.yaml) for API endpoints
4. Start with Milestone 1: Frontend UI/UX implementation
5. Follow milestone sequence: Frontend → Database → API → Integration

## Resources

- [React Native Documentation](https://reactnative.dev/docs/getting-started)
- [React Navigation](https://reactnavigation.org/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [OpenAPI Specification](https://swagger.io/specification/)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## Support

For questions or issues, refer to:
- Constitution: `.specify/memory/constitution.md`
- Implementation Plan: `specs/001-havens-mvp/plan.md`
- Feature Specification: `specs/001-havens-mvp/spec.md`

