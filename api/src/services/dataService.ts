/**
 * Data Service
 * Business logic for data export and deletion
 */

import prisma from '../config/database';

export interface ExportedUserData {
  profile: any;
  moodEntries: any[];
  moodTrends: any[];
  journalEntries: any[];
  chatbotConversations: any[];
  exerciseCompletions: any[];
  feedback: any[];
  exportedAt: string;
}

/**
 * Export all user data
 */
export const exportUserData = async (userId: string): Promise<ExportedUserData> => {
  // Fetch all user data
  const [
    user,
    moodEntries,
    moodTrends,
    journalEntries,
    chatbotConversations,
    exerciseCompletions,
    feedback,
  ] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        role: true,
        firstName: true,
        lastName: true,
        age: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.moodEntry.findMany({
      where: { userId },
      orderBy: { timestamp: 'desc' },
    }),
    prisma.moodTrend.findMany({
      where: { userId },
      orderBy: { periodStart: 'desc' },
    }),
    prisma.journalEntry.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.chatbotConversation.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.exerciseCompletion.findMany({
      where: { userId },
      orderBy: { completedAt: 'desc' },
      include: {
        exercise: {
          select: {
            id: true,
            title: true,
            type: true,
          },
        },
      },
    }),
    prisma.userFeedback.findMany({
      where: { userId },
      orderBy: { submittedAt: 'desc' },
    }),
  ]);

  return {
    profile: user,
    moodEntries,
    moodTrends,
    journalEntries,
    chatbotConversations,
    exerciseCompletions,
    feedback,
    exportedAt: new Date().toISOString(),
  };
};

/**
 * Delete user account and all data
 */
export const deleteUserData = async (userId: string): Promise<void> => {
  // Use Prisma transactions to ensure all data is deleted atomically
  await prisma.$transaction(async (tx) => {
    // Delete all related data first (due to foreign key constraints)
    await tx.exerciseCompletion.deleteMany({ where: { userId } });
    await tx.userFeedback.deleteMany({ where: { userId } });
    await tx.chatbotConversation.deleteMany({ where: { userId } });
    await tx.journalEntry.deleteMany({ where: { userId } });
    await tx.moodTrend.deleteMany({ where: { userId } });
    await tx.moodEntry.deleteMany({ where: { userId } });
    await tx.providerClientRelationship.deleteMany({
      where: { OR: [{ providerId: userId }, { clientId: userId }] },
    });
    await tx.partnerPairing.deleteMany({
      where: { OR: [{ user1Id: userId }, { user2Id: userId }] },
    });
    await tx.familyGroupMember.deleteMany({ where: { userId } });
    await tx.familyGroup.deleteMany({ where: { createdBy: userId } });

    // Soft delete the user (set deletedAt timestamp)
    await tx.user.update({
      where: { id: userId },
      data: { deletedAt: new Date() },
    });
  });
};

