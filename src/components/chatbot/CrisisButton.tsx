/**
 * CrisisButton Component
 * Button to access crisis resources when crisis is detected
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export interface CrisisButtonProps {
  onPress?: () => void;
}

const CRISIS_RESOURCES = [
  {
    name: '988 Suicide & Crisis Lifeline',
    phone: '988',
    text: 'Text 988',
  },
  {
    name: 'Crisis Text Line',
    phone: '741741',
    text: 'Text HOME to 741741',
  },
  {
    name: 'National Suicide Prevention Lifeline',
    phone: '1-800-273-8255',
    text: 'Call 1-800-273-8255',
  },
];

const CrisisButton: React.FC<CrisisButtonProps> = ({ onPress }) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }

    // Default behavior: Show crisis resources alert
    Alert.alert(
      'Crisis Resources',
      'If you are in immediate danger, please call 911.\n\n' +
        CRISIS_RESOURCES.map((r) => `${r.name}: ${r.text}`).join('\n'),
      [
        { text: 'OK', style: 'default' },
        {
          text: 'Call 988',
          style: 'default',
          onPress: () => {
            // In a real app, this would open the phone dialer
            console.log('Call 988');
          },
        },
      ],
    );
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handlePress}>
      <Text style={styles.buttonText}>🚨 Crisis Resources</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.crisis,
    padding: Spacing.md,
    borderRadius: 8,
    alignItems: 'center',
    margin: Spacing.md,
  },
  buttonText: {
    ...Typography.button,
    color: Colors.white,
  },
});

export default CrisisButton;

