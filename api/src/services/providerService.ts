/**
 * Provider Service
 * Business logic for provider functionality with HIPAA compliance
 */

import prisma from '../config/database';

export interface CreateProviderClientRelationshipData {
  providerId: string;
  clientId: string;
}

export interface GetProviderClientsParams {
  providerId: string;
  consentStatus?: 'Pending' | 'Granted' | 'Revoked';
}

/**
 * Create a provider-client relationship (requires client consent)
 */
export const createProviderClientRelationship = async (
  data: CreateProviderClientRelationshipData,
) => {
  // Verify provider exists and is verified
  const provider = await prisma.user.findUnique({
    where: { id: data.providerId },
  });

  if (!provider || provider.role !== 'Provider') {
    throw new Error('Provider not found or invalid');
  }

  if (provider.providerVerificationStatus !== 'Verified') {
    throw new Error('Provider must be verified before accessing client data');
  }

  // Verify client exists
  const client = await prisma.user.findUnique({
    where: { id: data.clientId },
  });

  if (!client) {
    throw new Error('Client not found');
  }

  // Check if relationship already exists
  const existing = await prisma.providerClientRelationship.findFirst({
    where: {
      providerId: data.providerId,
      clientId: data.clientId,
    },
  });

  if (existing) {
    throw new Error('Relationship already exists');
  }

  // Create relationship with pending consent
  const relationship = await prisma.providerClientRelationship.create({
    data: {
      providerId: data.providerId,
      clientId: data.clientId,
      consentStatus: 'Pending',
      accessLevel: 'ReadOnly', // Enforced read-only access
    },
  });

  return relationship;
};

/**
 * Grant consent for provider access (called by client)
 */
export const grantConsent = async (relationshipId: string, clientId: string) => {
  const relationship = await prisma.providerClientRelationship.findUnique({
    where: { id: relationshipId },
  });

  if (!relationship) {
    throw new Error('Relationship not found');
  }

  if (relationship.clientId !== clientId) {
    throw new Error('Unauthorized');
  }

  // Update consent status and log access
  const updated = await prisma.providerClientRelationship.update({
    where: { id: relationshipId },
    data: {
      consentStatus: 'Granted',
      consentGrantedAt: new Date(),
      hipaaAuditLog: {
        accessGranted: new Date().toISOString(),
        grantedBy: clientId,
      } as any,
    },
  });

  return updated;
};

/**
 * Revoke consent for provider access
 */
export const revokeConsent = async (relationshipId: string, clientId: string) => {
  const relationship = await prisma.providerClientRelationship.findUnique({
    where: { id: relationshipId },
  });

  if (!relationship) {
    throw new Error('Relationship not found');
  }

  if (relationship.clientId !== clientId) {
    throw new Error('Unauthorized');
  }

  const updated = await prisma.providerClientRelationship.update({
    where: { id: relationshipId },
    data: {
      consentStatus: 'Revoked',
      consentRevokedAt: new Date(),
    },
  });

  return updated;
};

/**
 * Get provider's clients
 */
export const getProviderClients = async (params: GetProviderClientsParams) => {
  const where: any = {
    providerId: params.providerId,
  };

  if (params.consentStatus) {
    where.consentStatus = params.consentStatus;
  }

  const relationships = await prisma.providerClientRelationship.findMany({
    where,
    include: {
      client: {
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return relationships;
};

/**
 * Log HIPAA audit entry for provider access
 */
export const logProviderAccess = async (
  relationshipId: string,
  action: string,
  details: Record<string, unknown>,
) => {
  const relationship = await prisma.providerClientRelationship.findUnique({
    where: { id: relationshipId },
  });

  if (!relationship) {
    throw new Error('Relationship not found');
  }

  const auditLog = (relationship.hipaaAuditLog as any) || { entries: [] };
  auditLog.entries.push({
    timestamp: new Date().toISOString(),
    action,
    details,
  });

  await prisma.providerClientRelationship.update({
    where: { id: relationshipId },
    data: {
      hipaaAuditLog: auditLog as any,
    },
  });
};

