/**
 * SelfHelpResourcesScreen
 * Main screen for accessing self-help exercises
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import ExerciseCard from '../../components/exercises/ExerciseCard';
import ProgressTracker from '../../components/exercises/ProgressTracker';
import { exerciseService, SelfHelpExercise, ExerciseProgress } from '../../services/exercises/exerciseService';
import { moodService } from '../../services/mood/moodService';

type ExerciseType = 'All' | 'Breathing' | 'Mindfulness' | 'Affirmation' | 'DistressTolerance' | 'ProgressiveRelaxation';

const SelfHelpResourcesScreen: React.FC = () => {
  const navigation = useNavigation();
  const [exercises, setExercises] = useState<SelfHelpExercise[]>([]);
  const [progress, setProgress] = useState<ExerciseProgress | null>(null);
  const [selectedType, setSelectedType] = useState<ExerciseType>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedType]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [exercisesData, progressData] = await Promise.all([
        exerciseService.getExercises(
          selectedType !== 'All' ? { type: selectedType } : undefined,
        ),
        exerciseService.getExerciseProgress().catch(() => null), // Progress is optional
      ]);

      setExercises(exercisesData);
      setProgress(progressData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load exercises');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExercisePress = (exercise: SelfHelpExercise) => {
    navigation.navigate('ExerciseDetail' as never, { exerciseId: exercise.id } as never);
  };

  const exerciseTypes: ExerciseType[] = [
    'All',
    'Breathing',
    'Mindfulness',
    'Affirmation',
    'DistressTolerance',
    'ProgressiveRelaxation',
  ];

  if (isLoading && exercises.length === 0) {
    return (
      <View style={styles.container}>
        <LoadingIndicator />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Self-Help Resources</Text>
        <Text style={styles.subtitle}>Evidence-based exercises for your well-being</Text>

        {error && <ErrorMessage message={error} />}

        {progress && <ProgressTracker progress={progress} />}

        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {exerciseTypes.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  selectedType === type && styles.filterButtonActive,
                ]}
                onPress={() => setSelectedType(type)}
              >
                <Text
                  style={[
                    styles.filterButtonText,
                    selectedType === type && styles.filterButtonTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {exercises.length > 0 ? (
          exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              onPress={handleExercisePress}
            />
          ))
        ) : (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No exercises available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for new exercises
            </Text>
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
  filterContainer: {
    marginBottom: Spacing.lg,
  },
  filterButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    backgroundColor: Colors.grayLight,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterButtonText: {
    ...Typography.button,
    color: Colors.grayDark,
  },
  filterButtonTextActive: {
    color: Colors.white,
  },
  emptyContainer: {
    padding: Spacing.xl,
    alignItems: 'center',
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
});

export default SelfHelpResourcesScreen;

