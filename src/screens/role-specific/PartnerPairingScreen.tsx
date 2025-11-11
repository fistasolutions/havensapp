/**
 * PartnerPairingScreen
 * Screen for pairing with a romantic partner
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import ErrorMessage from '../../components/common/ErrorMessage';
import Card from '../../components/common/Card';

const PartnerPairingScreen: React.FC = () => {
  const [pairingCode, setPairingCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isPaired, setIsPaired] = useState(false);

  const handlePair = async () => {
    if (!pairingCode) {
      setError('Please enter a pairing code');
      return;
    }

    // In production, this would call the API to pair with partner
    try {
      // await apiClient.post('/partner/pair', { pairingCode });
      setIsPaired(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to pair');
    }
  };

  const handleGenerateCode = async () => {
    // In production, this would generate a pairing code
    // const response = await apiClient.post('/partner/generate-code');
    // setPairingCode(response.data.code);
    setPairingCode('ABC123');
  };

  if (isPaired) {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Successfully Paired!</Text>
          <Text style={styles.subtitle}>
            You are now connected with your partner. You can share mood
            tracking and journal entries.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Partner Pairing</Text>
        <Text style={styles.subtitle}>
          Connect with your partner to share wellness tracking
        </Text>

        {error && <ErrorMessage message={error} />}

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Enter Pairing Code</Text>
          <Text style={styles.cardText}>
            Ask your partner for their pairing code, or generate one to share
            with them.
          </Text>
          <Input
            placeholder="Pairing Code"
            value={pairingCode}
            onChangeText={setPairingCode}
            style={styles.input}
          />
          <Button title="Pair" onPress={handlePair} style={styles.button} />
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Generate Pairing Code</Text>
          <Text style={styles.cardText}>
            Generate a code to share with your partner
          </Text>
          <Button
            title="Generate Code"
            onPress={handleGenerateCode}
            variant="outline"
            style={styles.button}
          />
          {pairingCode && (
            <Text style={styles.codeDisplay}>Code: {pairingCode}</Text>
          )}
        </Card>
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
  card: {
    marginBottom: Spacing.md,
  },
  cardTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  cardText: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.md,
  },
  input: {
    marginBottom: Spacing.md,
  },
  button: {
    marginTop: Spacing.sm,
  },
  codeDisplay: {
    ...Typography.body,
    color: Colors.primary,
    textAlign: 'center',
    marginTop: Spacing.md,
    fontWeight: '600',
  },
});

export default PartnerPairingScreen;

