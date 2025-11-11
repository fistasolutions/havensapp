/**
 * HomeScreen
 * Main dashboard with widgets for quick access to all features
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import { moodService } from '../../services/mood/moodService';
import { journalService } from '../../services/journal/journalService';
import { exerciseService } from '../../services/exercises/exerciseService';
import { chatbotService } from '../../services/chatbot/chatbotService';
import { analyticsService } from '../../services/analytics/analyticsService';

const HomeScreen: React.FC = () => {
  const navigation = useNavigation();
  const [recentMood, setRecentMood] = useState<any>(null);
  const [recentJournal, setRecentJournal] = useState<any>(null);
  const [suggestedExercise, setSuggestedExercise] = useState<any>(null);
  const [moodTrend, setMoodTrend] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    setIsLoading(true);
    try {
      // Load recent mood
      const moods = await moodService.getMoodEntries({ limit: 1 });
      if (moods.length > 0) {
        setRecentMood(moods[0]);
      }

      // Load recent journal entry
      const journals = await journalService.getJournalEntries();
      if (journals.length > 0) {
        setRecentJournal(journals[0]);
      }

      // Get suggested exercise
      const exercises = await exerciseService.getExercises();
      if (exercises.length > 0) {
        setSuggestedExercise(exercises[0]);
      }

      // Get mood trend summary
      const trends = await moodService.getMoodTrends({ period: 'Weekly' });
      if (trends.length > 0) {
        const latestTrend = trends[0];
        setMoodTrend(latestTrend.direction || 'Stable');
      }

      // Track analytics
      await analyticsService.trackEvent('home_screen_viewed');
    } catch (error) {
      console.error('Error loading home data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await loadHomeData();
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>

        {/* Quick Mood Check-in Widget */}
        <Card style={styles.widget}>
          <Text style={styles.widgetTitle}>How are you feeling?</Text>
          <Text style={styles.widgetDescription}>
            {recentMood
              ? `Last checked in: ${new Date(recentMood.timestamp).toLocaleDateString()}`
              : 'Log your mood to track your emotional well-being'}
          </Text>
          <Button
            title={recentMood ? 'Update Mood' : 'Log Mood'}
            onPress={() => navigation.navigate('Mood' as never)}
            style={styles.widgetButton}
          />
        </Card>

        {/* Mood Trend Summary */}
        {moodTrend && (
          <Card style={styles.widget}>
            <Text style={styles.widgetTitle}>Mood Trend</Text>
            <Text style={styles.widgetDescription}>
              Your mood trend this week: {moodTrend}
            </Text>
            <Button
              title="View Trends"
              onPress={() => navigation.navigate('Mood' as never)}
              variant="outline"
              style={styles.widgetButton}
            />
          </Card>
        )}

        {/* Recent Journal Entry Preview */}
        {recentJournal ? (
          <TouchableOpacity
            onPress={() => navigation.navigate('JournalEntryDetail' as never, { journalEntryId: recentJournal.id } as never)}
          >
            <Card style={styles.widget}>
              <Text style={styles.widgetTitle}>Recent Journal Entry</Text>
              <Text style={styles.widgetDescription} numberOfLines={2}>
                {recentJournal.content}
              </Text>
              <Text style={styles.widgetLink}>View full entry →</Text>
            </Card>
          </TouchableOpacity>
        ) : (
          <Card style={styles.widget}>
            <Text style={styles.widgetTitle}>Start Journaling</Text>
            <Text style={styles.widgetDescription}>
              Journaling can help you process emotions and track your progress
            </Text>
            <Button
              title="New Entry"
              onPress={() => navigation.navigate('JournalEntry' as never)}
              variant="outline"
              style={styles.widgetButton}
            />
          </Card>
        )}

        {/* Daily Journaling Prompt */}
        <Card style={styles.widget}>
          <Text style={styles.widgetTitle}>Today's Prompt</Text>
          <Text style={styles.widgetDescription}>
            "What are three things you're grateful for today?"
          </Text>
          <Button
            title="Write About It"
            onPress={() => navigation.navigate('JournalEntry' as never)}
            style={styles.widgetButton}
          />
        </Card>

        {/* Suggested Exercise */}
        {suggestedExercise && (
          <TouchableOpacity
            onPress={() => navigation.navigate('ExerciseDetail' as never, { exerciseId: suggestedExercise.id } as never)}
          >
            <Card style={styles.widget}>
              <Text style={styles.widgetTitle}>Suggested Exercise</Text>
              <Text style={styles.widgetDescription}>
                {suggestedExercise.title}: {suggestedExercise.description}
              </Text>
              <Text style={styles.widgetLink}>Try this exercise →</Text>
            </Card>
          </TouchableOpacity>
        )}

        {/* Recent Chatbot Preview */}
        <Card style={styles.widget}>
          <Text style={styles.widgetTitle}>Chat with AI Coach</Text>
          <Text style={styles.widgetDescription}>
            Get 24/7 support and guidance from your AI mental health coach
          </Text>
          <Button
            title="Start Chat"
            onPress={() => navigation.navigate('Chat' as never)}
            style={styles.widgetButton}
          />
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
    color: Colors.grayDark,
    marginBottom: Spacing.xl,
  },
  loadingText: {
    ...Typography.body,
    color: Colors.grayMedium,
    textAlign: 'center',
    marginTop: Spacing.xl,
  },
  widget: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  widgetTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  widgetDescription: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.md,
    lineHeight: 20,
  },
  widgetButton: {
    marginTop: Spacing.sm,
  },
  widgetLink: {
    ...Typography.body,
    color: Colors.primary,
    marginTop: Spacing.sm,
    fontWeight: '600',
  },
});

export default HomeScreen;

