/**
 * OfflineIndicatorScreen
 * Component to show offline status indicator
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import { isOnline } from '../../services/storage/sync';

const OfflineIndicatorScreen: React.FC = () => {
  const [online, setOnline] = useState(true);

  useEffect(() => {
    const checkOnline = async () => {
      const status = await isOnline();
      setOnline(status);
    };

    checkOnline();
    const interval = setInterval(checkOnline, 5000); // Check every 5 seconds

    return () => clearInterval(interval);
  }, []);

  if (online) {
    return null; // Don't show anything when online
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>📡 Offline Mode - Changes will sync when online</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.warning + '20',
    padding: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.warning,
  },
  text: {
    ...Typography.caption,
    color: Colors.warning,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default OfflineIndicatorScreen;

