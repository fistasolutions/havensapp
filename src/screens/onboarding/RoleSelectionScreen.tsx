/**
 * RoleSelectionScreen
 * Screen for selecting user role during onboarding
 */

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Colors, Spacing, Typography } from '../../constants';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import { useRole, UserRole } from '../../contexts/RoleContext';

const roles: Array<{
  role: UserRole;
  title: string;
  description: string;
  icon: string;
}> = [
  {
    role: 'Individual',
    title: 'Individual',
    description: 'Personal mental health support and tracking',
    icon: '👤',
  },
  {
    role: 'Provider',
    title: 'Provider',
    description: 'Mental health professional access to client data',
    icon: '👨‍⚕️',
  },
  {
    role: 'Partner',
    title: 'Partner',
    description: 'Shared wellness tracking with your partner',
    icon: '💑',
  },
  {
    role: 'FamilyFriends',
    title: 'Family & Friends',
    description: 'Group wellness and support network',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    role: 'Kid',
    title: 'Kid',
    description: 'Age-appropriate mental health support (with parent)',
    icon: '🧒',
  },
];

const RoleSelectionScreen: React.FC = () => {
  const navigation = useNavigation();
  const { setRole } = useRole();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleContinue = () => {
    if (selectedRole) {
      setRole(selectedRole);
      // Navigate based on role
      if (selectedRole === 'Kid') {
        navigation.navigate('ParentSetup' as never);
      } else if (selectedRole === 'Provider') {
        navigation.navigate('ProviderVerification' as never);
      } else {
        navigation.navigate('ConsentPrivacy' as never);
      }
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>Select Your Role</Text>
        <Text style={styles.subtitle}>
          Choose how you'll use Havens to get personalized features
        </Text>

        {roles.map((roleOption) => (
          <TouchableOpacity
            key={roleOption.role}
            onPress={() => handleRoleSelect(roleOption.role)}
            activeOpacity={0.7}
          >
            <Card
              style={[
                styles.roleCard,
                selectedRole === roleOption.role && styles.roleCardSelected,
              ]}
            >
              <Text style={styles.roleIcon}>{roleOption.icon}</Text>
              <View style={styles.roleContent}>
                <Text style={styles.roleTitle}>{roleOption.title}</Text>
                <Text style={styles.roleDescription}>
                  {roleOption.description}
                </Text>
              </View>
              {selectedRole === roleOption.role && (
                <Text style={styles.checkmark}>✓</Text>
              )}
            </Card>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.footer}>
        <Button
          title="Continue"
          onPress={handleContinue}
          disabled={!selectedRole}
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
  roleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderWidth: 2,
    borderColor: Colors.grayLight,
  },
  roleCardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.grayLight,
  },
  roleIcon: {
    fontSize: 32,
    marginRight: Spacing.md,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    ...Typography.subtitle,
    color: Colors.grayDark,
    marginBottom: Spacing.xs,
    fontWeight: '600',
  },
  roleDescription: {
    ...Typography.caption,
    color: Colors.grayMedium,
  },
  checkmark: {
    ...Typography.h2,
    color: Colors.primary,
    marginLeft: Spacing.sm,
  },
  footer: {
    padding: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
});

export default RoleSelectionScreen;

