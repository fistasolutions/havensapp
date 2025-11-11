/**
 * Sentiment Analysis Service
 * Analyzes sentiment of journal entries
 * For MVP: Rule-based analysis. In production, integrate with NLP service (e.g., AWS Comprehend, Google Cloud NLP)
 */

export interface SentimentResult {
  score: number; // -1 to 1 (negative to positive)
  label: 'Positive' | 'Neutral' | 'Negative';
}

/**
 * Analyze sentiment of text
 * Returns score from -1 (very negative) to 1 (very positive)
 */
export const analyzeSentiment = (text: string): SentimentResult => {
  const lowerText = text.toLowerCase();

  // Positive word patterns
  const positiveWords = [
    'grateful', 'thankful', 'happy', 'joy', 'joyful', 'excited', 'proud', 'confident',
    'hopeful', 'optimistic', 'peaceful', 'calm', 'content', 'satisfied', 'blessed',
    'loved', 'appreciate', 'wonderful', 'amazing', 'great', 'good', 'better', 'best',
    'improving', 'progress', 'success', 'achievement', 'accomplish', 'win', 'victory',
  ];

  // Negative word patterns
  const negativeWords = [
    'sad', 'depressed', 'anxious', 'worried', 'stressed', 'overwhelmed', 'frustrated',
    'angry', 'mad', 'upset', 'disappointed', 'hurt', 'pain', 'suffering', 'struggle',
    'difficult', 'hard', 'tough', 'challenging', 'failure', 'fail', 'lost', 'defeat',
    'hopeless', 'helpless', 'lonely', 'isolated', 'rejected', 'abandoned', 'guilty',
    'ashamed', 'embarrassed', 'afraid', 'scared', 'terrified', 'panic', 'dread',
  ];

  // Count positive and negative words
  let positiveCount = 0;
  let negativeCount = 0;

  positiveWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      positiveCount += matches.length;
    }
  });

  negativeWords.forEach((word) => {
    const regex = new RegExp(`\\b${word}\\w*\\b`, 'gi');
    const matches = lowerText.match(regex);
    if (matches) {
      negativeCount += matches.length;
    }
  });

  // Calculate sentiment score
  const totalWords = text.split(/\s+/).length;
  const positiveRatio = positiveCount / Math.max(totalWords, 1);
  const negativeRatio = negativeCount / Math.max(totalWords, 1);

  // Score calculation: positive words increase score, negative words decrease it
  let score = (positiveRatio - negativeRatio) * 2; // Scale to -2 to 2 range
  score = Math.max(-1, Math.min(1, score)); // Clamp to -1 to 1

  // Determine label
  let label: 'Positive' | 'Neutral' | 'Negative';
  if (score > 0.2) {
    label = 'Positive';
  } else if (score < -0.2) {
    label = 'Negative';
  } else {
    label = 'Neutral';
  }

  return { score, label };
};

/**
 * Generate insights based on sentiment and content
 * For MVP: Rule-based insights. In production, use AI to generate personalized insights
 */
export const generateInsights = (text: string, sentiment: SentimentResult): string[] => {
  const insights: string[] = [];

  // Positive insights
  if (sentiment.label === 'Positive') {
    if (text.toLowerCase().includes('grateful') || text.toLowerCase().includes('thankful')) {
      insights.push('You show gratitude regularly, which is linked to improved well-being.');
    }
    if (text.toLowerCase().includes('progress') || text.toLowerCase().includes('improve')) {
      insights.push('You recognize your progress, which helps maintain motivation.');
    }
    if (text.toLowerCase().includes('learn') || text.toLowerCase().includes('grow')) {
      insights.push('You focus on growth and learning, which supports resilience.');
    }
  }

  // Neutral/Reflection insights
  if (sentiment.label === 'Neutral') {
    insights.push('You are taking time to reflect, which is valuable for self-awareness.');
    if (text.toLowerCase().includes('think') || text.toLowerCase().includes('consider')) {
      insights.push('Your thoughtful reflection shows emotional intelligence.');
    }
  }

  // Supportive insights for negative sentiment
  if (sentiment.label === 'Negative') {
    insights.push('It\'s okay to feel difficult emotions. Acknowledging them is the first step.');
    if (text.toLowerCase().includes('stress') || text.toLowerCase().includes('overwhelm')) {
      insights.push('Consider breaking down stressors into smaller, manageable steps.');
    }
    if (text.toLowerCase().includes('alone') || text.toLowerCase().includes('lonely')) {
      insights.push('Remember that you are not alone. Reach out to supportive people in your life.');
    }
    if (text.toLowerCase().includes('can\'t') || text.toLowerCase().includes('cannot')) {
      insights.push('Try reframing "I can\'t" to "I haven\'t yet" or "I\'m learning to".');
    }
  }

  // General insights
  if (text.length > 200) {
    insights.push('You took time for deep reflection, which supports emotional processing.');
  }

  return insights.length > 0 ? insights : ['Thank you for taking time to reflect on your experiences.'];
};

