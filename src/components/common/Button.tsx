/**
 * Button Component
 * Reusable button component with multiple variants and sizes
 */

import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'text';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  style,
  textStyle,
}) => {
  const getButtonStyle = (): ViewStyle => {
    const baseStyle: ViewStyle = {
      borderRadius: 8,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
    };

    // Size styles
    const sizeStyles: Record<string, ViewStyle> = {
      small: {
        paddingVertical: Spacing.sm,
        paddingHorizontal: Spacing.md,
        minHeight: 36,
      },
      medium: {
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.lg,
        minHeight: 44,
      },
      large: {
        paddingVertical: Spacing.lg,
        paddingHorizontal: Spacing.xl,
        minHeight: 52,
      },
    };

    // Variant styles
    const variantStyles: Record<string, ViewStyle> = {
      primary: {
        backgroundColor: disabled ? Colors.grayMedium : Colors.primary,
      },
      secondary: {
        backgroundColor: disabled ? Colors.grayMedium : Colors.secondary,
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: disabled ? Colors.grayMedium : Colors.primary,
      },
      text: {
        backgroundColor: 'transparent',
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
      opacity: disabled ? 0.5 : 1,
    };
  };

  const getTextStyle = (): TextStyle => {
    const baseStyle: TextStyle = {
      fontWeight: '600',
    };

    const sizeStyles: Record<string, TextStyle> = {
      small: Typography.buttonSmall,
      medium: Typography.button,
      large: Typography.buttonLarge,
    };

    const variantStyles: Record<string, TextStyle> = {
      primary: {
        color: Colors.white,
      },
      secondary: {
        color: Colors.white,
      },
      outline: {
        color: disabled ? Colors.grayMedium : Colors.primary,
      },
      text: {
        color: disabled ? Colors.grayMedium : Colors.primary,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator
          color={variant === 'primary' || variant === 'secondary' ? Colors.white : Colors.primary}
          size="small"
        />
      ) : (
        <Text style={[getTextStyle(), textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

export default Button;

