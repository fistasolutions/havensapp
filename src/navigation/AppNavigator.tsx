/**
 * Main App Navigator
 * Root navigation component that handles app-wide navigation structure
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import TabNavigator from './TabNavigator';
import StackNavigator from './StackNavigator';

export type RootStackParamList = {
  MainTabs: undefined;
  Settings: undefined;
  Profile: undefined;
  CrisisResources: undefined;
  DataExport: undefined;
  DataDeletion: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
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

export default AppNavigator;

