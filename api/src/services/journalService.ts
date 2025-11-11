/**
 * Journal Service
 * Business logic for journaling
 */

import prisma from '../config/database';
import { analyzeSentiment, generateInsights } from './sentimentAnalysis';
import { getMoodEntries } from './moodService';

export interface CreateJournalEntryData {
  userId: string;
  promptId?: string;
  content: string;
  relatedMoodEntryId?: string;
}

export interface GetJournalEntriesParams {
  userId: string;
  isDraft?: boolean;
  limit?: number;
}

export interface GetJournalPromptsParams {
  userId: string;
  moodContext?: string;
}

/**
 * Create a journal entry
 */
export const createJournalEntry = async (data: CreateJournalEntryData) => {
  // Validate content length
  if (!data.content || data.content.trim().length < 10) {
    throw new Error('Journal entry must be at least 10 characters long');
  }

  if (data.content.length > 10000) {
    throw new Error('Journal entry cannot exceed 10,000 characters');
  }

  // Get prompt text if promptId provided
  let promptText: string | undefined;
  if (data.promptId) {
    const prompt = await prisma.journalPrompt.findUnique({
      where: { id: data.promptId },
    });
    promptText = prompt?.promptText;
  }

  // Analyze sentiment
  const sentiment = analyzeSentiment(data.content);

  // Generate insights
  const insights = generateInsights(data.content, sentiment);

  // Create journal entry
  const journalEntry = await prisma.journalEntry.create({
    data: {
      userId: data.userId,
      promptId: data.promptId,
      promptText,
      content: data.content,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment.label,
      insights,
      relatedMoodEntryId: data.relatedMoodEntryId,
      isDraft: false,
      isOffline: false,
    },
  });

  return journalEntry;
};

/**
 * Get journal entries for a user
 */
export const getJournalEntries = async (params: GetJournalEntriesParams) => {
  const where: any = {
    userId: params.userId,
  };

  if (params.isDraft !== undefined) {
    where.isDraft = params.isDraft;
  }

  const entries = await prisma.journalEntry.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: params.limit || 100,
    include: {
      prompt: {
        select: {
          id: true,
          theme: true,
          promptText: true,
          evidenceBasedTechnique: true,
        },
      },
    },
  });

  return entries;
};

/**
 * Get a specific journal entry
 */
export const getJournalEntry = async (entryId: string, userId: string) => {
  const entry = await prisma.journalEntry.findFirst({
    where: {
      id: entryId,
      userId,
    },
    include: {
      prompt: {
        select: {
          id: true,
          theme: true,
          promptText: true,
          evidenceBasedTechnique: true,
        },
      },
    },
  });

  if (!entry) {
    throw new Error('Journal entry not found');
  }

  return entry;
};

/**
 * Get personalized journal prompts based on mood context
 */
export const getJournalPrompts = async (params: GetJournalPromptsParams) => {
  const where: any = {
    isActive: true,
  };

  // If mood context provided, filter prompts that match
  if (params.moodContext) {
    where.OR = [
      { targetMoodContext: { has: params.moodContext } },
      { targetMoodContext: { isEmpty: true } }, // Include prompts with no specific mood context
    ];
  }

  // Get recent mood entries to better personalize
  let recentMoods: any[] = [];
  try {
    recentMoods = await getMoodEntries({
      userId: params.userId,
      limit: 7,
    });
  } catch (error) {
    // If mood fetch fails, continue without mood data
    console.error('Error fetching mood for prompt personalization:', error);
  }

  const prompts = await prisma.journalPrompt.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  // Prioritize prompts that match recent mood patterns
  if (recentMoods.length > 0 && params.moodContext) {
    const matchingPrompts = prompts.filter((p) =>
      p.targetMoodContext?.includes(params.moodContext!),
    );
    const otherPrompts = prompts.filter(
      (p) => !p.targetMoodContext?.includes(params.moodContext!),
    );
    return [...matchingPrompts, ...otherPrompts];
  }

  return prompts;
};

/**
 * Update a journal entry
 */
export const updateJournalEntry = async (
  entryId: string,
  userId: string,
  data: Partial<CreateJournalEntryData>,
) => {
  // Verify ownership
  const existingEntry = await prisma.journalEntry.findFirst({
    where: { id: entryId, userId },
  });

  if (!existingEntry) {
    throw new Error('Journal entry not found or unauthorized');
  }

  // If content is updated, re-analyze sentiment
  let updateData: any = { ...data };
  if (data.content) {
    const sentiment = analyzeSentiment(data.content);
    const insights = generateInsights(data.content, sentiment);

    updateData = {
      ...updateData,
      sentimentScore: sentiment.score,
      sentimentLabel: sentiment.label,
      insights,
    };
  }

  const updatedEntry = await prisma.journalEntry.update({
    where: { id: entryId },
    data: updateData,
  });

  return updatedEntry;
};

