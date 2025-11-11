/**
 * DataDeletionScreen
 * Screen for deleting user account and data
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { dataDeletionService } from '../../services/data/dataDeletionService';

const DataDeletionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [confirmationText, setConfirmationText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const requiredText = 'DELETE';

  const handleDelete = () => {
    if (confirmationText !== requiredText) {
      Alert.alert('Error', `Please type "${requiredText}" to confirm deletion`);
      return;
    }

    Alert.alert(
      'Confirm Deletion',
      'This action cannot be undone. All your data will be permanently deleted. Are you absolutely sure?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete Forever',
          style: 'destructive',
          onPress: async () => {
            setIsDeleting(true);
            try {
              await dataDeletionService.deleteAccount();
              Alert.alert(
                'Account Deleted',
                'Your account and all data have been permanently deleted.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to login/welcome screen
                      navigation.navigate('Welcome' as never);
                    },
                  },
                ],
              );
            } catch (error) {
              Alert.alert(
                'Error',
                error instanceof Error ? error.message : 'Failed to delete account',
              );
            } finally {
              setIsDeleting(false);
            }
          },
        },
      ],
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Delete Account</Text>

        <Card style={styles.warningCard}>
          <Text style={styles.warningTitle}>⚠️ Warning: This action is permanent</Text>
          <Text style={styles.warningText}>
            Deleting your account will permanently remove:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• All mood entries and trends</Text>
            <Text style={styles.listItem}>• All journal entries</Text>
            <Text style={styles.listItem}>• All chatbot conversations</Text>
            <Text style={styles.listItem}>• All exercise completions</Text>
            <Text style={styles.listItem}>• Your profile and account information</Text>
          </View>
          <Text style={styles.warningText}>
            This action cannot be undone. You will not be able to recover any of
            your data after deletion.
          </Text>
        </Card>

        <Card style={styles.card}>
          <Text style={styles.confirmationTitle}>Type "{requiredText}" to confirm</Text>
          <TextInput
            style={styles.confirmationInput}
            value={confirmationText}
            onChangeText={setConfirmationText}
            placeholder={requiredText}
            placeholderTextColor={Colors.grayMedium}
            autoCapitalize="characters"
          />
        </Card>

        <Button
          title="Delete Account Forever"
          onPress={handleDelete}
          loading={isDeleting}
          disabled={isDeleting || confirmationText !== requiredText}
          style={[styles.deleteButton, { backgroundColor: Colors.crisis }]}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    padding: Spacing.lg,
  },
  title: {
    ...Typography.h1,
    color: Colors.grayDark,
    marginBottom: Spacing.lg,
  },
  warningCard: {
    backgroundColor: Colors.crisis + '20',
    borderColor: Colors.crisis,
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  warningTitle: {
    ...Typography.subtitle,
    color: Colors.crisis,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  warningText: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    lineHeight: 20,
  },
  list: {
    marginLeft: Spacing.sm,
    marginVertical: Spacing.sm,
  },
  listItem: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  card: {
    marginBottom: Spacing.lg,
    padding: Spacing.md,
  },
  confirmationTitle: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  confirmationInput: {
    ...Typography.body,
    borderWidth: 1,
    borderColor: Colors.grayLight,
    borderRadius: 8,
    padding: Spacing.md,
    color: Colors.grayDark,
  },
  deleteButton: {
    marginTop: Spacing.md,
  },
});

export default DataDeletionScreen;

