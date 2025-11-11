/**
 * AccountCreationScreen
 * Screen for creating a new user account
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import { register, RegisterData } from '../../services/auth/authService';
import { useRole } from '../../contexts/RoleContext';
import { analyticsService } from '../../services/analytics/analyticsService';

const AccountCreationScreen: React.FC = () => {
  const navigation = useNavigation();
  const { role } = useRole();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Get analytics consent from storage
      const analyticsConsent = await analyticsService.hasConsent();

      const registerData: RegisterData = {
        email,
        password,
        role: role || 'Individual',
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        analyticsConsent,
      };

      await register(registerData);
      Alert.alert('Success', 'Account created successfully!');
      navigation.navigate('MainTabs' as never);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          Enter your information to get started
        </Text>

        {error && <ErrorMessage message={error} />}

        <Input
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />

        <Input
          placeholder="First Name (Optional)"
          value={firstName}
          onChangeText={setFirstName}
          style={styles.input}
        />

        <Input
          placeholder="Last Name (Optional)"
          value={lastName}
          onChangeText={setLastName}
          style={styles.input}
        />

        <Input
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />

        <Input
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          style={styles.input}
        />

        <Button
          title="Create Account"
          onPress={handleRegister}
          style={styles.button}
        />
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
  button: {
    marginTop: Spacing.md,
  },
});

export default AccountCreationScreen;

