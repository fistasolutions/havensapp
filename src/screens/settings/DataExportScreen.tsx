/**
 * DataExportScreen
 * Screen for exporting user data
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Platform, Share } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import { dataExportService } from '../../services/data/dataExportService';

const DataExportScreen: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData = await dataExportService.exportAllData();

      // Convert to JSON string
      const jsonString = JSON.stringify(exportData, null, 2);

      // Share or save the file
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Share.share({
          message: jsonString,
          title: 'Havens Data Export',
        });
      }

      Alert.alert('Success', 'Your data has been exported successfully');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to export data');
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Export Your Data</Text>

        <Card style={styles.card}>
          <Text style={styles.description}>
            You can download a complete copy of all your data stored in Havens.
            This includes:
          </Text>
          <View style={styles.list}>
            <Text style={styles.listItem}>• Mood entries and trends</Text>
            <Text style={styles.listItem}>• Journal entries</Text>
            <Text style={styles.listItem}>• Chatbot conversations</Text>
            <Text style={styles.listItem}>• Exercise completions</Text>
            <Text style={styles.listItem}>• Profile information</Text>
          </View>
        </Card>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Data Format</Text>
          <Text style={styles.infoText}>
            Your data will be exported as a JSON file that you can open and
            review. The export process may take a few moments depending on the
            amount of data you have.
          </Text>
        </Card>

        {isExporting ? (
          <LoadingIndicator />
        ) : (
          <Button
            title="Export All Data"
            onPress={handleExport}
            style={styles.exportButton}
          />
        )}
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
  card: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
  },
  description: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    lineHeight: 22,
  },
  list: {
    marginLeft: Spacing.sm,
  },
  listItem: {
    ...Typography.body,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  infoCard: {
    backgroundColor: Colors.info + '20',
    borderColor: Colors.info,
    marginBottom: Spacing.lg,
  },
  infoTitle: {
    ...Typography.subtitle,
    color: Colors.info,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  infoText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 20,
  },
  exportButton: {
    marginTop: Spacing.md,
  },
});

export default DataExportScreen;

