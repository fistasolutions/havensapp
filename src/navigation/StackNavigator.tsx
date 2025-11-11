/**
 * Stack Navigator
 * Secondary navigation for settings, profile, and other flows
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants';

// Import screens
import CrisisResourcesScreen from '../screens/crisis/CrisisResourcesScreen';

// Placeholder screens (will be implemented in later phases)
const SettingsScreen = () => null;
const ProfileScreen = () => null;
const DataExportScreen = () => null;
const DataDeletionScreen = () => null;

export type StackParamList = {
  Settings: undefined;
  Profile: undefined;
  CrisisResources: undefined;
  DataExport: undefined;
  DataDeletion: undefined;
};

const Stack = createStackNavigator<StackParamList>();

const StackNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.grayDark,
        headerTitleStyle: {
          fontWeight: '600',
        },
      }}
    >
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: 'Settings' }}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ title: 'Profile' }}
      />
      <Stack.Screen
        name="CrisisResources"
        component={CrisisResourcesScreen}
        options={{ title: 'Crisis Resources' }}
      />
      <Stack.Screen
        name="DataExport"
        component={DataExportScreen}
        options={{ title: 'Export Data' }}
      />
      <Stack.Screen
        name="DataDeletion"
        component={DataDeletionScreen}
        options={{ title: 'Delete Account' }}
      />
    </Stack.Navigator>
  );
};

export default StackNavigator;

