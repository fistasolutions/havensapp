/**
 * JournalEntryScreen
 * Screen for writing journal entries
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import JournalEditor from '../../components/journal/JournalEditor';
import Card from '../../components/common/Card';
import { journalService, JournalPrompt } from '../../services/journal/journalService';

const JournalEntryScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const prompt = (route.params as { prompt?: JournalPrompt })?.prompt;

  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedEntry, setSavedEntry] = useState<any>(null);

  const handleSave = async () => {
    if (content.trim().length < 10) {
      setError('Please write at least 10 characters');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const entry = await journalService.createJournalEntry({
        promptId: prompt?.id,
        content: content.trim(),
      });

      setSavedEntry(entry);

      Alert.alert(
        'Entry Saved',
        entry.sentimentLabel
          ? `Your entry has been saved. Sentiment: ${entry.sentimentLabel}`
          : 'Your entry has been saved.',
        [
          {
            text: 'View Insights',
            onPress: () => {
              navigation.navigate('JournalEntryDetail' as never, { entryId: entry.id } as never);
            },
          },
          {
            text: 'OK',
            onPress: () => {
              navigation.goBack();
            },
          },
        ],
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save journal entry');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Journal Entry</Text>

          {error && <ErrorMessage message={error} />}

          <JournalEditor
            value={content}
            onChangeText={setContent}
            placeholder="Start writing..."
            promptText={prompt?.promptText}
            minLength={10}
            maxLength={10000}
            autoFocus={true}
          />

          {savedEntry && savedEntry.insights && savedEntry.insights.length > 0 && (
            <Card style={styles.insightsCard}>
              <Text style={styles.insightsTitle}>Insights</Text>
              {savedEntry.insights.map((insight: string, index: number) => (
                <Text key={index} style={styles.insightText}>
                  • {insight}
                </Text>
              ))}
            </Card>
          )}

          <Button
            title="Save"
            onPress={handleSave}
            disabled={isLoading || content.trim().length < 10}
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.grayDark,
    marginBottom: Spacing.lg,
  },
  insightsCard: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  insightsTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  insightText: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    lineHeight: 22,
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});

export default JournalEntryScreen;

