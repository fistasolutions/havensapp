/**
 * Journal Controller
 * Request handlers for journal endpoints
 */

import { Request, Response } from 'express';
import {
  createJournalEntry,
  getJournalEntries,
  getJournalEntry,
  getJournalPrompts,
  updateJournalEntry,
} from '../services/journalService';
import { asyncHandler, ApplicationError } from '../middleware/errorHandler';

/**
 * POST /journal/entries
 * Create a new journal entry
 */
export const createJournalEntryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { promptId, content, relatedMoodEntryId } = req.body;

    if (!content || typeof content !== 'string' || content.trim().length < 10) {
      throw new ApplicationError('Journal entry must be at least 10 characters long', 400);
    }

    if (content.length > 10000) {
      throw new ApplicationError('Journal entry cannot exceed 10,000 characters', 400);
    }

    const journalEntry = await createJournalEntry({
      userId,
      promptId,
      content: content.trim(),
      relatedMoodEntryId,
    });

    res.status(201).json({
      id: journalEntry.id,
      userId: journalEntry.userId,
      promptId: journalEntry.promptId,
      promptText: journalEntry.promptText,
      content: journalEntry.content,
      sentimentScore: journalEntry.sentimentScore,
      sentimentLabel: journalEntry.sentimentLabel,
      insights: journalEntry.insights,
      isDraft: journalEntry.isDraft,
      createdAt: journalEntry.createdAt,
      updatedAt: journalEntry.updatedAt,
    });
  },
);

/**
 * GET /journal/entries
 * Get journal entries for the current user
 */
export const getJournalEntriesHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { isDraft, limit } = req.query;

    const entries = await getJournalEntries({
      userId,
      isDraft: isDraft === 'true' ? true : isDraft === 'false' ? false : undefined,
      limit: limit ? parseInt(limit as string, 10) : undefined,
    });

    res.json({
      entries: entries.map((entry) => ({
        id: entry.id,
        userId: entry.userId,
        promptId: entry.promptId,
        promptText: entry.promptText,
        content: entry.content,
        sentimentScore: entry.sentimentScore,
        sentimentLabel: entry.sentimentLabel,
        insights: entry.insights,
        relatedMoodEntryId: entry.relatedMoodEntryId,
        isDraft: entry.isDraft,
        createdAt: entry.createdAt,
        updatedAt: entry.updatedAt,
      })),
    });
  },
);

/**
 * GET /journal/entries/:id
 * Get a specific journal entry
 */
export const getJournalEntryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { id } = req.params;

    const entry = await getJournalEntry(id, userId);

    res.json({
      id: entry.id,
      userId: entry.userId,
      promptId: entry.promptId,
      promptText: entry.promptText,
      content: entry.content,
      sentimentScore: entry.sentimentScore,
      sentimentLabel: entry.sentimentLabel,
      insights: entry.insights,
      relatedMoodEntryId: entry.relatedMoodEntryId,
      isDraft: entry.isDraft,
      createdAt: entry.createdAt,
      updatedAt: entry.updatedAt,
    });
  },
);

/**
 * GET /journal/prompts
 * Get journal prompts (personalized by mood if provided)
 */
export const getJournalPromptsHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { moodContext } = req.query;

    const prompts = await getJournalPrompts({
      userId,
      moodContext: moodContext as string | undefined,
    });

    res.json({
      prompts: prompts.map((prompt) => ({
        id: prompt.id,
        theme: prompt.theme,
        promptText: prompt.promptText,
        evidenceBasedTechnique: prompt.evidenceBasedTechnique,
        targetMoodContext: prompt.targetMoodContext,
      })),
    });
  },
);

/**
 * PUT /journal/entries/:id
 * Update a journal entry
 */
export const updateJournalEntryHandler = asyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApplicationError('Unauthorized', 401);
    }

    const { id } = req.params;
    const { content, promptId, relatedMoodEntryId } = req.body;

    if (content && (content.trim().length < 10 || content.length > 10000)) {
      throw new ApplicationError(
        'Journal entry must be between 10 and 10,000 characters',
        400,
      );
    }

    const updatedEntry = await updateJournalEntry(id, userId, {
      content,
      promptId,
      relatedMoodEntryId,
    });

    res.json({
      id: updatedEntry.id,
      userId: updatedEntry.userId,
      promptId: updatedEntry.promptId,
      promptText: updatedEntry.promptText,
      content: updatedEntry.content,
      sentimentScore: updatedEntry.sentimentScore,
      sentimentLabel: updatedEntry.sentimentLabel,
      insights: updatedEntry.insights,
      isDraft: updatedEntry.isDraft,
      createdAt: updatedEntry.createdAt,
      updatedAt: updatedEntry.updatedAt,
    });
  },
);

