/**
 * Analytics Service
 * Handles privacy-compliant analytics collection with consent
 */

import { apiClient } from '../api/client';
import { getItem, setItem } from '../storage/localStorage';
import { isOnline } from '../storage/sync';

const ANALYTICS_CONSENT_KEY = '@havensapp:analyticsConsent';
const ANALYTICS_QUEUE_KEY = '@havensapp:analyticsQueue';

export interface AnalyticsEvent {
  eventType: string;
  properties?: Record<string, unknown>;
}

export interface FeedbackData {
  sessionType: 'Chatbot' | 'MoodLogging' | 'Journaling' | 'Exercise' | 'General';
  rating: number;
  feedbackText?: string;
  isAnonymous?: boolean;
}

class AnalyticsService {
  /**
   * Check if user has given analytics consent
   */
  async hasConsent(): Promise<boolean> {
    try {
      const consent = await getItem<boolean>(ANALYTICS_CONSENT_KEY);
      return consent === true;
    } catch (error) {
      console.error('Error checking analytics consent:', error);
      return false;
    }
  }

  /**
   * Set analytics consent
   */
  async setConsent(consent: boolean): Promise<void> {
    try {
      await setItem(ANALYTICS_CONSENT_KEY, consent);
    } catch (error) {
      console.error('Error setting analytics consent:', error);
    }
  }

  /**
   * Track an analytics event (only if consent is given)
   */
  async trackEvent(eventType: string, properties?: Record<string, unknown>): Promise<void> {
    try {
      const hasConsent = await this.hasConsent();
      if (!hasConsent) {
        return; // Silently skip if no consent
      }

      const online = await isOnline();
      const event: AnalyticsEvent = {
        eventType,
        properties,
      };

      if (online) {
        try {
          await apiClient.post('/analytics/events', event);
        } catch (error) {
          // If API call fails, queue for later
          await this.queueEvent(event);
        }
      } else {
        // Queue for when online
        await this.queueEvent(event);
      }
    } catch (error) {
      console.error('Error tracking analytics event:', error);
      // Don't throw - analytics should never break the app
    }
  }

  /**
   * Queue an event for later submission
   */
  private async queueEvent(event: AnalyticsEvent): Promise<void> {
    try {
      const queue = (await getItem<AnalyticsEvent[]>(ANALYTICS_QUEUE_KEY)) || [];
      queue.push(event);
      await setItem(ANALYTICS_QUEUE_KEY, queue);
    } catch (error) {
      console.error('Error queueing analytics event:', error);
    }
  }

  /**
   * Flush queued events (called when coming back online)
   */
  async flushQueue(): Promise<void> {
    try {
      const hasConsent = await this.hasConsent();
      if (!hasConsent) {
        // Clear queue if consent revoked
        await setItem(ANALYTICS_QUEUE_KEY, []);
        return;
      }

      const queue = (await getItem<AnalyticsEvent[]>(ANALYTICS_QUEUE_KEY)) || [];
      if (queue.length === 0) {
        return;
      }

      const online = await isOnline();
      if (!online) {
        return;
      }

      // Send all queued events
      for (const event of queue) {
        try {
          await apiClient.post('/analytics/events', event);
        } catch (error) {
          console.error('Error flushing analytics event:', error);
          // Keep failed events in queue for retry
        }
      }

      // Clear queue after successful submission
      await setItem(ANALYTICS_QUEUE_KEY, []);
    } catch (error) {
      console.error('Error flushing analytics queue:', error);
    }
  }

  /**
   * Submit user feedback
   */
  async submitFeedback(data: FeedbackData): Promise<{ id: string }> {
    try {
      const response = await apiClient.post<{ id: string }>('/feedback', data);
      return response.data;
    } catch (error) {
      console.error('Error submitting feedback:', error);
      throw error;
    }
  }
}

export const analyticsService = new AnalyticsService();

