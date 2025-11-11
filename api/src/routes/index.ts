/**
 * API Routes Index
 * Central export for all API routes
 */

import { Router } from 'express';
import authRoutes from './auth';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);

// Add more route modules here as they are created
// router.use('/mood', moodRoutes);
// router.use('/journal', journalRoutes);
// router.use('/chatbot', chatbotRoutes);
// router.use('/exercises', exerciseRoutes);

export default router;

