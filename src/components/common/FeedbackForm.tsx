/**
 * Feedback Form Component
 * Collects user feedback after sessions
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from './Button';
import Card from './Card';

export interface FeedbackFormProps {
  sessionType: 'Chatbot' | 'MoodLogging' | 'Journaling' | 'Exercise' | 'General';
  onSubmit: (rating: number, feedbackText?: string) => void;
  onSkip?: () => void;
  isSubmitting?: boolean;
}

const FeedbackForm: React.FC<FeedbackFormProps> = ({
  sessionType,
  onSubmit,
  onSkip,
  isSubmitting = false,
}) => {
  const [rating, setRating] = useState<number | null>(null);
  const [feedbackText, setFeedbackText] = useState('');

  const handleSubmit = () => {
    if (rating !== null) {
      onSubmit(rating, feedbackText.trim() || undefined);
    }
  };

  return (
    <Card style={styles.container}>
      <Text style={styles.title}>How was your experience?</Text>
      <Text style={styles.subtitle}>
        Your feedback helps us improve {sessionType.toLowerCase()} for everyone.
      </Text>

      <View style={styles.ratingContainer}>
        {[1, 2, 3, 4, 5].map((value) => (
          <TouchableOpacity
            key={value}
            style={[styles.ratingButton, rating === value && styles.ratingButtonSelected]}
            onPress={() => setRating(value)}
          >
            <Text style={[styles.ratingText, rating === value && styles.ratingTextSelected]}>
              {value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.feedbackInput}
        placeholder="Optional: Tell us more about your experience..."
        placeholderTextColor={Colors.grayMedium}
        multiline
        numberOfLines={4}
        value={feedbackText}
        onChangeText={setFeedbackText}
      />

      <View style={styles.actions}>
        <Button
          title="Submit Feedback"
          onPress={handleSubmit}
          disabled={rating === null || isSubmitting}
          loading={isSubmitting}
          style={styles.submitButton}
        />
        {onSkip && (
          <Button
            title="Skip"
            onPress={onSkip}
            variant="outline"
            style={styles.skipButton}
          />
        )}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  subtitle: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginBottom: Spacing.md,
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: Spacing.md,
  },
  ratingButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  ratingButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  ratingText: {
    ...Typography.h2,
    color: Colors.grayMedium,
  },
  ratingTextSelected: {
    color: Colors.white,
  },
  feedbackInput: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 8,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    minHeight: 100,
    textAlignVertical: 'top',
    color: Colors.grayDark,
  },
  actions: {
    marginTop: Spacing.sm,
  },
  submitButton: {
    marginBottom: Spacing.sm,
  },
  skipButton: {},
});

export default FeedbackForm;

