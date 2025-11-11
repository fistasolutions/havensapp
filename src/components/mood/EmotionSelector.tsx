/**
 * Emotion Selector Component
 * Allows users to select one or more emotions for mood logging
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import { Emotions, Emotion } from '../../constants/emotions';

export interface EmotionSelectorProps {
  selectedEmotions: string[];
  onEmotionToggle: (emotionLabel: string) => void;
  multiSelect?: boolean;
}

const EmotionSelector: React.FC<EmotionSelectorProps> = ({
  selectedEmotions,
  onEmotionToggle,
  multiSelect = true,
}) => {
  const isSelected = (emotionLabel: string): boolean => {
    return selectedEmotions.includes(emotionLabel);
  };

  const handleEmotionPress = (emotionLabel: string) => {
    if (!multiSelect && selectedEmotions.length > 0 && !isSelected(emotionLabel)) {
      // Single select mode - replace selection
      const currentSelected = selectedEmotions[0];
      if (currentSelected) {
        onEmotionToggle(currentSelected);
      }
    }
    onEmotionToggle(emotionLabel);
  };

  const getEmotionsByCategory = (category: Emotion['category']): Emotion[] => {
    return Emotions.filter((emotion) => emotion.category === category);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Positive</Text>
        <View style={styles.emotionGrid}>
          {getEmotionsByCategory('positive').map((emotion) => (
            <TouchableOpacity
              key={emotion.label}
              style={[
                styles.emotionButton,
                isSelected(emotion.label) && styles.emotionButtonSelected,
                { backgroundColor: isSelected(emotion.label) ? emotion.color : Colors.grayLight },
              ]}
              onPress={() => handleEmotionPress(emotion.label)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.emotionText,
                  isSelected(emotion.label) && styles.emotionTextSelected,
                ]}
              >
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Neutral</Text>
        <View style={styles.emotionGrid}>
          {getEmotionsByCategory('neutral').map((emotion) => (
            <TouchableOpacity
              key={emotion.label}
              style={[
                styles.emotionButton,
                isSelected(emotion.label) && styles.emotionButtonSelected,
                { backgroundColor: isSelected(emotion.label) ? emotion.color : Colors.grayLight },
              ]}
              onPress={() => handleEmotionPress(emotion.label)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.emotionText,
                  isSelected(emotion.label) && styles.emotionTextSelected,
                ]}
              >
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Challenging</Text>
        <View style={styles.emotionGrid}>
          {getEmotionsByCategory('negative').map((emotion) => (
            <TouchableOpacity
              key={emotion.label}
              style={[
                styles.emotionButton,
                isSelected(emotion.label) && styles.emotionButtonSelected,
                { backgroundColor: isSelected(emotion.label) ? emotion.color : Colors.grayLight },
              ]}
              onPress={() => handleEmotionPress(emotion.label)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.emotionText,
                  isSelected(emotion.label) && styles.emotionTextSelected,
                ]}
              >
                {emotion.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
  },
  sectionTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    fontWeight: '600',
  },
  emotionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
  },
  emotionButton: {
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.md,
    borderRadius: 20,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  emotionButtonSelected: {
    borderColor: Colors.primary,
  },
  emotionText: {
    ...Typography.body,
    color: Colors.grayDark,
    textTransform: 'capitalize',
  },
  emotionTextSelected: {
    color: Colors.white,
    fontWeight: '600',
  },
});

export default EmotionSelector;

