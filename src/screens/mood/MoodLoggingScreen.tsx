/**
 * MoodLoggingScreen
 * Screen for logging mood entries with emotion selection
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import EmotionSelector from '../../components/mood/EmotionSelector';
import { moodService } from '../../services/mood/moodService';

const MoodLoggingScreen: React.FC = () => {
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [intensity, setIntensity] = useState<number>(5);
  const [notes, setNotes] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEmotionToggle = (emotionLabel: string) => {
    setSelectedEmotions((prev) => {
      if (prev.includes(emotionLabel)) {
        return prev.filter((e) => e !== emotionLabel);
      }
      return [...prev, emotionLabel];
    });
  };

  const handleSave = async () => {
    if (selectedEmotions.length === 0) {
      setError('Please select at least one emotion');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await moodService.logMood({
        emotionLabels: selectedEmotions,
        intensity: intensity > 0 ? intensity : undefined,
        notes: notes.trim() || undefined,
      });

      Alert.alert('Success', 'Your mood has been logged!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset form
            setSelectedEmotions([]);
            setIntensity(5);
            setNotes('');
          },
        },
      ]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to log mood');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          <Text style={styles.title}>Log My Mood</Text>
          <Text style={styles.subtitle}>How are you feeling right now?</Text>

          {error && <ErrorMessage message={error} />}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Select Emotions</Text>
            <EmotionSelector
              selectedEmotions={selectedEmotions}
              onEmotionToggle={handleEmotionToggle}
              multiSelect={true}
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Intensity (Optional)</Text>
            <Text style={styles.intensityLabel}>
              {intensity}/10 - {intensity <= 3 ? 'Low' : intensity <= 7 ? 'Moderate' : 'High'}
            </Text>
            <View style={styles.sliderContainer}>
              <Text style={styles.sliderMin}>1</Text>
              <View style={styles.sliderTrack}>
                <View
                  style={[
                    styles.sliderFill,
                    { width: `${((intensity - 1) / 9) * 100}%` },
                  ]}
                />
                <View
                  style={[
                    styles.sliderThumb,
                    { left: `${((intensity - 1) / 9) * 100}%` },
                  ]}
                />
              </View>
              <Text style={styles.sliderMax}>10</Text>
            </View>
            <View style={styles.sliderButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((value) => (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.sliderButton,
                    intensity === value && styles.sliderButtonActive,
                  ]}
                  onPress={() => setIntensity(value)}
                >
                  <Text
                    style={[
                      styles.sliderButtonText,
                      intensity === value && styles.sliderButtonTextActive,
                    ]}
                  >
                    {value}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Input
              label="Notes (Optional)"
              placeholder="Add notes about your mood..."
              value={notes}
              onChangeText={setNotes}
              multiline
              numberOfLines={4}
              style={styles.notesInput}
            />
          </View>

          <Button
            title="Save"
            onPress={handleSave}
            disabled={isLoading || selectedEmotions.length === 0}
            loading={isLoading}
            style={styles.saveButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  scrollView: {
    flex: 1,
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
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  intensityLabel: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    textAlign: 'center',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  sliderMin: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginRight: Spacing.sm,
  },
  sliderMax: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginLeft: Spacing.sm,
  },
  sliderTrack: {
    flex: 1,
    height: 4,
    backgroundColor: Colors.grayLight,
    borderRadius: 2,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 2,
  },
  sliderThumb: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    top: -8,
    marginLeft: -10,
  },
  sliderButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
  },
  sliderButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sliderButtonActive: {
    backgroundColor: Colors.primary,
  },
  sliderButtonText: {
    ...Typography.caption,
    color: Colors.grayDark,
  },
  sliderButtonTextActive: {
    color: Colors.white,
    fontWeight: '600',
  },
  notesInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  saveButton: {
    marginTop: Spacing.md,
  },
});

export default MoodLoggingScreen;

