/**
 * Bottom Tab Navigator
 * Primary navigation for main app features
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';

// Import screens
import ChatbotScreen from '../screens/chat/ChatbotScreen';

// Placeholder screens (will be implemented in user story phases)
const HomeScreen = () => null;
const MoodScreen = () => null;
const JournalScreen = () => null;
const ResourcesScreen = () => null;

export type TabParamList = {
  Home: undefined;
  Chat: undefined;
  Mood: undefined;
  Journal: undefined;
  Resources: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.grayMedium,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.grayLight,
        },
      }}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Home',
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Chat"
        component={ChatbotScreen}
        options={{
          title: 'Chat',
          tabBarLabel: 'Chat',
        }}
      />
      <Tab.Screen
        name="Mood"
        component={MoodScreen}
        options={{
          title: 'Mood',
          tabBarLabel: 'Mood',
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          title: 'Journal',
          tabBarLabel: 'Journal',
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          title: 'Resources',
          tabBarLabel: 'Resources',
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

