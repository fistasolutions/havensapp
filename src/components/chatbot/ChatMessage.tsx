/**
 * ChatMessage Component
 * Displays individual chat messages (user or assistant)
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: string;
}

const ChatMessage: React.FC<ChatMessageProps> = ({
  role,
  content,
  timestamp,
}) => {
  const isUser = role === 'user';
  const isSystem = role === 'system';

  return (
    <View
      style={[
        styles.container,
        isUser && styles.userContainer,
        isSystem && styles.systemContainer,
      ]}
    >
      <View
        style={[
          styles.messageBubble,
          isUser && styles.userBubble,
          !isUser && !isSystem && styles.assistantBubble,
          isSystem && styles.systemBubble,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            isUser && styles.userText,
            !isUser && !isSystem && styles.assistantText,
            isSystem && styles.systemText,
          ]}
        >
          {content}
        </Text>
        {timestamp && (
          <Text style={styles.timestamp}>
            {new Date(timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
    paddingHorizontal: Spacing.md,
  },
  userContainer: {
    alignItems: 'flex-end',
  },
  systemContainer: {
    alignItems: 'center',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: Spacing.md,
    borderRadius: 16,
  },
  userBubble: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4,
  },
  assistantBubble: {
    backgroundColor: Colors.grayLight,
    borderBottomLeftRadius: 4,
  },
  systemBubble: {
    backgroundColor: Colors.info,
    maxWidth: '90%',
  },
  messageText: {
    ...Typography.body,
  },
  userText: {
    color: Colors.white,
  },
  assistantText: {
    color: Colors.grayDark,
  },
  systemText: {
    color: Colors.white,
    textAlign: 'center',
  },
  timestamp: {
    ...Typography.caption,
    marginTop: Spacing.xs,
    opacity: 0.7,
  },
});

export default ChatMessage;

