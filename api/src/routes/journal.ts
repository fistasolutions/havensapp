/**
 * Journal Routes
 * API routes for journaling functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createJournalEntryHandler,
  getJournalEntriesHandler,
  getJournalEntryHandler,
  getJournalPromptsHandler,
  updateJournalEntryHandler,
} from '../controllers/journalController';

const router = Router();

// All journal routes require authentication
router.use(authenticateToken);

// POST /journal/entries - Create new journal entry
router.post('/entries', createJournalEntryHandler);

// GET /journal/entries - Get user journal entries
router.get('/entries', getJournalEntriesHandler);

// GET /journal/entries/:id - Get specific journal entry
router.get('/entries/:id', getJournalEntryHandler);

// PUT /journal/entries/:id - Update journal entry
router.put('/entries/:id', updateJournalEntryHandler);

// GET /journal/prompts - Get journal prompts
router.get('/prompts', getJournalPromptsHandler);

export default router;

