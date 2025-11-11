/**
 * Bottom Tab Navigator
 * Primary navigation for main app features
 * Adapts based on user role
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Colors } from '../constants';
import { useRole } from '../contexts/RoleContext';

// Import screens
import ChatbotScreen from '../screens/chat/ChatbotScreen';
import MoodTrendsScreen from '../screens/mood/MoodTrendsScreen';
import JournalingHomeScreen from '../screens/journal/JournalingHomeScreen';
import SelfHelpResourcesScreen from '../screens/resources/SelfHelpResourcesScreen';
import ProviderDashboard from '../screens/role-specific/ProviderDashboard';
import PartnerPairingScreen from '../screens/role-specific/PartnerPairingScreen';
import KidFriendlyHomeScreen from '../screens/role-specific/KidFriendlyHomeScreen';

// Placeholder screens (will be implemented in user story phases)
const HomeScreen = () => null;

export type TabParamList = {
  Home: undefined;
  Chat: undefined;
  Mood: undefined;
  Journal: undefined;
  Resources: undefined;
};

const Tab = createBottomTabNavigator<TabParamList>();

const TabNavigator: React.FC = () => {
  const { role } = useRole();

  // Role-based home screen selection
  const getHomeScreen = () => {
    switch (role) {
      case 'Provider':
        return ProviderDashboard;
      case 'Kid':
        return KidFriendlyHomeScreen;
      default:
        return HomeScreen;
    }
  };

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
        component={getHomeScreen()}
        options={{
          title: role === 'Provider' ? 'Dashboard' : role === 'Kid' ? 'Home' : 'Home',
          tabBarLabel: 'Home',
        }}
      />
      {role !== 'Provider' && (
        <>
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
            component={MoodTrendsScreen}
            options={{
              title: 'Mood',
              tabBarLabel: 'Mood',
            }}
          />
          <Tab.Screen
            name="Journal"
            component={JournalingHomeScreen}
            options={{
              title: 'Journal',
              tabBarLabel: 'Journal',
            }}
          />
          <Tab.Screen
            name="Resources"
            component={SelfHelpResourcesScreen}
            options={{
              title: 'Resources',
              tabBarLabel: 'Resources',
            }}
          />
        </>
      )}
      {role === 'Provider' && (
        <>
          <Tab.Screen
            name="Chat"
            component={ChatbotScreen}
            options={{
              title: 'Chat',
              tabBarLabel: 'Chat',
            }}
          />
        </>
      )}
      {role === 'Partner' && (
        <Tab.Screen
          name="Partner"
          component={PartnerPairingScreen}
          options={{
            title: 'Partner',
            tabBarLabel: 'Partner',
          }}
        />
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;

