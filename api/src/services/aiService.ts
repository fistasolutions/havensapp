/**
 * AI Service
 * Integrates with OpenAI/Anthropic for chatbot responses
 * Uses evidence-based therapeutic techniques
 */

import { detectCrisis, getCrisisResources } from './crisisDetection';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIResponse {
  content: string;
  technique?: string;
}

/**
 * Generate AI response using evidence-based techniques
 * For MVP, uses rule-based responses. In production, integrate with OpenAI/Anthropic
 */
export const generateAIResponse = async (
  messages: AIMessage[],
  conversationFlow: string,
  personalizationContext?: Record<string, unknown>,
): Promise<AIResponse> => {
  // Check for crisis first
  const lastMessage = messages[messages.length - 1];
  if (lastMessage.role === 'user') {
    const crisisDetection = detectCrisis(lastMessage.content);
    if (crisisDetection.detected) {
      return {
        content:
          "I'm concerned about your safety. Please reach out for immediate help. You're not alone, and there are people who want to support you. I've provided crisis resources below.",
        technique: 'Crisis Intervention',
      };
    }
  }

  // For MVP: Rule-based responses based on conversation flow
  // In production, this would call OpenAI/Anthropic API
  const response = generateTherapeuticResponse(
    lastMessage.content,
    conversationFlow,
    messages.length,
  );

  return {
    content: response,
    technique: getTechniqueForFlow(conversationFlow),
  };
};

/**
 * Generate therapeutic response (MVP rule-based)
 * In production, replace with actual AI API call
 */
const generateTherapeuticResponse = (
  userMessage: string,
  flow: string,
  messageCount: number,
): string => {
  const lowerMessage = userMessage.toLowerCase();

  // Anxiety Relief flow
  if (flow === 'AnxietyRelief') {
    if (lowerMessage.includes('anxious') || lowerMessage.includes('worried')) {
      return "I understand you're feeling anxious. Let's try a breathing exercise together. Take a deep breath in for 4 counts, hold for 4, and exhale for 4. How does that feel?";
    }
    if (lowerMessage.includes('panic') || lowerMessage.includes('overwhelmed')) {
      return "It sounds like you're experiencing intense anxiety. Remember, these feelings are temporary. Can you identify one thing you can see, hear, or feel right now? This grounding technique can help.";
    }
  }

  // Stress Management flow
  if (flow === 'StressManagement') {
    if (lowerMessage.includes('stressed') || lowerMessage.includes('pressure')) {
      return "Stress is a normal response, but we can manage it together. What's one small thing you can do right now to take care of yourself? Even a few minutes of self-care can make a difference.";
    }
  }

  // Depression Support flow
  if (flow === 'DepressionSupport') {
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down')) {
      return "I hear that you're going through a difficult time. Depression can make everything feel harder. You're taking an important step by reaching out. What's one thing that brought you even a small moment of comfort recently?";
    }
  }

  // General empathetic responses
  if (messageCount === 1) {
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about what you're experiencing?";
  }

  return "I appreciate you continuing to share with me. How are you feeling about what we've discussed? Is there anything specific you'd like to explore further?";
};

/**
 * Get evidence-based technique for conversation flow
 */
const getTechniqueForFlow = (flow: string): string => {
  const techniques: Record<string, string> = {
    AnxietyRelief: 'CBT (Cognitive Behavioral Therapy)',
    StressManagement: 'ACT & Mindfulness',
    DepressionSupport: 'CBT & DBT',
    General: 'Multiple Evidence-Based Approaches',
    Custom: 'Personalized Approach',
  };

  return techniques[flow] || 'Evidence-Based Therapy';
};

/**
 * Build system prompt for AI (for future OpenAI/Anthropic integration)
 */
export const buildSystemPrompt = (
  conversationFlow: string,
  personalizationContext?: Record<string, unknown>,
): string => {
  const basePrompt = `You are a compassionate AI mental health coach providing evidence-based support. 
Use ${getTechniqueForFlow(conversationFlow)} techniques.
Be empathetic, non-judgmental, and supportive.
Always prioritize user safety and provide crisis resources if needed.`;

  if (personalizationContext) {
    return `${basePrompt}\n\nUser Context: ${JSON.stringify(personalizationContext)}`;
  }

  return basePrompt;
};

