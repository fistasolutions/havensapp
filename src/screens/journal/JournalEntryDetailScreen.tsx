/**
 * JournalEntryDetailScreen
 * Screen for viewing details of a specific journal entry
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import Card from '../../components/common/Card';
import { JournalEntry, journalService } from '../../services/journal/journalService';

const JournalEntryDetailScreen: React.FC = () => {
  const route = useRoute();
  const entryId = (route.params as { entryId: string })?.entryId;
  const entryParam = (route.params as { entry?: JournalEntry })?.entry;

  const [entry, setEntry] = useState<JournalEntry | null>(entryParam || null);
  const [isLoading, setIsLoading] = useState(!entryParam);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!entryParam && entryId) {
      loadJournalEntry();
    }
  }, [entryId]);

  const loadJournalEntry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedEntry = await journalService.getJournalEntry(entryId);
      setEntry(loadedEntry);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal entry');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    );
  }

  if (error || !entry) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error || 'Journal entry not found'} />
      </View>
    );
  }

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getSentimentColor = (label?: string): string => {
    switch (label) {
      case 'Positive':
        return Colors.success;
      case 'Negative':
        return Colors.crisis;
      default:
        return Colors.grayMedium;
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Journal Entry</Text>
        <Text style={styles.date}>{formatDate(entry.createdAt)}</Text>

        {entry.promptText && (
          <Card style={styles.promptCard}>
            <Text style={styles.promptLabel}>Prompt:</Text>
            <Text style={styles.promptText}>{entry.promptText}</Text>
          </Card>
        )}

        <Card style={styles.contentCard}>
          <Text style={styles.contentText}>{entry.content}</Text>
        </Card>

        {(entry.sentimentLabel || entry.sentimentScore !== undefined) && (
          <Card style={styles.sentimentCard}>
            <Text style={styles.sentimentTitle}>Sentiment Analysis</Text>
            {entry.sentimentLabel && (
              <View style={styles.sentimentRow}>
                <Text style={styles.sentimentLabel}>Label: </Text>
                <Text
                  style={[
                    styles.sentimentValue,
                    { color: getSentimentColor(entry.sentimentLabel) },
                  ]}
                >
                  {entry.sentimentLabel}
                </Text>
              </View>
            )}
            {entry.sentimentScore !== undefined && (
              <View style={styles.sentimentRow}>
                <Text style={styles.sentimentLabel}>Score: </Text>
                <Text style={styles.sentimentValue}>
                  {entry.sentimentScore.toFixed(2)} (-1 to 1)
                </Text>
              </View>
            )}
          </Card>
        )}

        {entry.insights && entry.insights.length > 0 && (
          <Card style={styles.insightsCard}>
            <Text style={styles.insightsTitle}>Insights & Reframing</Text>
            {entry.insights.map((insight, index) => (
              <Text key={index} style={styles.insightText}>
                • {insight}
              </Text>
            ))}
          </Card>
        )}
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
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  date: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.lg,
  },
  promptCard: {
    marginBottom: Spacing.md,
    backgroundColor: Colors.grayLight,
  },
  promptLabel: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  promptText: {
    ...Typography.body,
    color: Colors.grayDark,
    fontStyle: 'italic',
  },
  contentCard: {
    marginBottom: Spacing.md,
  },
  contentText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 24,
  },
  sentimentCard: {
    marginBottom: Spacing.md,
  },
  sentimentTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  sentimentRow: {
    flexDirection: 'row',
    marginBottom: Spacing.xs,
  },
  sentimentLabel: {
    ...Typography.body,
    color: Colors.grayDark,
  },
  sentimentValue: {
    ...Typography.body,
    color: Colors.grayDark,
    fontWeight: '600',
  },
  insightsCard: {
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
});

export default JournalEntryDetailScreen;

