/**
 * API Routes Index
 * Central export for all API routes
 */

import { Router } from 'express';
import authRoutes from './auth';
import chatbotRoutes from './chatbot';
import moodRoutes from './mood';
import journalRoutes from './journal';
import exerciseRoutes from './exercises';
import providerRoutes from './provider';
import partnerRoutes from './partner';
import familyRoutes from './family';
import analyticsRoutes from './analytics';
import feedbackRoutes from './feedback';
import userRoutes from './user';

const router = Router();

// Mount route modules
router.use('/auth', authRoutes);
router.use('/chatbot', chatbotRoutes);
router.use('/mood', moodRoutes);
router.use('/journal', journalRoutes);
router.use('/exercises', exerciseRoutes);
router.use('/provider', providerRoutes);
router.use('/partner', partnerRoutes);
router.use('/family', familyRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/feedback', feedbackRoutes);
router.use('/user', userRoutes);

export default router;

