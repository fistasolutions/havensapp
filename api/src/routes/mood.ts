/**
 * Mood Routes
 * API routes for mood tracking functionality
 */

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createMoodEntryHandler,
  getMoodEntriesHandler,
  getMoodTrendsHandler,
  exportMoodDataHandler,
} from '../controllers/moodController';

const router = Router();

// All mood routes require authentication
router.use(authenticateToken);

// POST /mood/entries - Create new mood entry
router.post('/entries', createMoodEntryHandler);

// GET /mood/entries - Get user mood entries
router.get('/entries', getMoodEntriesHandler);

// GET /mood/trends - Get mood trends
router.get('/trends', getMoodTrendsHandler);

// GET /mood/export - Export mood data
router.get('/export', exportMoodDataHandler);

export default router;

