/**
 * MoodTrendsScreen
 * Screen for viewing mood trends over time
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import MoodTrendChart from '../../components/mood/MoodTrendChart';
import Button from '../../components/common/Button';
import { moodService, MoodTrendsResponse } from '../../services/mood/moodService';

type Period = 'Daily' | 'Weekly' | 'Monthly';

const MoodTrendsScreen: React.FC = () => {
  const [period, setPeriod] = useState<Period>('Weekly');
  const [trends, setTrends] = useState<MoodTrendsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadTrends();
  }, [period]);

  const loadTrends = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await moodService.getMoodTrends(period);
      setTrends(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load mood trends');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExport = async () => {
    try {
      const data = await moodService.exportMoodData();
      Alert.alert(
        'Export Complete',
        `Exported ${data.entries.length} mood entries and ${data.trends.length} trends.`,
      );
      // In a real app, this would trigger file download/sharing
    } catch (err) {
      Alert.alert('Export Failed', err instanceof Error ? err.message : 'Failed to export data');
    }
  };

  if (isLoading && !trends) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Mood Trends</Text>
        <Text style={styles.subtitle}>Track your emotional patterns over time</Text>

        {error && <ErrorMessage message={error} />}

        {/* Period selector */}
        <View style={styles.periodSelector}>
          <TouchableOpacity
            style={[styles.periodButton, period === 'Daily' && styles.periodButtonActive]}
            onPress={() => setPeriod('Daily')}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === 'Daily' && styles.periodButtonTextActive,
              ]}
            >
              Daily
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'Weekly' && styles.periodButtonActive]}
            onPress={() => setPeriod('Weekly')}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === 'Weekly' && styles.periodButtonTextActive,
              ]}
            >
              Weekly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.periodButton, period === 'Monthly' && styles.periodButtonActive]}
            onPress={() => setPeriod('Monthly')}
          >
            <Text
              style={[
                styles.periodButtonText,
                period === 'Monthly' && styles.periodButtonTextActive,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Trend chart */}
        {trends && trends.trends.length > 0 ? (
          <MoodTrendChart trends={trends.trends} period={period} />
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No mood data yet</Text>
            <Text style={styles.emptySubtext}>
              Start logging your mood to see trends over time
            </Text>
          </View>
        )}

        {/* Export button */}
        <Button
          title="Export Data"
          onPress={handleExport}
          variant="outline"
          style={styles.exportButton}
        />
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
  periodSelector: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
    gap: Spacing.sm,
  },
  periodButton: {
    flex: 1,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 8,
    backgroundColor: Colors.grayLight,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  periodButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  periodButtonText: {
    ...Typography.button,
    color: Colors.grayDark,
  },
  periodButtonTextActive: {
    color: Colors.white,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 200,
  },
  emptyText: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.grayMedium,
    textAlign: 'center',
  },
  exportButton: {
    marginTop: Spacing.lg,
  },
});

export default MoodTrendsScreen;

