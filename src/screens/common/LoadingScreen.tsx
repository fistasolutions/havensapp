/**
 * LoadingScreen
 * Full-screen loading indicator
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';

const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <LoadingIndicator />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;

