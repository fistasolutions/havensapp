/**
 * ChatbotScreen
 * Main screen for AI chatbot conversations
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import ChatMessage, { ChatMessageProps } from '../../components/chatbot/ChatMessage';
import ChatInput from '../../components/chatbot/ChatInput';
import TypingIndicator from '../../components/chatbot/TypingIndicator';
import CrisisButton from '../../components/chatbot/CrisisButton';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';
import ConversationFlowSelectionScreen, {
  ConversationFlow,
} from './ConversationFlowSelectionScreen';
import { chatbotService, ChatbotMessage } from '../../services/chatbot/chatbotService';

const ChatbotScreen: React.FC = () => {
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessageProps[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCrisisResources, setShowCrisisResources] = useState(false);
  const [showFlowSelection, setShowFlowSelection] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    if (messages.length > 0) {
      flatListRef.current?.scrollToEnd({ animated: true });
    }
  }, [messages]);

  const handleSelectFlow = async (flow: ConversationFlow) => {
    setIsLoading(true);
    setError(null);

    try {
      const conversation = await chatbotService.createConversation(flow);
      setConversationId(conversation.id);
      setShowFlowSelection(false);

      // Add welcome message
      const welcomeMessage: ChatMessageProps = {
        role: 'assistant',
        content:
          "Hello! I'm here to support you. How are you feeling today? You can share anything that's on your mind.",
        timestamp: new Date().toISOString(),
      };
      setMessages([welcomeMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to start conversation');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (content: string) => {
    if (!conversationId) return;

    // Add user message
    const userMessage: ChatMessageProps = {
      role: 'user',
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      const response = await chatbotService.sendMessage(conversationId, content);

      // Add assistant response
      const assistantMessage: ChatMessageProps = {
        role: 'assistant',
        content: response.message.content,
        timestamp: response.message.timestamp,
      };
      setMessages((prev) => [...prev, assistantMessage]);

      // Handle crisis detection
      if (response.crisisDetected) {
        setShowCrisisResources(true);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setIsTyping(false);
    }
  };

  if (showFlowSelection) {
    return <ConversationFlowSelectionScreen onSelectFlow={handleSelectFlow} />;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.header}>
        <Text style={styles.headerTitle}>AI Coach</Text>
      </View>

      {showCrisisResources && (
        <View style={styles.crisisContainer}>
          <CrisisButton />
        </View>
      )}

      {error && (
        <View style={styles.errorContainer}>
          <ErrorMessage message={error} onRetry={() => setError(null)} />
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={({ item }) => <ChatMessage {...item} />}
        keyExtractor={(item, index) => `message-${index}`}
        contentContainerStyle={styles.messagesContainer}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Start a conversation...</Text>
          </View>
        }
      />

      {isTyping && <TypingIndicator />}

      <ChatInput onSend={handleSendMessage} disabled={isLoading || isTyping} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  header: {
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.grayLight,
    backgroundColor: Colors.white,
  },
  headerTitle: {
    ...Typography.h3,
  },
  crisisContainer: {
    backgroundColor: Colors.crisis + '20',
  },
  errorContainer: {
    padding: Spacing.sm,
  },
  messagesContainer: {
    padding: Spacing.md,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...Typography.body,
    color: Colors.grayMedium,
  },
});

export default ChatbotScreen;

