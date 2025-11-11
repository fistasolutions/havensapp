/**
 * Input Component
 * Reusable text input component
 */

import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  containerStyle,
  style,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[
          styles.input,
          error && styles.inputError,
          style,
        ]}
        placeholderTextColor={Colors.grayMedium}
        {...textInputProps}
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  label: {
    ...Typography.label,
    marginBottom: Spacing.xs,
    color: Colors.grayDark,
  },
  input: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 8,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.white,
    color: Colors.grayDark,
    minHeight: 44,
  },
  inputError: {
    borderColor: Colors.crisis,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.crisis,
    marginTop: Spacing.xs,
  },
});

export default Input;

