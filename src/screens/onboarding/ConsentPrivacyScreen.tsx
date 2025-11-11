/**
 * ConsentPrivacyScreen
 * Screen for user consent and privacy policy acceptance
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { analyticsService } from '../../services/analytics/analyticsService';

const ConsentPrivacyScreen: React.FC = () => {
  const navigation = useNavigation();
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(false);

  const handleContinue = async () => {
    if (consentAccepted && privacyAccepted) {
      // Save analytics consent
      await analyticsService.setConsent(analyticsConsent);
      navigation.navigate('AccountCreation' as never);
    }
  };

  const openTerms = () => {
    Linking.openURL('https://havens.app/terms');
  };

  const openPrivacy = () => {
    Linking.openURL('https://havens.app/privacy');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Consent & Privacy</Text>
        <Text style={styles.subtitle}>
          Please review and accept our terms to continue
        </Text>

        <Card style={styles.consentCard}>
          <Text style={styles.consentTitle}>Data Collection Consent</Text>
          <Text style={styles.consentText}>
            By using Havens, you consent to the collection and processing of
            your mental health data for the purpose of providing personalized
            support and therapeutic interventions. All data is encrypted and
            stored securely.
          </Text>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setConsentAccepted(!consentAccepted)}
          >
            <Text style={styles.checkbox}>
              {consentAccepted ? '☑' : '☐'}
            </Text>
            <Text style={styles.checkboxLabel}>
              I consent to data collection and processing
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.consentCard}>
          <Text style={styles.consentTitle}>Privacy Policy</Text>
          <Text style={styles.consentText}>
            Your privacy is important to us. We comply with HIPAA, GDPR, and
            CCPA regulations. Your data is never shared without your explicit
            consent.
          </Text>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setPrivacyAccepted(!privacyAccepted)}
          >
            <Text style={styles.checkbox}>
              {privacyAccepted ? '☑' : '☐'}
            </Text>
            <Text style={styles.checkboxLabel}>
              I accept the{' '}
              <Text style={styles.link} onPress={openTerms}>
                Terms of Service
              </Text>{' '}
              and{' '}
              <Text style={styles.link} onPress={openPrivacy}>
                Privacy Policy
              </Text>
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.consentCard}>
          <Text style={styles.consentTitle}>Analytics & Feedback (Optional)</Text>
          <Text style={styles.consentText}>
            Help us improve Havens by sharing anonymous usage data and feedback.
            This data is anonymized and aggregated, and never includes personal
            information. You can change this setting anytime.
          </Text>
          <TouchableOpacity
            style={styles.checkboxRow}
            onPress={() => setAnalyticsConsent(!analyticsConsent)}
          >
            <Text style={styles.checkbox}>
              {analyticsConsent ? '☑' : '☐'}
            </Text>
            <Text style={styles.checkboxLabel}>
              I agree to share anonymous analytics data to help improve Havens
            </Text>
          </TouchableOpacity>
        </Card>

        <Card style={styles.disclaimerCard}>
          <Text style={styles.disclaimerTitle}>Important Disclaimer</Text>
          <Text style={styles.disclaimerText}>
            Havens is not a substitute for professional mental health care. If
            you are experiencing a mental health crisis, please contact emergency
            services immediately.
          </Text>
        </Card>
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!consentAccepted || !privacyAccepted}
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
    marginBottom: Spacing.xs,
  },
  subtitle: {
    ...Typography.body,
    color: Colors.grayMedium,
    marginBottom: Spacing.xl,
  },
  consentCard: {
    marginBottom: Spacing.md,
  },
  consentTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  consentText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 22,
    marginBottom: Spacing.md,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    fontSize: 20,
    marginRight: Spacing.sm,
  },
  checkboxLabel: {
    ...Typography.body,
    color: Colors.grayDark,
    flex: 1,
  },
  link: {
    color: Colors.primary,
    textDecorationLine: 'underline',
  },
  disclaimerCard: {
    backgroundColor: Colors.warning + '20',
    borderColor: Colors.warning,
    marginTop: Spacing.md,
  },
  disclaimerTitle: {
    ...Typography.subtitle,
    color: Colors.warning,
    marginBottom: Spacing.sm,
    fontWeight: '600',
  },
  disclaimerText: {
    ...Typography.body,
    color: Colors.grayDark,
    lineHeight: 22,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});

export default ConsentPrivacyScreen;

