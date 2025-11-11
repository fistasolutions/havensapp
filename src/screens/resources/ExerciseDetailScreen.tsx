/**
 * ExerciseDetailScreen
 * Screen for viewing exercise details and starting exercises
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { exerciseService, SelfHelpExercise } from '../../services/exercises/exerciseService';

const ExerciseDetailScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const exerciseId = (route.params as { exerciseId: string })?.exerciseId;
  const exerciseParam = (route.params as { exercise?: SelfHelpExercise })?.exercise;

  const [exercise, setExercise] = useState<SelfHelpExercise | null>(exerciseParam || null);
  const [isLoading, setIsLoading] = useState(!exerciseParam);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!exerciseParam && exerciseId) {
      loadExercise();
    }
  }, [exerciseId]);

  const loadExercise = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedExercise = await exerciseService.getExercise(exerciseId);
      setExercise(loadedExercise);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exercise');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartExercise = () => {
    navigation.navigate('ExerciseExecution' as never, { exercise } as never);
  };

  const handleMarkComplete = async () => {
    if (!exercise) return;

    Alert.alert(
      'Rate Exercise',
      'How helpful was this exercise?',
      [
        { text: 'Cancel', style: 'cancel' },
        ...([1, 2, 3, 4, 5].map((rating) => ({
          text: `${rating} ⭐`,
          onPress: async () => {
            try {
              await exerciseService.completeExercise(exercise.id, { rating });
              Alert.alert('Success', 'Exercise marked as complete!');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to complete exercise');
            }
          },
        }))),
      ],
    );
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    );
  }

  if (error || !exercise) {
    return (
      <View style={styles.container}>
        <ErrorMessage message={error || 'Exercise not found'} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{exercise.title}</Text>
        <Text style={styles.type}>{exercise.type}</Text>

        <Card style={styles.descriptionCard}>
          <Text style={styles.description}>{exercise.description}</Text>
        </Card>

        {exercise.duration && (
          <View style={styles.metaRow}>
            <Text style={styles.metaLabel}>Duration:</Text>
            <Text style={styles.metaValue}>{exercise.duration} minutes</Text>
          </View>
        )}

        <View style={styles.metaRow}>
          <Text style={styles.metaLabel}>Technique:</Text>
          <Text style={styles.metaValue}>{exercise.evidenceBasedTechnique}</Text>
        </View>

        {exercise.instructions.length > 0 && (
          <Card style={styles.instructionsCard}>
            <Text style={styles.instructionsTitle}>Instructions</Text>
            {exercise.instructions.map((instruction, index) => (
              <View key={index} style={styles.instructionItem}>
                <Text style={styles.instructionNumber}>{index + 1}</Text>
                <Text style={styles.instructionText}>{instruction}</Text>
              </View>
            ))}
          </Card>
        )}

        <View style={styles.actions}>
          <Button
            title="Start Exercise"
            onPress={handleStartExercise}
            style={styles.startButton}
          />
          <Button
            title="Mark as Complete"
            onPress={handleMarkComplete}
            variant="outline"
            style={styles.completeButton}
          />
        </View>
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
  type: {
    ...Typography.body,
    color: Colors.primary,
    fontWeight: '600',
    marginBottom: Spacing.lg,
    textTransform: 'uppercase',
  },
  descriptionCard: {
    marginBottom: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 24,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  metaLabel: {
    ...Typography.body,
    color: Colors.grayMedium,
    fontWeight: '600',
  },
  metaValue: {
    ...Typography.body,
    color: Colors.grayDark,
  },
  instructionsCard: {
    marginTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  instructionsTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: Spacing.md,
  },
  instructionNumber: {
    ...Typography.subtitle,
    color: Colors.primary,
    fontWeight: '600',
    marginRight: Spacing.sm,
    minWidth: 24,
  },
  instructionText: {
    ...Typography.body,
    color: Colors.grayDark,
    flex: 1,
    lineHeight: 22,
  },
  actions: {
    marginTop: Spacing.lg,
  },
  startButton: {
    marginBottom: Spacing.md,
  },
  completeButton: {},
});

export default ExerciseDetailScreen;

