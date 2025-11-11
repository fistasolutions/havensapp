/**
 * Prisma Seed File
 * Seeds initial journal prompts for the application
 */

import prisma from '../src/config/database';

async function main() {
  console.log('🌱 Seeding database...');

  // Seed journal prompts
  console.log('📝 Seeding journal prompts...');

  const prompts = [
    // Gratitude Prompts
    {
      theme: 'Gratitude',
      promptText: 'What are three things you are grateful for today?',
      evidenceBasedTechnique: 'PositivePsychology',
      targetMoodContext: ['happy', 'grateful', 'content', 'calm'],
      isActive: true,
    },
    {
      theme: 'Gratitude',
      promptText: 'Who in your life are you most grateful for, and why?',
      evidenceBasedTechnique: 'PositivePsychology',
      targetMoodContext: ['happy', 'grateful', 'content'],
      isActive: true,
    },
    {
      theme: 'Gratitude',
      promptText: 'What small moment today brought you joy or peace?',
      evidenceBasedTechnique: 'PositivePsychology',
      targetMoodContext: ['happy', 'grateful', 'calm', 'peaceful'],
      isActive: true,
    },

    // Stress Management Prompts
    {
      theme: 'Stress',
      promptText: 'What is causing you stress right now, and what can you control about it?',
      evidenceBasedTechnique: 'CBT',
      targetMoodContext: ['stressed', 'anxious', 'overwhelmed', 'worried'],
      isActive: true,
    },
    {
      theme: 'Stress',
      promptText: 'What coping strategies have helped you manage stress in the past?',
      evidenceBasedTechnique: 'CBT',
      targetMoodContext: ['stressed', 'anxious', 'overwhelmed'],
      isActive: true,
    },
    {
      theme: 'Stress',
      promptText: 'How can you break down your current stressor into smaller, manageable steps?',
      evidenceBasedTechnique: 'CBT',
      targetMoodContext: ['stressed', 'overwhelmed', 'worried'],
      isActive: true,
    },

    // Goals & Reflection Prompts
    {
      theme: 'Goals',
      promptText: 'What is one goal you want to work toward this week?',
      evidenceBasedTechnique: 'ACT',
      targetMoodContext: ['hopeful', 'energetic', 'confident'],
      isActive: true,
    },
    {
      theme: 'Goals',
      promptText: 'What values are most important to you, and how are you living them?',
      evidenceBasedTechnique: 'ACT',
      targetMoodContext: ['hopeful', 'confident', 'content'],
      isActive: true,
    },
    {
      theme: 'Reflection',
      promptText: 'What did you learn about yourself today?',
      evidenceBasedTechnique: 'Mindfulness',
      targetMoodContext: ['calm', 'neutral', 'tired'],
      isActive: true,
    },
    {
      theme: 'Reflection',
      promptText: 'How have you grown or changed in the past month?',
      evidenceBasedTechnique: 'Mindfulness',
      targetMoodContext: ['calm', 'content', 'peaceful'],
      isActive: true,
    },

    // Relationships Prompts
    {
      theme: 'Relationships',
      promptText: 'What relationships in your life bring you the most support and joy?',
      evidenceBasedTechnique: 'PositivePsychology',
      targetMoodContext: ['happy', 'grateful', 'content'],
      isActive: true,
    },
    {
      theme: 'Relationships',
      promptText: 'How can you show appreciation to someone important in your life?',
      evidenceBasedTechnique: 'PositivePsychology',
      targetMoodContext: ['happy', 'grateful', 'content'],
      isActive: true,
    },

    // General/Emotional Processing Prompts
    {
      theme: 'General',
      promptText: 'What emotions are you experiencing right now, and what might they be telling you?',
      evidenceBasedTechnique: 'Mindfulness',
      targetMoodContext: ['anxious', 'sad', 'angry', 'lonely', 'frustrated'],
      isActive: true,
    },
    {
      theme: 'General',
      promptText: 'What would you tell a friend who was feeling the way you do right now?',
      evidenceBasedTechnique: 'CBT',
      targetMoodContext: ['sad', 'anxious', 'lonely', 'disappointed'],
      isActive: true,
    },
    {
      theme: 'General',
      promptText: 'What self-care activities help you feel more balanced?',
      evidenceBasedTechnique: 'DBT',
      targetMoodContext: ['stressed', 'overwhelmed', 'tired'],
      isActive: true,
    },
  ];

  for (const prompt of prompts) {
    await prisma.journalPrompt.upsert({
      where: {
        promptText: prompt.promptText,
      },
      update: {},
      create: prompt,
    });
  }

  console.log(`✅ Seeded ${prompts.length} journal prompts`);

  // Seed self-help exercises
  console.log('💪 Seeding self-help exercises...');

  const exercises = [
    // Breathing Exercises
    {
      type: 'Breathing',
      title: 'Box Breathing',
      description: 'A simple breathing technique that helps reduce stress and anxiety by focusing on controlled, rhythmic breathing.',
      instructions: [
        'Breathe in slowly through your nose for 4 counts',
        'Hold your breath for 4 counts',
        'Breathe out slowly through your mouth for 4 counts',
        'Hold your breath for 4 counts',
        'Repeat for 4-8 cycles',
      ],
      duration: 5,
      evidenceBasedTechnique: 'Mindfulness',
      isActive: true,
    },
    {
      type: 'Breathing',
      title: '4-7-8 Breathing',
      description: 'A calming breathing exercise that promotes relaxation and can help with sleep.',
      instructions: [
        'Breathe in through your nose for 4 counts',
        'Hold your breath for 7 counts',
        'Breathe out through your mouth for 8 counts',
        'Repeat 4-8 times',
      ],
      duration: 5,
      evidenceBasedTechnique: 'Mindfulness',
      isActive: true,
    },
    {
      type: 'Breathing',
      title: 'Deep Belly Breathing',
      description: 'A foundational breathing exercise that helps activate the body\'s relaxation response.',
      instructions: [
        'Place one hand on your chest and one on your belly',
        'Breathe in slowly through your nose, feeling your belly rise',
        'Breathe out slowly through your mouth, feeling your belly fall',
        'Focus on making the belly hand move more than the chest hand',
        'Continue for 5-10 minutes',
      ],
      duration: 10,
      evidenceBasedTechnique: 'Mindfulness',
      isActive: true,
    },

    // Mindfulness Exercises
    {
      type: 'Mindfulness',
      title: 'Body Scan Meditation',
      description: 'A mindfulness practice that helps you connect with your body and release tension.',
      instructions: [
        'Find a comfortable position, lying down or sitting',
        'Close your eyes and take a few deep breaths',
        'Slowly scan your body from head to toe',
        'Notice any areas of tension or discomfort',
        'Breathe into those areas and release the tension',
        'Continue for 10-20 minutes',
      ],
      duration: 15,
      evidenceBasedTechnique: 'Mindfulness',
      isActive: true,
    },
    {
      type: 'Mindfulness',
      title: '5-4-3-2-1 Grounding',
      description: 'A quick mindfulness exercise to help ground yourself in the present moment.',
      instructions: [
        'Name 5 things you can see around you',
        'Name 4 things you can touch',
        'Name 3 things you can hear',
        'Name 2 things you can smell',
        'Name 1 thing you can taste',
      ],
      duration: 3,
      evidenceBasedTechnique: 'Mindfulness',
      isActive: true,
    },

    // Affirmation Exercises
    {
      type: 'Affirmation',
      title: 'Daily Affirmations',
      description: 'Positive affirmations to boost self-esteem and promote positive thinking.',
      instructions: [
        'Choose 3-5 affirmations that resonate with you',
        'Repeat each affirmation 3 times',
        'Say them with conviction and feeling',
        'Examples: "I am capable and strong", "I deserve happiness", "I am worthy of love"',
      ],
      duration: 5,
      evidenceBasedTechnique: 'PositivePsychology',
      isActive: true,
    },

    // Distress Tolerance Exercises
    {
      type: 'DistressTolerance',
      title: 'TIPP Technique',
      description: 'A DBT technique to quickly change your body chemistry and reduce intense emotions.',
      instructions: [
        'Temperature: Splash cold water on your face or hold an ice pack',
        'Intense Exercise: Do jumping jacks or run in place for 1-2 minutes',
        'Paced Breathing: Slow your breathing to 5-6 breaths per minute',
        'Paired Muscle Relaxation: Tense and release muscle groups',
      ],
      duration: 5,
      evidenceBasedTechnique: 'DBT',
      isActive: true,
    },
    {
      type: 'DistressTolerance',
      title: 'ACCEPTS',
      description: 'A DBT skill to distract from distressing emotions using healthy activities.',
      instructions: [
        'Activities: Engage in hobbies or tasks',
        'Contributing: Help someone else',
        'Comparisons: Compare to a time you felt worse',
        'Emotions: Watch a funny movie or listen to uplifting music',
        'Pushing Away: Temporarily set aside the problem',
        'Thoughts: Count, read, or solve puzzles',
        'Sensations: Use strong sensations (hot/cold, taste, touch)',
      ],
      duration: 10,
      evidenceBasedTechnique: 'DBT',
      isActive: true,
    },

    // Progressive Relaxation
    {
      type: 'ProgressiveRelaxation',
      title: 'Progressive Muscle Relaxation',
      description: 'A technique that involves tensing and relaxing muscle groups to reduce physical tension.',
      instructions: [
        'Start with your feet and work your way up',
        'Tense each muscle group for 5 seconds',
        'Release and notice the feeling of relaxation',
        'Move to the next muscle group',
        'Continue through all major muscle groups',
      ],
      duration: 15,
      evidenceBasedTechnique: 'CBT',
      isActive: true,
    },
  ];

  // Use createMany with skipDuplicates to handle existing exercises
  await prisma.selfHelpExercise.createMany({
    data: exercises,
    skipDuplicates: true,
  });

  console.log(`✅ Seeded ${exercises.length} self-help exercises`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

