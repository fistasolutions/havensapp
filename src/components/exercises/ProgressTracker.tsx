/**
 * Progress Tracker Component
 * Displays user exercise completion progress
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../common/Card';
import { ExerciseProgress } from '../../services/exercises/exerciseService';

export interface ProgressTrackerProps {
  progress: ExerciseProgress;
}

const ProgressTracker: React.FC<ProgressTrackerProps> = ({ progress }) => {
  return (
    <Card style={styles.container}>
      <Text style={styles.title}>Your Progress</Text>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.totalCompletions}</Text>
          <Text style={styles.statLabel}>Total Completions</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{progress.exercisesCompleted}</Text>
          <Text style={styles.statLabel}>Exercises Completed</Text>
        </View>
      </View>

      {progress.recentCompletions.length > 0 && (
        <View style={styles.recentSection}>
          <Text style={styles.recentTitle}>Recent Activity</Text>
          {progress.recentCompletions.slice(0, 5).map((completion) => (
            <View key={completion.id} style={styles.recentItem}>
              <Text style={styles.recentText}>
                Completed {new Date(completion.completedAt).toLocaleDateString()}
              </Text>
              {completion.rating && (
                <Text style={styles.ratingText}>
                  {'⭐'.repeat(completion.rating)}
                </Text>
              )}
            </View>
          ))}
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    ...Typography.h2,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textAlign: 'center',
  },
  recentSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.grayLight,
  },
  recentTitle: {
    ...Typography.body,
    color: Colors.grayDark,
    fontWeight: '600',
    marginBottom: Spacing.sm,
  },
  recentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  recentText: {
    ...Typography.caption,
    color: Colors.grayDark,
  },
  ratingText: {
    ...Typography.caption,
    color: Colors.warning,
  },
});

export default ProgressTracker;

