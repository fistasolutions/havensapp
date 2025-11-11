/**
 * PrivacySettingsScreen
 * Screen for managing privacy settings and data preferences
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { analyticsService } from '../../services/analytics/analyticsService';
import { apiClient } from '../../services/api/client';

const PrivacySettingsScreen: React.FC = () => {
  const [analyticsConsent, setAnalyticsConsent] = useState(false);
  const [dataRetentionDays, setDataRetentionDays] = useState(2555); // 7 years default
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadPrivacySettings();
  }, []);

  const loadPrivacySettings = async () => {
    setIsLoading(true);
    try {
      const consent = await analyticsService.hasConsent();
      setAnalyticsConsent(consent);

      // Load data retention preference from API
      const response = await apiClient.get('/user/privacy').catch(() => ({
        data: { dataRetentionPreference: 2555 },
      }));
      setDataRetentionDays(response.data.dataRetentionPreference || 2555);
    } catch (error) {
      console.error('Error loading privacy settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await analyticsService.setConsent(analyticsConsent);
      await apiClient.put('/user/privacy', {
        dataRetentionPreference: dataRetentionDays,
      });
      Alert.alert('Success', 'Privacy settings updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update privacy settings');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  const retentionOptions = [
    { label: '1 Year', days: 365 },
    { label: '3 Years', days: 1095 },
    { label: '5 Years', days: 1825 },
    { label: '7 Years', days: 2555 },
    { label: '10 Years', days: 3650 },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Privacy Settings</Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Analytics & Data Collection</Text>
          <Text style={styles.sectionDescription}>
            Help us improve Havens by sharing anonymous usage data. This data is
            anonymized and never includes personal information.
          </Text>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAnalyticsConsent(!analyticsConsent)}
          >
            <Text style={styles.checkbox}>
              {analyticsConsent ? '☑' : '☐'}
            </Text>
            <Text style={styles.checkboxLabel}>
              Share anonymous analytics data
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Data Retention</Text>
          <Text style={styles.sectionDescription}>
            Choose how long your data is retained. Minimum retention is 30 days
            for account recovery purposes.
          </Text>
          {retentionOptions.map((option) => (
            <TouchableOpacity
              key={option.days}
              style={[
                styles.retentionOption,
                dataRetentionDays === option.days && styles.retentionOptionSelected,
              ]}
              onPress={() => setDataRetentionDays(option.days)}
            >
              <Text
                style={[
                  styles.retentionOptionText,
                  dataRetentionDays === option.days && styles.retentionOptionTextSelected,
                ]}
              >
                {option.label}
              </Text>
              {dataRetentionDays === option.days && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </TouchableOpacity>
          ))}
        </Card>

        <Button
          title="Save Privacy Settings"
          onPress={handleSave}
          loading={isSaving}
          disabled={isSaving}
          style={styles.saveButton}
        />
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
    marginBottom: Spacing.lg,
  },
  card: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  sectionDescription: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  checkbox: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.grayDark,
    flex: 1,
  },
  retentionOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.grayLight,
    marginBottom: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  retentionOptionSelected: {
    backgroundColor: Colors.primary + '20',
    borderColor: Colors.primary,
  },
  retentionOptionText: {
    ...Typography.body,
    color: Colors.grayDark,
  },
  retentionOptionTextSelected: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkmark: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: 'bold',
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});

export default PrivacySettingsScreen;

