/**
 * ConversationFlowSelectionScreen
 * Screen for selecting a conversation flow before starting chat
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

export type ConversationFlow =
  | 'AnxietyRelief'
  | 'StressManagement'
  | 'DepressionSupport'
  | 'General'
  | 'Custom';

export interface ConversationFlowOption {
  id: ConversationFlow;
  title: string;
  description: string;
  technique: string;
}

const CONVERSATION_FLOWS: ConversationFlowOption[] = [
  {
    id: 'AnxietyRelief',
    title: 'Anxiety Relief',
    description: 'CBT-based techniques to manage anxiety and worry',
    technique: 'CBT',
  },
  {
    id: 'StressManagement',
    title: 'Stress Management',
    description: 'Mindfulness and ACT approaches to reduce stress',
    technique: 'ACT & Mindfulness',
  },
  {
    id: 'DepressionSupport',
    title: 'Depression Support',
    description: 'Compassionate support and behavioral activation',
    technique: 'CBT & DBT',
  },
  {
    id: 'General',
    title: 'General Support',
    description: 'Open conversation for any emotional support needs',
    technique: 'Multiple Approaches',
  },
];

export interface ConversationFlowSelectionScreenProps {
  onSelectFlow: (flow: ConversationFlow) => void;
}

const ConversationFlowSelectionScreen: React.FC<
  ConversationFlowSelectionScreenProps
> = ({ onSelectFlow }) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.title}>Chat with AI Coach</Text>
        <Text style={styles.subtitle}>
          Select a conversation flow to get started
        </Text>
      </View>

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          ⚠️ This app is not a substitute for professional mental health care.
          If you are in crisis, please contact emergency services or a crisis
          hotline.
        </Text>
      </View>

      <View style={styles.flowsContainer}>
        {CONVERSATION_FLOWS.map((flow) => (
          <TouchableOpacity
            key={flow.id}
            onPress={() => onSelectFlow(flow.id)}
            activeOpacity={0.7}
          >
            <Card style={styles.flowCard}>
              <Text style={styles.flowTitle}>{flow.title}</Text>
              <Text style={styles.flowDescription}>{flow.description}</Text>
              <Text style={styles.flowTechnique}>{flow.technique}</Text>
            </Card>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.grayLight,
  },
  content: {
    padding: Spacing.md,
  },
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    ...Typography.h2,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
  },
  disclaimer: {
    backgroundColor: Colors.warning + '20',
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: Colors.warning,
  },
  disclaimerText: {
    ...Typography.bodySmall,
    color: Colors.grayDark,
  },
  flowsContainer: {
    gap: Spacing.md,
  },
  flowCard: {
    marginBottom: Spacing.sm,
  },
  flowTitle: {
    ...Typography.h4,
    marginBottom: Spacing.xs,
  },
  flowDescription: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.xs,
  },
  flowTechnique: {
    ...Typography.caption,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default ConversationFlowSelectionScreen;

