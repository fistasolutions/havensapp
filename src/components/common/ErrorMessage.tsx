/**
 * Error Message Component
 * Reusable error message display component
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  retryLabel?: string;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  retryLabel = 'Retry',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <TouchableOpacity onPress={onRetry} style={styles.retryButton}>
          <Text style={styles.retryText}>{retryLabel}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  message: {
    ...Typography.body,
    color: Colors.crisis,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  retryButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.primary,
  },
  retryText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default ErrorMessage;

