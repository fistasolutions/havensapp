/**
 * Prompt Card Component
 * Displays a journaling prompt with theme and technique
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../common/Card';
import { JournalPrompt } from '../../services/journal/journalService';

export interface PromptCardProps {
  prompt: JournalPrompt;
  onPress: (prompt: JournalPrompt) => void;
}

const PromptCard: React.FC<PromptCardProps> = ({ prompt, onPress }) => {
  return (
    <TouchableOpacity onPress={() => onPress(prompt)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.theme}>{prompt.theme}</Text>
          <Text style={styles.technique}>{prompt.evidenceBasedTechnique}</Text>
        </View>
        <Text style={styles.promptText}>{prompt.promptText}</Text>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: Spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  theme: {
    ...Typography.subtitle,
    color: Colors.primary,
    fontWeight: '600',
  },
  technique: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textTransform: 'uppercase',
  },
  promptText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 22,
  },
});

export default PromptCard;

