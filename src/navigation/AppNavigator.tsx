/**
 * Main App Navigator
 * Root navigation component that handles app-wide navigation structure
 * Supports role-based navigation adaptation
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { RoleProvider, useRole } from '../contexts/RoleContext';
import TabNavigator from './TabNavigator';
import StackNavigator from './StackNavigator';
import WelcomeScreen from '../screens/onboarding/WelcomeScreen';
import RoleSelectionScreen from '../screens/onboarding/RoleSelectionScreen';
import ConsentPrivacyScreen from '../screens/onboarding/ConsentPrivacyScreen';
import AccountCreationScreen from '../screens/auth/AccountCreationScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import ProviderVerificationScreen from '../screens/auth/ProviderVerificationScreen';
import ParentSetupScreen from '../screens/onboarding/ParentSetupScreen';

export type RootStackParamList = {
  Welcome: undefined;
  RoleSelection: undefined;
  ConsentPrivacy: undefined;
  AccountCreation: undefined;
  Login: undefined;
  ProviderVerification: undefined;
  ParentSetup: undefined;
  MainTabs: undefined;
  Settings: undefined;
  Profile: undefined;
  CrisisResources: undefined;
  DataExport: undefined;
  DataDeletion: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigatorContent: React.FC = () => {
  const { role, isLoading } = useRole();

  // Show loading while determining role/onboarding status
  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
        initialRouteName={role ? 'MainTabs' : 'Welcome'}
      >
        {/* Onboarding Screens */}
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />
        <Stack.Screen name="ConsentPrivacy" component={ConsentPrivacyScreen} />
        <Stack.Screen name="AccountCreation" component={AccountCreationScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="ProviderVerification" component={ProviderVerificationScreen} />
        <Stack.Screen name="ParentSetup" component={ParentSetupScreen} />

        {/* Main App Screens */}
        <Stack.Screen name="MainTabs" component={TabNavigator} />
        <Stack.Screen
          name="Settings"
          component={StackNavigator}
          options={{ headerShown: true, title: 'Settings' }}
        />
        <Stack.Screen
          name="Profile"
          component={StackNavigator}
          options={{ headerShown: true, title: 'Profile' }}
        />
        <Stack.Screen
          name="CrisisResources"
          component={StackNavigator}
          options={{ headerShown: true, title: 'Crisis Resources' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const AppNavigator: React.FC = () => {
  return (
    <RoleProvider>
      <AppNavigatorContent />
    </RoleProvider>
  );
};

export default AppNavigator;

