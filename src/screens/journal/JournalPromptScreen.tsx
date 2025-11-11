/**
 * JournalPromptScreen
 * Screen for selecting a journal prompt
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import PromptCard from '../../components/journal/PromptCard';
import { journalService, JournalPrompt } from '../../services/journal/journalService';
import { moodService } from '../../services/mood/moodService';

const JournalPromptScreen: React.FC = () => {
  const navigation = useNavigation();
  const [prompts, setPrompts] = useState<JournalPrompt[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
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

      const promptsData = await journalService.getJournalPrompts(
        moodContext ? { moodContext } : undefined,
      );
      setPrompts(promptsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load prompts');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePromptSelect = (prompt: JournalPrompt) => {
    navigation.navigate('JournalEntry' as never, { prompt } as never);
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
        <Text style={styles.title}>Choose a Prompt</Text>
        <Text style={styles.subtitle}>Select a prompt to guide your reflection</Text>

        {error && <ErrorMessage message={error} />}

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
  emptyText: {
    ...Typography.body,
    color: Colors.grayMedium,
    textAlign: 'center',
    padding: Spacing.xl,
  },
});

export default JournalPromptScreen;

