/**
 * Exercise Card Component
 * Displays a self-help exercise with type and description
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../common/Card';
import { SelfHelpExercise } from '../../services/exercises/exerciseService';

export interface ExerciseCardProps {
  exercise: SelfHelpExercise;
  onPress: (exercise: SelfHelpExercise) => void;
}

const ExerciseCard: React.FC<ExerciseCardProps> = ({ exercise, onPress }) => {
  const getTypeColor = (type: string): string => {
    const typeColors: Record<string, string> = {
      Breathing: Colors.primary,
      Mindfulness: Colors.secondary,
      Affirmation: Colors.accent,
      DistressTolerance: Colors.warning,
      ProgressiveRelaxation: Colors.info,
    };
    return typeColors[type] || Colors.grayMedium;
  };

  return (
    <TouchableOpacity onPress={() => onPress(exercise)} activeOpacity={0.7}>
      <Card style={styles.card}>
        <View style={styles.header}>
          <View
            style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(exercise.type) },
            ]}
          >
            <Text style={styles.typeText}>{exercise.type}</Text>
          </View>
          {exercise.duration && (
            <Text style={styles.duration}>{exercise.duration} min</Text>
          )}
        </View>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {exercise.description}
        </Text>
        <Text style={styles.technique}>{exercise.evidenceBasedTechnique}</Text>
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
  typeBadge: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.sm,
    borderRadius: 12,
  },
  typeText: {
    ...Typography.caption,
    color: Colors.white,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  duration: {
    ...Typography.caption,
    color: Colors.grayMedium,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  description: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  technique: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textTransform: 'uppercase',
    marginTop: Spacing.xs,
  },
});

export default ExerciseCard;

