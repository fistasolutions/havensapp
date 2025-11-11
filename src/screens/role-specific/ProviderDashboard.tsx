/**
 * ProviderDashboard
 * Dashboard screen for mental health providers
 */

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import Card from '../../components/common/Card';
import LoadingIndicator from '../../components/common/LoadingIndicator';
import ErrorMessage from '../../components/common/ErrorMessage';

const ProviderDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalClients: 0,
    activeClients: 0,
    pendingConsents: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // In production, this would fetch from API
      // const response = await apiClient.get('/provider/dashboard');
      // setStats(response.data);
      setStats({
        totalClients: 0,
        activeClients: 0,
        pendingConsents: 0,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <LoadingIndicator />;
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Provider Dashboard</Text>
        <Text style={styles.subtitle}>
          HIPAA-compliant access to client data
        </Text>

        {error && <ErrorMessage message={error} />}

        <View style={styles.statsRow}>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalClients}</Text>
            <Text style={styles.statLabel}>Total Clients</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeClients}</Text>
            <Text style={styles.statLabel}>Active Clients</Text>
          </Card>
          <Card style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pendingConsents}</Text>
            <Text style={styles.statLabel}>Pending Consents</Text>
          </Card>
        </View>

        <Card style={styles.infoCard}>
          <Text style={styles.infoTitle}>Provider Access</Text>
          <Text style={styles.infoText}>
            You have read-only access to client data with their explicit
            consent. All access is logged for HIPAA compliance.
          </Text>
        </Card>
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.xl,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  statCard: {
    flex: 1,
    marginHorizontal: Spacing.xs,
    alignItems: 'center',
    padding: Spacing.md,
  },
  statValue: {
    ...Typography.h1,
    color: Colors.primary,
    marginBottom: Spacing.xs,
  },
  statLabel: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textAlign: 'center',
  },
  infoCard: {
    marginTop: Spacing.md,
  },
  infoTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  infoText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 22,
  },
});

export default ProviderDashboard;

