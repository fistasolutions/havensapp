/**
 * MoodDetailScreen
 * Screen for viewing details of a specific mood entry
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import { MoodEntry, moodService } from '../../services/mood/moodService';
import { getEmotionByLabel } from '../../constants/emotions';

export interface MoodDetailScreenProps {
  moodEntryId: string;
  moodEntry?: MoodEntry;
}

const MoodDetailScreen: React.FC<MoodDetailScreenProps> = ({ moodEntryId, moodEntry }) => {
  const [entry, setEntry] = useState<MoodEntry | null>(moodEntry || null);
  const [isLoading, setIsLoading] = useState(!moodEntry);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!moodEntry) {
      loadMoodEntry();
    }
  }, [moodEntryId]);

  const loadMoodEntry = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In a real implementation, we'd fetch a single entry by ID
      // For now, we'll use the cached entries
      const entries = await moodService.getCachedMoodEntries();
      const found = entries.find((e) => e.id === moodEntryId);
      if (found) {
        setEntry(found);
      } else {
        setError('Mood entry not found');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mood entry');
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
        <ErrorMessage message={error || 'Mood entry not found'} />
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

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Mood Entry</Text>
        <Text style={styles.date}>{formatDate(entry.timestamp)}</Text>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Emotions</Text>
          <View style={styles.emotionsContainer}>
            {entry.emotionLabels.map((label) => {
              const emotion = getEmotionByLabel(label);
              return (
                <View
                  key={label}
                  style={[
                    styles.emotionChip,
                    { backgroundColor: emotion?.color || Colors.grayLight },
                  ]}
                >
                  <Text style={styles.emotionText}>{label}</Text>
                </View>
              );
            })}
          </View>
        </View>

        {entry.intensity && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intensity</Text>
            <Text style={styles.intensityText}>
              {entry.intensity}/10 -{' '}
              {entry.intensity <= 3
                ? 'Low'
                : entry.intensity <= 7
                  ? 'Moderate'
                  : 'High'}
            </Text>
          </View>
        )}

        {entry.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Notes</Text>
            <Text style={styles.notesText}>{entry.notes}</Text>
          </View>
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emotionChip: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 16,
    minHeight: 32,
    justifyContent: 'center',
  },
  emotionText: {
    ...Typography.body,
    color: Colors.white,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
  intensityText: {
    ...Typography.body,
    color: Colors.grayDark,
  },
  notesText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 24,
  },
});

export default MoodDetailScreen;

