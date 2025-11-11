/**
 * ProviderVerificationScreen
 * Screen for provider license verification during onboarding
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProviderVerificationScreen: React.FC = () => {
  const navigation = useNavigation();
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseState, setLicenseState] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleContinue = () => {
    if (!licenseNumber || !licenseState) {
      setError('License number and state are required');
      return;
    }

    // In production, this would verify the license with a licensing board API
    // For MVP, we'll just proceed to account creation
    navigation.navigate('ConsentPrivacy' as never);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Provider Verification</Text>
        <Text style={styles.subtitle}>
          Please provide your professional license information
        </Text>

        {error && <ErrorMessage message={error} />}

        <Input
          placeholder="License Number"
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          style={styles.input}
        />

        <Input
          placeholder="License State/Province"
          value={licenseState}
          onChangeText={setLicenseState}
          style={styles.input}
        />

        <Input
          placeholder="Specialty (Optional)"
          value={specialty}
          onChangeText={setSpecialty}
          style={styles.input}
        />

        <Text style={styles.note}>
          Your license will be verified before full access is granted. This may
          take 1-2 business days.
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

export default ProviderVerificationScreen;

