/**
 * Crisis Detection Service
 * Detects crisis language and provides appropriate resources
 */

// Crisis keywords and phrases
const CRISIS_KEYWORDS = [
  'suicide',
  'kill myself',
  'end my life',
  'want to die',
  'hurt myself',
  'self harm',
  'cutting',
  'overdose',
  'no reason to live',
  'better off dead',
  'give up',
  'hopeless',
];

// High-risk phrases
const HIGH_RISK_PHRASES = [
  'planning to',
  'going to',
  'will kill',
  'will hurt',
  'have a plan',
  'have means',
];

/**
 * Detect crisis language in message
 */
export const detectCrisis = (message: string): {
  detected: boolean;
  severity: 'low' | 'medium' | 'high';
  keywords: string[];
} => {
  const lowerMessage = message.toLowerCase();
  const foundKeywords: string[] = [];

  // Check for crisis keywords
  for (const keyword of CRISIS_KEYWORDS) {
    if (lowerMessage.includes(keyword)) {
      foundKeywords.push(keyword);
    }
  }

  // Check for high-risk phrases combined with crisis keywords
  let hasHighRiskPhrase = false;
  for (const phrase of HIGH_RISK_PHRASES) {
    if (lowerMessage.includes(phrase)) {
      hasHighRiskPhrase = true;
      break;
    }
  }

  if (foundKeywords.length === 0) {
    return {
      detected: false,
      severity: 'low',
      keywords: [],
    };
  }

  // Determine severity
  let severity: 'low' | 'medium' | 'high' = 'medium';
  if (hasHighRiskPhrase) {
    severity = 'high';
  } else if (foundKeywords.length >= 2) {
    severity = 'high';
  } else {
    severity = 'medium';
  }

  return {
    detected: true,
    severity,
    keywords: foundKeywords,
  };
};

/**
 * Get crisis resources
 */
export const getCrisisResources = (): Array<{
  name: string;
  phone?: string;
  text?: string;
  url?: string;
}> => {
  return [
    {
      name: '988 Suicide & Crisis Lifeline',
      phone: '988',
      text: 'Text or call 988',
      url: 'https://988lifeline.org',
    },
    {
      name: 'Crisis Text Line',
      phone: '741741',
      text: 'Text HOME to 741741',
      url: 'https://www.crisistextline.org',
    },
    {
      name: 'National Suicide Prevention Lifeline',
      phone: '1-800-273-8255',
      text: 'Call 1-800-273-8255',
    },
    {
      name: 'Emergency Services',
      phone: '911',
      text: 'Call 911 for immediate emergency',
    },
  ];
};

