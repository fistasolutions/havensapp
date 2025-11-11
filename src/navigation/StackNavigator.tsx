/**
 * Stack Navigator
 * Secondary navigation for settings, profile, and other flows
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { Colors } from '../constants';

// Import screens
import CrisisResourcesScreen from '../screens/crisis/CrisisResourcesScreen';
import SettingsScreen from '../screens/settings/SettingsScreen';
import ProfileScreen from '../screens/settings/ProfileScreen';
import PrivacySettingsScreen from '../screens/settings/PrivacySettingsScreen';
import DataExportScreen from '../screens/settings/DataExportScreen';
import DataDeletionScreen from '../screens/settings/DataDeletionScreen';
import SafetyPlanningScreen from '../screens/crisis/SafetyPlanningScreen';

export type StackParamList = {
  Settings: undefined;
  Profile: undefined;
  PrivacySettings: undefined;
  CrisisResources: undefined;
  SafetyPlanning: undefined;
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
        name="PrivacySettings"
        component={PrivacySettingsScreen}
        options={{ title: 'Privacy Settings' }}
      />
      <Stack.Screen
        name="CrisisResources"
        component={CrisisResourcesScreen}
        options={{ title: 'Crisis Resources' }}
      />
      <Stack.Screen
        name="SafetyPlanning"
        component={SafetyPlanningScreen}
        options={{ title: 'Safety Planning' }}
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

