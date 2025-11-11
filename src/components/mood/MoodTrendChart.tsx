/**
 * Mood Trend Chart Component
 * Displays mood trends over time with visualizations
 */

import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { Colors, Spacing, Typography } from '../../constants';
import { MoodTrend } from '../../services/mood/moodService';

export interface MoodTrendChartProps {
  trends: MoodTrend[];
  period: 'Daily' | 'Weekly' | 'Monthly';
}

const { width } = Dimensions.get('window');
const CHART_WIDTH = width - Spacing.xl * 2;
const CHART_HEIGHT = 200;

const MoodTrendChart: React.FC<MoodTrendChartProps> = ({ trends, period }) => {
  if (trends.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No mood data yet</Text>
        <Text style={styles.emptySubtext}>Start logging your mood to see trends</Text>
      </View>
    );
  }

  // Calculate chart metrics
  const maxMood = Math.max(...trends.map((t) => t.averageMood), 10);
  const minMood = Math.min(...trends.map((t) => t.averageMood), 1);

  // Calculate bar heights
  const getBarHeight = (mood: number): number => {
    const range = maxMood - minMood || 1;
    const normalized = (mood - minMood) / range;
    return normalized * (CHART_HEIGHT - 40);
  };

  // Get trend direction indicator
  const getTrendIndicator = (direction: MoodTrend['trendDirection']) => {
    switch (direction) {
      case 'Improving':
        return { symbol: '↑', color: Colors.success };
      case 'Declining':
        return { symbol: '↓', color: Colors.crisis };
      default:
        return { symbol: '→', color: Colors.grayMedium };
    }
  };

  return (
    <View style={styles.container} testID="mood-trend-chart">
      <View style={styles.chartContainer}>
        {/* Y-axis labels */}
        <View style={styles.yAxis}>
          <Text style={styles.axisLabel}>{maxMood.toFixed(1)}</Text>
          <Text style={styles.axisLabel}>{((maxMood + minMood) / 2).toFixed(1)}</Text>
          <Text style={styles.axisLabel}>{minMood.toFixed(1)}</Text>
        </View>

        {/* Chart bars */}
        <View style={styles.chart}>
          {trends.map((trend, index) => {
            const barHeight = getBarHeight(trend.averageMood);
            const trendIndicator = getTrendIndicator(trend.trendDirection);

            return (
              <View key={index} style={styles.barContainer}>
                <View style={styles.barWrapper}>
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: trendIndicator.color,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.barLabel} numberOfLines={1}>
                  {trend.periodStart.split('T')[0].slice(5)}
                </Text>
                <Text style={styles.trendIndicator}>{trendIndicator.symbol}</Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Legend */}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.success }]} />
          <Text style={styles.legendText}>Improving</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.grayMedium }]} />
          <Text style={styles.legendText}>Stable</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendColor, { backgroundColor: Colors.crisis }]} />
          <Text style={styles.legendText}>Declining</Text>
        </View>
      </View>

      {/* Trend summary */}
      <View style={styles.summary}>
        {trends.map((trend, index) => (
          <View key={index} style={styles.summaryItem}>
            <Text style={styles.summaryPeriod}>
              {trend.periodStart} - {trend.periodEnd}
            </Text>
            <Text style={styles.summaryMood}>Avg: {trend.averageMood.toFixed(1)}/10</Text>
            <Text style={styles.summaryEmotions}>
              {trend.dominantEmotions.join(', ')}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: Spacing.md,
  },
  emptyContainer: {
    height: CHART_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  emptyText: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
  },
  emptySubtext: {
    ...Typography.body,
    color: Colors.grayMedium,
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    height: CHART_HEIGHT,
    marginBottom: Spacing.md,
  },
  yAxis: {
    width: 40,
    justifyContent: 'space-between',
    paddingRight: Spacing.xs,
  },
  axisLabel: {
    ...Typography.caption,
    color: Colors.grayMedium,
    textAlign: 'right',
  },
  chart: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    paddingBottom: 20,
  },
  barContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginHorizontal: 2,
  },
  barWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    minHeight: 20,
  },
  bar: {
    width: '80%',
    minHeight: 4,
    borderRadius: 4,
  },
  barLabel: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginTop: Spacing.xs,
    fontSize: 10,
  },
  trendIndicator: {
    ...Typography.caption,
    marginTop: 2,
    fontSize: 12,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    gap: Spacing.md,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
  },
  legendText: {
    ...Typography.caption,
    color: Colors.grayDark,
  },
  summary: {
    marginTop: Spacing.md,
  },
  summaryItem: {
    padding: Spacing.md,
    backgroundColor: Colors.grayLight,
    borderRadius: 8,
    marginBottom: Spacing.sm,
  },
  summaryPeriod: {
    ...Typography.caption,
    color: Colors.grayMedium,
    marginBottom: Spacing.xs,
  },
  summaryMood: {
    ...Typography.body,
    color: Colors.grayDark,
    fontWeight: '600',
    marginBottom: Spacing.xs,
  },
  summaryEmotions: {
    ...Typography.caption,
    color: Colors.grayDark,
  },
});

export default MoodTrendChart;

