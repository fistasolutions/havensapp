/**
 * CrisisResourcesScreen
 * Screen displaying crisis resources and emergency contacts
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, Linking } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    text: 'Text or call 988',
    description: 'Free, confidential support 24/7',
  },
  {
    name: 'Crisis Text Line',
    phone: '741741',
    text: 'Text HOME to 741741',
    description: 'Free 24/7 crisis support via text',
  },
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '1-800-273-8255',
    text: 'Call 1-800-273-8255',
    description: 'Free, confidential support',
  },
  {
    name: 'Emergency Services',
    phone: '911',
    text: 'Call 911',
    description: 'For immediate emergencies',
  },
];

const CrisisResourcesScreen: React.FC = () => {
  const handleCall = (phone: string) => {
    Linking.openURL(`tel:${phone}`);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Crisis Resources</Text>
        <Text style={styles.subtitle}>
          If you are in immediate danger, please call 911
        </Text>
      </View>

      <View style={styles.warning}>
        <Text style={styles.warningText}>
          ⚠️ You are not alone. There are people who want to help you right now.
        </Text>
      </View>

      {CRISIS_RESOURCES.map((resource) => (
        <Card key={resource.name} style={styles.resourceCard}>
          <Text style={styles.resourceName}>{resource.name}</Text>
          <Text style={styles.resourceDescription}>{resource.description}</Text>
          <View style={styles.resourceActions}>
            <Button
              title={resource.text}
              onPress={() => handleCall(resource.phone)}
              variant="primary"
              size="medium"
            />
          </View>
        </Card>
      ))}

      <View style={styles.footer}>
        <Text style={styles.footerText}>
          These resources are available 24/7. Please reach out if you need
          support.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
  },
  warning: {
    backgroundColor: Colors.crisis + '20',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.crisis,
  },
  warningText: {
    ...Typography.body,
    color: Colors.grayDark,
  },
  resourceCard: {
    marginBottom: Spacing.md,
  },
  resourceName: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  resourceDescription: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.md,
  },
  resourceActions: {
    marginTop: Spacing.sm,
  },
  footer: {
    marginTop: Spacing.xl,
    padding: Spacing.md,
  },
  footerText: {
    ...Typography.bodySmall,
    color: Colors.grayMedium,
    textAlign: 'center',
  },
});

export default CrisisResourcesScreen;

