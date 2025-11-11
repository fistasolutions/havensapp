/**
 * ParentSetupScreen
 * Screen for parent setup when creating a Kid account
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

const ParentSetupScreen: React.FC = () => {
  const navigation = useNavigation();
  const [parentEmail, setParentEmail] = useState('');
  const [parentName, setParentName] = useState('');
  const [childName, setChildName] = useState('');
  const [childAge, setChildAge] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!parentEmail || !parentName || !childName || !childAge) {
      setError('All fields are required');
      return;
    }

    const age = parseInt(childAge, 10);
    if (isNaN(age) || age < 0 || age > 17) {
      setError('Please enter a valid age (0-17)');
      return;
    }

    // In production, this would create the parent account and link the child
    navigation.navigate('ConsentPrivacy' as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Parent Setup</Text>
        <Text style={styles.subtitle}>
          Set up your child's account with parental oversight
        </Text>

        {error && <ErrorMessage message={error} />}

        <Text style={styles.sectionTitle}>Parent Information</Text>
        <Input
          placeholder="Parent Email"
          value={parentEmail}
          onChangeText={setParentEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Input
          placeholder="Parent Name"
          value={parentName}
          onChangeText={setParentName}
          style={styles.input}
        />

        <Text style={styles.sectionTitle}>Child Information</Text>
        <Input
          placeholder="Child Name"
          value={childName}
          onChangeText={setChildName}
          style={styles.input}
        />

        <Input
          placeholder="Child Age"
          value={childAge}
          onChangeText={setChildAge}
          keyboardType="numeric"
          style={styles.input}
        />

        <Text style={styles.note}>
          As a parent, you will have oversight access to your child's account
          and can review their activity. This complies with COPPA regulations.
        </Text>

        <Button title="Continue" onPress={handleContinue} style={styles.button} />
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
    padding: Spacing.lg,
    justifyContent: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  input: {
    marginBottom: Spacing.md,
  },
  note: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  button: {
    marginTop: Spacing.md,
  },
});

export default ParentSetupScreen;

