/**
 * Breathing Exercise Component
 * Interactive breathing exercise with visual guidance
 */

import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../common/Button';

export interface BreathingExerciseProps {
  onComplete?: (duration: number) => void;
  onCancel?: () => void;
}

const BreathingExercise: React.FC<BreathingExerciseProps> = ({ onComplete, onCancel }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<'inhale' | 'hold' | 'exhale' | 'pause'>('inhale');
  const [cycle, setCycle] = useState(0);
  const [duration, setDuration] = useState(0);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const startTime = useRef<number | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const phases = [
    { name: 'inhale', label: 'Breathe In', duration: 4000, color: Colors.primary },
    { name: 'hold', label: 'Hold', duration: 4000, color: Colors.secondary },
    { name: 'exhale', label: 'Breathe Out', duration: 4000, color: Colors.accent },
    { name: 'pause', label: 'Pause', duration: 2000, color: Colors.grayLight },
  ];

  useEffect(() => {
    if (isActive) {
      startTime.current = Date.now();
      runBreathingCycle();
      const interval = setInterval(() => {
        setDuration(Math.floor((Date.now() - (startTime.current || 0)) / 1000));
      }, 1000);
      intervalRef.current = interval;
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive]);

  const runBreathingCycle = () => {
    let currentPhaseIndex = 0;

    const nextPhase = () => {
      const currentPhase = phases[currentPhaseIndex];
      setPhase(currentPhase.name as any);

      // Animate circle
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: currentPhase.name === 'inhale' ? 1.5 : currentPhase.name === 'exhale' ? 0.8 : 1,
          duration: currentPhase.duration,
          useNativeDriver: true,
        }),
      ]).start();

      currentPhaseIndex = (currentPhaseIndex + 1) % phases.length;

      if (isActive) {
        if (currentPhaseIndex === 0) {
          setCycle((prev) => prev + 1);
        }
        setTimeout(nextPhase, currentPhase.duration);
      }
    };

    nextPhase();
  };

  const handleStart = () => {
    setIsActive(true);
  };

  const handleStop = () => {
    setIsActive(false);
    if (onComplete && startTime.current) {
      const totalDuration = Math.floor((Date.now() - startTime.current) / 1000);
      onComplete(totalDuration);
    }
  };

  const handleCancel = () => {
    setIsActive(false);
    if (onCancel) {
      onCancel();
    }
  };

  const currentPhaseData = phases.find((p) => p.name === phase) || phases[0];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Box Breathing</Text>
      <Text style={styles.subtitle}>Follow the circle to guide your breathing</Text>

      <View style={styles.circleContainer}>
        <Animated.View
          style={[
            styles.circle,
            {
              backgroundColor: currentPhaseData.color,
              transform: [{ scale: scaleAnim }],
            },
          ]}
        >
          <Text style={styles.phaseLabel}>{currentPhaseData.label}</Text>
          {isActive && <Text style={styles.cycleCount}>{cycle} cycles</Text>}
        </Animated.View>
      </View>

      {isActive && (
        <View style={styles.stats}>
          <Text style={styles.durationText}>Duration: {duration}s</Text>
          <Text style={styles.cycleText}>Cycles: {cycle}</Text>
        </View>
      )}

      <View style={styles.controls}>
        {!isActive ? (
          <Button title="Start Exercise" onPress={handleStart} />
        ) : (
          <>
            <Button title="Complete" onPress={handleStop} variant="primary" />
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="outline"
              style={styles.cancelButton}
            />
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  title: {
    ...Typography.h1,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  circleContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: Spacing.xl,
  },
  circle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phaseLabel: {
    ...Typography.h2,
    color: Colors.white,
    fontWeight: '600',
  },
  cycleCount: {
    ...Typography.body,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  stats: {
    marginBottom: Spacing.lg,
  },
  durationText: {
    ...Typography.body,
    color: Colors.grayDark,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  cycleText: {
    ...Typography.body,
    color: Colors.grayDark,
    textAlign: 'center',
  },
  controls: {
    width: '100%',
    marginTop: Spacing.lg,
  },
  cancelButton: {
    marginTop: Spacing.md,
  },
});

export default BreathingExercise;

