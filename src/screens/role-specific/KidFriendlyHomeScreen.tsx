/**
 * KidFriendlyHomeScreen
 * Age-appropriate home screen for kids
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';

const KidFriendlyHomeScreen: React.FC = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome! 👋</Text>
        <Text style={styles.subtitle}>
          How are you feeling today?
        </Text>

        <View style={styles.emojiRow}>
          {['😊', '😢', '😡', '😰', '😴'].map((emoji) => (
            <TouchableOpacity key={emoji} style={styles.emojiButton}>
              <Text style={styles.emoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Chat with Buddy</Text>
          <Text style={styles.cardText}>
            Talk to your friendly AI buddy about how you're feeling!
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Start Chat</Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Fun Activities</Text>
          <Text style={styles.cardText}>
            Try breathing exercises and fun games to feel better!
          </Text>
          <TouchableOpacity style={styles.cardButton}>
            <Text style={styles.cardButtonText}>Play Games</Text>
          </TouchableOpacity>
        </Card>
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
    color: Colors.primary,
    marginBottom: Spacing.xs,
    textAlign: 'center',
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.lg,
    textAlign: 'center',
  },
  emojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.xl,
  },
  emojiButton: {
    padding: Spacing.md,
    borderRadius: 50,
    backgroundColor: Colors.grayLight,
  },
  emoji: {
    fontSize: 32,
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
  cardButton: {
    backgroundColor: Colors.primary,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
  },
  cardButtonText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default KidFriendlyHomeScreen;

