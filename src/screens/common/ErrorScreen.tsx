/**
 * ErrorScreen
 * Full-screen error display with retry option
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants';
import ErrorMessage from '../../components/common/ErrorMessage';

export interface ErrorScreenProps {
  message: string;
  onRetry?: () => void;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ message, onRetry }) => {
  return (
    <View style={styles.container}>
      <ErrorMessage message={message} onRetry={onRetry} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
});

export default ErrorScreen;

