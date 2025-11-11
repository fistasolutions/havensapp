/**
 * JournalingHomeScreen
 * Main screen for journaling with prompts and recent entries
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import PromptCard from '../../components/journal/PromptCard';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { journalService, JournalPrompt, JournalEntry } from '../../services/journal/journalService';
import { moodService } from '../../services/mood/moodService';

const JournalingHomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [recentEntries, setRecentEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Get recent mood to personalize prompts
      let moodContext: string | undefined;
      try {
        const moods = await moodService.getCachedMoodEntries();
        if (moods.length > 0) {
          const latestMood = moods[0];
          moodContext = latestMood.emotionLabels[0];
        }
      } catch (err) {
        // If mood fetch fails, continue without context
        console.error('Error fetching mood for personalization:', err);
      }

      const [promptsData, entriesData] = await Promise.all([
        journalService.getJournalPrompts(moodContext ? { moodContext } : undefined),
        journalService.getJournalEntries({ isDraft: false }),
      ]);

      setPrompts(promptsData);
      setRecentEntries(entriesData.slice(0, 5)); // Show last 5 entries
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load journal data');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: JournalPrompt) => {
    navigation.navigate('JournalEntry' as never, { prompt } as never);
  };

  const handleStartNewEntry = () => {
    navigation.navigate('JournalEntry' as never, {} as never);
  };

  const handleEntryPress = (entry: JournalEntry) => {
    navigation.navigate('JournalEntryDetail' as never, { entryId: entry.id } as never);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Journaling</Text>
        <Text style={styles.subtitle}>Reflect, process, and grow</Text>

        {error && <ErrorMessage message={error} />}

        <Button
          title="Start New Entry"
          onPress={handleStartNewEntry}
          style={styles.newEntryButton}
        />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personalized Prompts</Text>
          {prompts.length > 0 ? (
            prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                prompt={prompt}
                onPress={handlePromptSelect}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No prompts available</Text>
          )}
        </View>

        {recentEntries.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Recent Entries</Text>
            {recentEntries.map((entry) => (
              <TouchableOpacity
                key={entry.id}
                onPress={() => handleEntryPress(entry)}
                activeOpacity={0.7}
              >
                <Card style={styles.entryCard}>
                  <Text style={styles.entryPreview} numberOfLines={2}>
                    {entry.content}
                  </Text>
                  <Text style={styles.entryDate}>
                    {new Date(entry.createdAt).toLocaleDateString()}
                  </Text>
                  {entry.sentimentLabel && (
                    <Text style={styles.entrySentiment}>
                      {entry.sentimentLabel}
                    </Text>
                  )}
                </Card>
              </TouchableOpacity>
            ))}
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
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.lg,
  },
  newEntryButton: {
    marginBottom: Spacing.xl,
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
  emptyText: {
    ...Typography.body,
    color: Colors.grayMedium,
    textAlign: 'center',
    padding: Spacing.lg,
  },
  entryCard: {
    marginBottom: Spacing.md,
  },
  entryPreview: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  entryDate: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginBottom: Spacing.xs,
  },
  entrySentiment: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default JournalingHomeScreen;

