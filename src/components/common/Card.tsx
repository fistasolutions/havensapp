/**
 * Card Component
 * Reusable card container component
 */

import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Spacing } from '../../constants';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: keyof typeof Spacing;
  shadow?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  style,
  padding = 'lg',
  shadow = true,
}) => {
  return (
    <View
      style={[
        styles.card,
        {
          padding: Spacing[padding],
          ...(shadow && styles.shadow),
        },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.grayLight,
  },
  shadow: {
    shadowColor: Colors.grayDark,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});

export default Card;

