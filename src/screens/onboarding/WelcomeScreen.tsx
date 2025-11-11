/**
 * WelcomeScreen
 * First screen shown to new users
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';

const WelcomeScreen: React.FC = () => {
  const navigation = useNavigation();

  const handleGetStarted = () => {
    navigation.navigate('RoleSelection' as never);
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome to Havens</Text>
        <Text style={styles.subtitle}>
          Your personal mental health companion
        </Text>
        <Text style={styles.description}>
          Access evidence-based tools, track your mood, journal your thoughts,
          and get 24/7 support from our AI chatbot.
        </Text>
      </View>

      <View style={styles.footer}>
        <Button title="Get Started" onPress={handleGetStarted} />
        <Text style={styles.disclaimer}>
          By continuing, you agree to our Terms of Service and Privacy Policy
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: Spacing.lg,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.h2,
    color: Colors.grayDark,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  description: {
    ...Typography.body,
    color: Colors.grayMedium,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.md,
  },
  footer: {
    paddingBottom: Spacing.xl,
  },
  disclaimer: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textAlign: 'center',
    marginTop: Spacing.md,
  },
});

export default WelcomeScreen;

