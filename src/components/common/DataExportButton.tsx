/**
 * Data Export Button Component
 * Button for exporting user data
 */

import React from 'react';
import { Alert } from 'react-native';
import Button from './Button';
import { moodService } from '../../services/mood/moodService';

export interface DataExportButtonProps {
  onExport?: (data: unknown) => void;
}

const DataExportButton: React.FC<DataExportButtonProps> = ({ onExport }) => {
  const handleExport = async () => {
    try {
      const data = await moodService.exportMoodData();
      
      if (onExport) {
        onExport(data);
      } else {
        Alert.alert(
          'Export Complete',
          `Exported ${data.entries.length} mood entries and ${data.trends.length} trends.`,
        );
        // In a real app, this would trigger file download/sharing
      }
    } catch (error) {
      Alert.alert(
        'Export Failed',
        error instanceof Error ? error.message : 'Failed to export data',
      );
    }
  };

  return (
    <Button
      title="Export Data"
      onPress={handleExport}
      variant="outline"
      size="medium"
    />
  );
};

export default DataExportButton;

