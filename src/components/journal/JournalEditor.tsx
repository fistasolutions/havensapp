/**
 * Journal Editor Component
 * Text editor for journal entries with auto-save and character count
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';

export interface JournalEditorProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  promptText?: string;
  minLength?: number;
  maxLength?: number;
  autoFocus?: boolean;
}

const JournalEditor: React.FC<JournalEditorProps> = ({
  value,
  onChangeText,
  placeholder = 'Start writing...',
  promptText,
  minLength = 10,
  maxLength = 10000,
  autoFocus = false,
}) => {
  const [characterCount, setCharacterCount] = useState(value.length);

  useEffect(() => {
    setCharacterCount(value.length);
  }, [value]);

  const isBelowMinimum = characterCount > 0 && characterCount < minLength;
  const isAboveMaximum = characterCount > maxLength;

  return (
    <View style={styles.container}>
      {promptText && (
        <View style={styles.promptContainer}>
          <Text style={styles.promptLabel}>Prompt:</Text>
          <Text style={styles.promptText}>{promptText}</Text>
        </View>
      )}
      <TextInput
        style={[
          styles.editor,
          isBelowMinimum && styles.editorWarning,
          isAboveMaximum && styles.editorError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.grayMedium}
        multiline
        textAlignVertical="top"
        autoFocus={autoFocus}
        maxLength={maxLength}
      />
      <View style={styles.footer}>
        <Text
          style={[
            styles.characterCount,
            isBelowMinimum && styles.characterCountWarning,
            isAboveMaximum && styles.characterCountError,
          ]}
        >
          {characterCount} / {maxLength}
        </Text>
        {isBelowMinimum && (
          <Text style={styles.warningText}>
            Please write at least {minLength} characters
          </Text>
        )}
        {isAboveMaximum && (
          <Text style={styles.errorText}>Maximum length exceeded</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  promptContainer: {
    backgroundColor: Colors.grayLight,
    padding: Spacing.md,
    borderRadius: 8,
    marginBottom: Spacing.md,
  },
  promptLabel: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  promptText: {
    ...Typography.body,
    color: Colors.grayDark,
    fontStyle: 'italic',
  },
  editor: {
    ...Typography.body,
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 8,
    padding: Spacing.md,
    backgroundColor: Colors.white,
    color: Colors.grayDark,
    minHeight: 200,
    textAlignVertical: 'top',
  },
  editorWarning: {
    borderColor: Colors.warning,
  },
  editorError: {
    borderColor: Colors.crisis,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  characterCount: {
    ...Typography.caption,
    color: Colors.grayMedium,
  },
  characterCountWarning: {
    color: Colors.warning,
  },
  characterCountError: {
    color: Colors.crisis,
  },
  warningText: {
    ...Typography.caption,
    color: Colors.warning,
  },
  errorText: {
    ...Typography.caption,
    color: Colors.crisis,
  },
});

export default JournalEditor;

