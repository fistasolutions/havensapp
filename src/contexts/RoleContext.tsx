/**
 * Role Context
 * Provides role-based state and functionality throughout the app
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getItem, setItem } from '../services/storage/localStorage';

export type UserRole = 'Individual' | 'Provider' | 'Partner' | 'FamilyFriends' | 'Kid';

interface RoleContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  isLoading: boolean;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

const ROLE_STORAGE_KEY = '@havensapp:userRole';

interface RoleProviderProps {
  children: ReactNode;
}

export const RoleProvider: React.FC<RoleProviderProps> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadRole();
  }, []);

  const loadRole = async () => {
    try {
      const storedRole = await getItem<UserRole>(ROLE_STORAGE_KEY);
      if (storedRole) {
        setRoleState(storedRole);
      }
    } catch (error) {
      console.error('Error loading role:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const setRole = async (newRole: UserRole) => {
    try {
      await setItem(ROLE_STORAGE_KEY, newRole);
      setRoleState(newRole);
    } catch (error) {
      console.error('Error saving role:', error);
    }
  };

  return (
    <RoleContext.Provider value={{ role, setRole, isLoading }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

