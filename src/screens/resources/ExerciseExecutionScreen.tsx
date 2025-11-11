/**
 * ExerciseExecutionScreen
 * Screen for executing interactive exercises
 */

import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Colors } from '../../constants';
import BreathingExercise from '../../components/exercises/BreathingExercise';
import { exerciseService, SelfHelpExercise } from '../../services/exercises/exerciseService';
import { Alert } from 'react-native';

const ExerciseExecutionScreen: React.FC = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const exercise = (route.params as { exercise?: SelfHelpExercise })?.exercise;

  const handleComplete = async (duration: number) => {
    if (!exercise) return;

    Alert.alert(
      'Exercise Complete',
      `Great job! You completed ${Math.floor(duration / 60)} minutes. How helpful was this exercise?`,
      [
        { text: 'Cancel', style: 'cancel' },
        ...([1, 2, 3, 4, 5].map((rating) => ({
          text: `${rating} ⭐`,
          onPress: async () => {
            try {
              await exerciseService.completeExercise(exercise.id, { duration, rating });
              Alert.alert('Success', 'Exercise saved to your progress!');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Failed to save exercise');
            }
          },
        }))),
      ],
    );
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  if (!exercise) {
    return null;
  }

  // For now, show breathing exercise for all types
  // In production, this would render different components based on exercise type
  if (exercise.type === 'Breathing') {
    return (
      <View style={styles.container}>
        <BreathingExercise onComplete={handleComplete} onCancel={handleCancel} />
      </View>
    );
  }

  // Placeholder for other exercise types
  return (
    <View style={styles.container}>
      {/* Other exercise types would render here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
});

export default ExerciseExecutionScreen;

