/**
 * SettingsScreen
 * Main settings screen with navigation to various settings options
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';

const SettingsScreen: React.FC = () => {
  const navigation = useNavigation();

  const settingsOptions = [
    {
      title: 'Profile',
      description: 'Manage your personal information',
      screen: 'Profile',
      icon: '👤',
    },
    {
      title: 'Privacy Settings',
      description: 'Control your data and privacy preferences',
      screen: 'PrivacySettings',
      icon: '🔒',
    },
    {
      title: 'Export Data',
      description: 'Download a copy of your data',
      screen: 'DataExport',
      icon: '📥',
    },
    {
      title: 'Delete Account',
      description: 'Permanently delete your account and data',
      screen: 'DataDeletion',
      icon: '🗑️',
    },
    {
      title: 'Crisis Resources',
      description: 'Emergency support and resources',
      screen: 'CrisisResources',
      icon: '🚨',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Settings</Text>

        {settingsOptions.map((option) => (
          <TouchableOpacity
            key={option.screen}
            onPress={() => navigation.navigate(option.screen as never)}
            activeOpacity={0.7}
          >
            <Card style={styles.optionCard}>
              <View style={styles.optionContent}>
                <Text style={styles.optionIcon}>{option.icon}</Text>
                <View style={styles.optionText}>
                  <Text style={styles.optionTitle}>{option.title}</Text>
                  <Text style={styles.optionDescription}>{option.description}</Text>
                </View>
                <Text style={styles.chevron}>›</Text>
              </View>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.grayDark,
    marginBottom: Spacing.xl,
  },
  optionCard: {
    marginBottom: Spacing.md,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    fontSize: 24,
    marginRight: Spacing.md,
  },
  optionText: {
    flex: 1,
  },
  optionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  optionDescription: {
    ...Typography.caption,
    color: Colors.grayMedium,
  },
  chevron: {
    ...Typography.h2,
    color: Colors.grayMedium,
    marginLeft: Spacing.sm,
  },
});

export default SettingsScreen;

