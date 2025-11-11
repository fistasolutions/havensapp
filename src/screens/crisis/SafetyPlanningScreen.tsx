/**
 * SafetyPlanningScreen
 * Screen for creating and managing safety plans
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';

const SafetyPlanningScreen: React.FC = () => {
  const [warningSigns, setWarningSigns] = useState('');
  const [copingStrategies, setCopingStrategies] = useState('');
  const [supportContacts, setSupportContacts] = useState('');
  const [professionalHelp, setProfessionalHelp] = useState('');
  const [safeEnvironments, setSafeEnvironments] = useState('');

  const handleSave = () => {
    // In production, this would save to the backend
    // For MVP, we'll save locally
    console.log('Safety plan saved');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Safety Planning</Text>
        <Text style={styles.subtitle}>
          Create a personalized safety plan to help you during difficult times
        </Text>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Warning Signs</Text>
          <Text style={styles.sectionDescription}>
            What are some warning signs that indicate you might be in crisis?
          </Text>
          <TextInput
            style={styles.textArea}
            value={warningSigns}
            onChangeText={setWarningSigns}
            placeholder="e.g., Feeling hopeless, isolating from others..."
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.grayMedium}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Coping Strategies</Text>
          <Text style={styles.sectionDescription}>
            What strategies help you feel better when you're struggling?
          </Text>
          <TextInput
            style={styles.textArea}
            value={copingStrategies}
            onChangeText={setCopingStrategies}
            placeholder="e.g., Breathing exercises, calling a friend..."
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.grayMedium}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Support Contacts</Text>
          <Text style={styles.sectionDescription}>
            Who can you reach out to for support?
          </Text>
          <TextInput
            style={styles.textArea}
            value={supportContacts}
            onChangeText={setSupportContacts}
            placeholder="e.g., Friend: 555-1234, Family member: 555-5678..."
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.grayMedium}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Professional Help</Text>
          <Text style={styles.sectionDescription}>
            Professional resources you can contact
          </Text>
          <TextInput
            style={styles.textArea}
            value={professionalHelp}
            onChangeText={setProfessionalHelp}
            placeholder="e.g., Therapist: Dr. Smith, 555-9999..."
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.grayMedium}
          />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.sectionTitle}>Safe Environments</Text>
          <Text style={styles.sectionDescription}>
            Places where you feel safe and calm
          </Text>
          <TextInput
            style={styles.textArea}
            value={safeEnvironments}
            onChangeText={setSafeEnvironments}
            placeholder="e.g., My bedroom, the park, library..."
            multiline
            numberOfLines={4}
            placeholderTextColor={Colors.grayMedium}
          />
        </Card>

        <Button title="Save Safety Plan" onPress={handleSave} style={styles.saveButton} />
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.xl,
  },
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  sectionDescription: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginBottom: Spacing.sm,
  },
  textArea: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 8,
    padding: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    color: Colors.grayDark,
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});

export default SafetyPlanningScreen;

