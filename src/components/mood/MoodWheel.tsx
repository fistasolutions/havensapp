/**
 * Mood Wheel Component
 * Visual circular interface for selecting emotions
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import { Emotions, Emotion } from '../../constants/emotions';

export interface MoodWheelProps {
  selectedEmotion?: string;
  onEmotionSelect: (emotionLabel: string) => void;
}

const { width } = Dimensions.get('window');
const WHEEL_SIZE = Math.min(width - Spacing.xl * 2, 300);
const CENTER_X = WHEEL_SIZE / 2;
const CENTER_Y = WHEEL_SIZE / 2;
const RADIUS = WHEEL_SIZE / 2 - 40;

const MoodWheel: React.FC<MoodWheelProps> = ({ selectedEmotion, onEmotionSelect }) => {
  // Calculate positions for emotions in a circle
  const getEmotionPosition = (index: number, total: number) => {
    const angle = (index * 2 * Math.PI) / total - Math.PI / 2; // Start from top
    const x = CENTER_X + RADIUS * Math.cos(angle);
    const y = CENTER_Y + RADIUS * Math.sin(angle);
    return { x, y, angle };
  };

  // Group emotions by category for visual organization
  const positiveEmotions = Emotions.filter((e) => e.category === 'positive');
  const neutralEmotions = Emotions.filter((e) => e.category === 'neutral');
  const negativeEmotions = Emotions.filter((e) => e.category === 'negative');

  // Simplified version - show key emotions in a circle
  const keyEmotions = [
    ...positiveEmotions.slice(0, 3),
    ...neutralEmotions.slice(0, 1),
    ...negativeEmotions.slice(0, 3),
  ];

  return (
    <View style={styles.container}>
      <View style={[styles.wheelContainer, { width: WHEEL_SIZE, height: WHEEL_SIZE }]}>
        {/* Center circle */}
        <View style={[styles.centerCircle, { width: WHEEL_SIZE * 0.3, height: WHEEL_SIZE * 0.3 }]}>
          <Text style={styles.centerText}>How are you feeling?</Text>
        </View>

        {/* Emotion buttons positioned in circle */}
        {keyEmotions.map((emotion, index) => {
          const position = getEmotionPosition(index, keyEmotions.length);
          const isSelected = selectedEmotion === emotion.label;

          return (
            <TouchableOpacity
              key={emotion.label}
              style={[
                styles.emotionButton,
                {
                  position: 'absolute',
                  left: position.x - 30,
                  top: position.y - 20,
                  backgroundColor: isSelected ? emotion.color : Colors.white,
                  borderColor: isSelected ? Colors.primary : emotion.color,
                },
              ]}
              onPress={() => onEmotionSelect(emotion.label)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.emotionText,
                  { color: isSelected ? Colors.white : emotion.color },
                ]}
              >
                {emotion.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Fallback: Show all emotions in a grid below wheel */}
      <View style={styles.gridContainer}>
        <Text style={styles.gridTitle}>Or select from all emotions:</Text>
        <View style={styles.grid}>
          {Emotions.map((emotion) => {
            const isSelected = selectedEmotion === emotion.label;
            return (
              <TouchableOpacity
                key={emotion.label}
                style={[
                  styles.gridEmotionButton,
                  {
                    backgroundColor: isSelected ? emotion.color : Colors.grayLight,
                    borderColor: isSelected ? Colors.primary : 'transparent',
                  },
                ]}
                onPress={() => onEmotionSelect(emotion.label)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.gridEmotionText,
                    { color: isSelected ? Colors.white : Colors.grayDark },
                  ]}
                >
                  {emotion.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: Spacing.lg,
  },
  wheelContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  centerCircle: {
    position: 'absolute',
    borderRadius: WHEEL_SIZE * 0.15,
    backgroundColor: Colors.grayLight,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  centerText: {
    ...Typography.caption,
    color: Colors.grayDark,
    textAlign: 'center',
    paddingHorizontal: Spacing.sm,
  },
  emotionButton: {
    width: 60,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xs,
  },
  emotionText: {
    ...Typography.caption,
    fontWeight: '600',
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  gridContainer: {
    width: '100%',
    paddingHorizontal: Spacing.md,
  },
  gridTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  gridEmotionButton: {
    paddingVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
    borderRadius: 16,
    borderWidth: 2,
    minHeight: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridEmotionText: {
    ...Typography.caption,
    textTransform: 'capitalize',
    fontWeight: '500',
  },
});

export default MoodWheel;

