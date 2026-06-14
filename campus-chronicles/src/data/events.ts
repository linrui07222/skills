import type { GameEvent } from '@/engine/types';

export type { GameEvent } from '@/engine/types';

export const events: GameEvent[] = [
  // ── Milestone Events ────────────────────────────────────────
  {
    id: 'evt-freshman-orientation',
    title: 'Freshman Orientation',
    description: 'You step through the school gates for the first time. The campus buzzes with energy — lockers slamming, laughter echoing, upperclassmen rushing past. A friendly face waves at you from across the hall. Your high school journey begins now.',
    icon: 'School',
    triggerCondition: { year: [1], week: [1] },
    choices: [
      {
        text: 'Wave back and introduce yourself enthusiastically',
        consequences: { stats: { charisma: 2 }, happiness: 1, flags: ['friendly-first-impression'] },
      },
      {
        text: 'Nod politely and head to your first class early',
        consequences: { stats: { diligence: 2 }, energy: -1 },
      },
      {
        text: 'Explore the campus on your own to get the lay of the land',
        consequences: { stats: { creativity: 1, intelligence: 1 }, flags: ['independent-streak'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-first-club-fair',
    title: 'Club Fair',
    description: 'The gymnasium is packed with booths, banners, and upperclassmen calling out to recruits. Every club wants new members. You can feel the excitement — and the pressure — in the air.',
    icon: 'Tent',
    triggerCondition: { year: [1], week: [2, 3] },
    choices: [
      {
        text: 'Sign up for a club that matches your strongest skill',
        consequences: { happiness: 2, flags: ['joined-first-club'] },
      },
      {
        text: 'Join the club your new friend is signing up for',
        consequences: { stats: { charisma: 1 }, happiness: 1, flags: ['joined-first-club', 'social-joiner'] },
      },
      {
        text: 'Take flyers from several clubs and decide later',
        consequences: { stats: { intelligence: 1 }, flags: ['club-indecisive'] },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-first-exam',
    title: 'First Exam',
    description: 'The first real test of the year is tomorrow. Your notebook is full of notes, but are they enough? The pressure is on — this sets the tone for the whole semester.',
    icon: 'FileText',
    triggerCondition: { year: [1], week: [5, 6] },
    choices: [
      {
        text: 'Pull an all-nighter studying',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -3, stress: 2 },
      },
      {
        text: 'Study steadily and get a good night\'s sleep',
        consequences: { stats: { intelligence: 1, diligence: 1 }, energy: -1, stress: 1 },
      },
      {
        text: 'Wing it — you either know it or you don\'t',
        consequences: { stats: { charisma: 1 }, stress: -1, flags: ['overconfident'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-making-friends',
    title: 'Lunch Table Decision',
    description: 'The cafeteria is a minefield of social dynamics. You spot an empty seat at the popular table, a group of quiet kids reading, and a solo student eating alone with a sketchbook.',
    icon: 'Users',
    triggerCondition: { year: [1], week: [3, 4], randomChance: 0.7 },
    choices: [
      {
        text: 'Sit with the popular crowd',
        consequences: { stats: { charisma: 2 }, relationships: { 'npc-lily-zhang': 1 }, stress: 1 },
      },
      {
        text: 'Join the quiet readers',
        consequences: { stats: { intelligence: 1 }, relationships: { 'npc-alex-chen': 2, 'npc-priya-sharma': 1 } },
      },
      {
        text: 'Sit with the solo artist',
        consequences: { stats: { creativity: 1 }, relationships: { 'npc-sam-nakamura': 3 }, happiness: 1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-sports-tryouts',
    title: 'Sports Tryouts',
    description: 'The basketball team is holding tryouts this week. Coach Reyes watches every move with an eagle eye. This is your chance to prove yourself — or find out you\'re better suited for something else.',
    icon: 'Trophy',
    triggerCondition: { year: [1, 2], week: [4, 5, 6], minStat: { athleticism: 3 } },
    choices: [
      {
        text: 'Give it everything you\'ve got — leave it all on the court',
        consequences: { stats: { athleticism: 2 }, energy: -3, stress: 1, flags: ['tried-out-basketball'] },
      },
      {
        text: 'Play smart and show good teamwork',
        consequences: { stats: { athleticism: 1, charisma: 1 }, energy: -2, flags: ['tried-out-basketball'] },
      },
      {
        text: 'Decide sports aren\'t your thing and watch from the bleachers',
        consequences: { stats: { intelligence: 1 }, relationships: { 'npc-jordan-williams': 1 } },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-school-dance',
    title: 'School Dance',
    description: 'The winter formal is this weekend. The hallways are buzzing with who\'s going with whom. You\'ve been thinking about asking someone — or maybe just going with friends.',
    icon: 'Heart',
    triggerCondition: { year: [1, 2, 3], week: [12, 13], randomChance: 0.8 },
    choices: [
      {
        text: 'Ask your crush to go with you',
        consequences: { stats: { charisma: 2 }, happiness: 2, stress: 2, flags: ['asked-crush-dance'] },
      },
      {
        text: 'Go with your friend group and have a blast',
        consequences: { stats: { charisma: 1 }, happiness: 2, stress: -1 },
      },
      {
        text: 'Skip it and have a quiet night at home',
        consequences: { stats: { diligence: 1 }, energy: 2, happiness: -1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-drama-production',
    title: 'Drama Club Production',
    description: 'The Drama Club is putting on a play and needs help. Whether you\'re on stage or behind the scenes, this could be your moment to shine — or crash spectacularly.',
    icon: 'Drama',
    triggerCondition: { year: [1, 2, 3], week: [15, 16], flags: ['joined-first-club'], randomChance: 0.6 },
    choices: [
      {
        text: 'Audition for the lead role',
        consequences: { stats: { charisma: 2, creativity: 1 }, stress: 2, energy: -2, flags: ['drama-lead'] },
      },
      {
        text: 'Help with set design and backstage',
        consequences: { stats: { creativity: 2, diligence: 1 }, energy: -1, flags: ['drama-backstage'] },
      },
      {
        text: 'Offer to write the program and handle publicity',
        consequences: { stats: { intelligence: 1, charisma: 1 }, relationships: { 'npc-marcus-webb': 1 } },
      },
    ],
    category: 'extracurricular',
    npcId: 'npc-marcus-webb',
  },
  {
    id: 'evt-science-fair',
    title: 'Science Fair',
    description: 'The annual science fair is coming up. Dr. Patel is practically vibrating with excitement. A strong project could earn you recognition, a scholarship recommendation, or at least a passing grade.',
    icon: 'Microscope',
    triggerCondition: { year: [1, 2, 3], week: [20, 21], minStat: { intelligence: 4 }, randomChance: 0.7 },
    choices: [
      {
        text: 'Go ambitious — build a working model or experiment',
        consequences: { stats: { intelligence: 3 }, energy: -3, stress: 2, flags: ['science-fair-ambitious'] },
      },
      {
        text: 'Partner with a classmate for a solid joint project',
        consequences: { stats: { intelligence: 1, charisma: 1 }, relationships: { 'npc-priya-sharma': 2 }, energy: -2 },
      },
      {
        text: 'Do a simple but well-presented project',
        consequences: { stats: { diligence: 1, intelligence: 1 }, energy: -1 },
      },
    ],
    category: 'academic',
    npcId: 'npc-dr-patel',
  },
  {
    id: 'evt-classmate-conflict',
    title: 'Hallway Confrontation',
    description: 'Someone spreads a rumor about you, and you find out it came from someone you thought was a friend. They\'re standing right in front of you, looking defensive. Other students are watching.',
    icon: 'Swords',
    triggerCondition: { year: [1, 2, 3], week: [8, 9, 10, 18, 19], randomChance: 0.5 },
    choices: [
      {
        text: 'Confront them directly and demand the truth',
        consequences: { stats: { charisma: 1 }, stress: 2, relationships: {}, flags: ['confrontational'] },
      },
      {
        text: 'Stay calm and talk it out privately',
        consequences: { stats: { charisma: 2, diligence: 1 }, stress: 1, happiness: 1, flags: ['diplomatic'] },
      },
      {
        text: 'Walk away — it\'s not worth the drama',
        consequences: { stats: { diligence: 1 }, stress: -1, flags: ['avoidant'] },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-teacher-meeting',
    title: 'Called to the Office',
    description: 'Your teacher asks to speak with you after class. Your stomach drops — is it about your grades? Your behavior? Or could it actually be something good?',
    icon: 'DoorOpen',
    triggerCondition: { year: [1, 2, 3], week: [7, 14, 22], randomChance: 0.5 },
    choices: [
      {
        text: 'Be honest about your struggles and ask for help',
        consequences: { stats: { diligence: 2 }, relationships: {}, stress: -1, flags: ['sought-help'] },
      },
      {
        text: 'Promise to do better and figure it out yourself',
        consequences: { stats: { diligence: 1 }, stress: 1, flags: ['self-reliant'] },
      },
      {
        text: 'Deflect with charm and change the subject',
        consequences: { stats: { charisma: 1 }, stress: 1, flags: ['evasive'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-prom',
    title: 'Prom Night',
    description: 'It\'s the event everyone has been talking about all year. The gym is transformed, the music is playing, and the night feels full of possibility. How will you make it memorable?',
    icon: 'Sparkles',
    triggerCondition: { year: [3], week: [35, 36] },
    choices: [
      {
        text: 'Ask your special someone to be your date',
        consequences: { stats: { charisma: 2 }, happiness: 3, stress: 1, flags: ['prom-date'] },
      },
      {
        text: 'Go with your whole squad and own the dance floor',
        consequences: { stats: { charisma: 1, athleticism: 1 }, happiness: 2, stress: -1 },
      },
      {
        text: 'Skip prom and have a meaningful last night with close friends',
        consequences: { stats: { creativity: 1 }, happiness: 2, flags: ['anti-prom'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-graduation-decisions',
    title: 'Graduation Crossroads',
    description: 'Senior year is ending. College applications, career choices, and goodbyes loom ahead. Everyone seems to have a plan — except you. The future feels both exciting and terrifying.',
    icon: 'GraduationCap',
    triggerCondition: { year: [3], week: [38, 39] },
    choices: [
      {
        text: 'Apply to a top university and aim high',
        consequences: { stats: { intelligence: 1, diligence: 2 }, stress: 3, flags: ['university-path'] },
      },
      {
        text: 'Pursue your passion, even if it\'s unconventional',
        consequences: { stats: { creativity: 2 }, happiness: 2, stress: 1, flags: ['passion-path'] },
      },
      {
        text: 'Take a gap year to figure things out',
        consequences: { stats: { charisma: 1, creativity: 1 }, happiness: 1, flags: ['gap-year'] },
      },
    ],
    category: 'milestone',
  },

  // ── Academic Events ─────────────────────────────────────────
  {
    id: 'evt-group-project',
    title: 'Group Project Nightmare',
    description: 'You\'re assigned a group project worth 30% of your grade. One teammate never shows up, one does the bare minimum, and the deadline is looming. How do you handle it?',
    icon: 'FolderOpen',
    triggerCondition: { year: [1, 2, 3], week: [10, 11, 24, 25], randomChance: 0.6 },
    choices: [
      {
        text: 'Take charge and carry the project yourself',
        consequences: { stats: { diligence: 2, intelligence: 1 }, energy: -3, stress: 2 },
      },
      {
        text: 'Rally the team with a pep talk and clear assignments',
        consequences: { stats: { charisma: 2 }, energy: -2, happiness: 1 },
      },
      {
        text: 'Report the slackers to the teacher',
        consequences: { stats: { diligence: 1 }, stress: 1, flags: ['reported-classmates'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-cheating-dilemma',
    title: 'The Answer Key',
    description: 'You accidentally find the answer key to tomorrow\'s test on the teacher\'s desk. Nobody is watching. One glance could save your grade — or destroy your integrity.',
    icon: 'Eye',
    triggerCondition: { year: [1, 2, 3], week: [6, 13, 20, 27], randomChance: 0.3 },
    choices: [
      {
        text: 'Look away and tell the teacher about the mistake',
        consequences: { stats: { diligence: 3 }, happiness: 1, flags: ['honest-student'] },
      },
      {
        text: 'Glance at a few answers — just to check your work',
        consequences: { stats: { intelligence: 1 }, stress: 2, flags: ['bent-rules'] },
      },
      {
        text: 'Share the find with your struggling friend',
        consequences: { relationships: {}, stats: { charisma: 1 }, stress: 2, flags: ['shared-answers'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-tutoring-offer',
    title: 'Tutoring Request',
    description: 'A classmate who\'s been struggling asks you for help with a subject you\'re good at. They look desperate, but you\'re already behind on your own work.',
    icon: 'BookMarked',
    triggerCondition: { year: [1, 2, 3], week: [8, 16, 28], minStat: { intelligence: 5 }, randomChance: 0.5 },
    choices: [
      {
        text: 'Make time to help — you can catch up later',
        consequences: { stats: { charisma: 2, diligence: 1 }, energy: -2, happiness: 1 },
      },
      {
        text: 'Suggest studying together so you both benefit',
        consequences: { stats: { intelligence: 1, charisma: 1 }, energy: -1 },
      },
      {
        text: 'Apologize and say you can\'t right now',
        consequences: { stats: { diligence: 1 }, stress: -1 },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-competition-invite',
    title: 'Academic Competition',
    description: 'Your teacher nominates you for a regional academic competition. It\'s a huge honor but requires weeks of extra preparation. The school is counting on you.',
    icon: 'Award',
    triggerCondition: { year: [2, 3], minStat: { intelligence: 7 }, randomChance: 0.4 },
    choices: [
      {
        text: 'Accept and train hard — this could change everything',
        consequences: { stats: { intelligence: 3 }, energy: -3, stress: 2, flags: ['competition-accepted'] },
      },
      {
        text: 'Accept but keep a balanced schedule',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -2, stress: 1 },
      },
      {
        text: 'Decline — your mental health comes first',
        consequences: { stats: { diligence: 1 }, happiness: 1, flags: ['declined-competition'] },
      },
    ],
    category: 'academic',
  },
  {
    id: 'evt-failing-grade',
    title: 'Failing Grade',
    description: 'You get back a test with a failing grade. The red marks feel like a punch to the gut. Your parents are going to freak. What now?',
    icon: 'XCircle',
    triggerCondition: { year: [1, 2, 3], maxStat: { intelligence: 4 }, randomChance: 0.4 },
    choices: [
      {
        text: 'Swallow your pride and ask the teacher for extra credit',
        consequences: { stats: { diligence: 2 }, stress: 1, flags: ['sought-help'] },
      },
      {
        text: 'Form a study group with classmates',
        consequences: { stats: { charisma: 1, intelligence: 1 }, energy: -1 },
      },
      {
        text: 'Hide it and try to do better next time',
        consequences: { stress: 3, happiness: -2, flags: ['hiding-grades'] },
      },
    ],
    category: 'academic',
  },

  // ── Social Events ───────────────────────────────────────────
  {
    id: 'evt-new-student',
    title: 'New Student',
    description: 'A new student transfers in mid-semester. They look lost and alone in the hallway, clutching a map of the school. You remember how that felt.',
    icon: 'UserPlus',
    triggerCondition: { year: [1, 2], week: [10, 11, 18, 19], randomChance: 0.5 },
    choices: [
      {
        text: 'Walk right up and offer to show them around',
        consequences: { stats: { charisma: 2 }, happiness: 1, relationships: { 'npc-emma-ohlsson': 2 } },
      },
      {
        text: 'Smile and wave, but let them come to you',
        consequences: { stats: { charisma: 1 }, relationships: { 'npc-emma-ohlsson': 1 } },
      },
      {
        text: 'You\'ve got your own stuff to worry about',
        consequences: { stats: { diligence: 1 }, stress: -1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-party-invite',
    title: 'Party Invitation',
    description: 'The biggest party of the year is this Saturday. Everyone who\'s anyone will be there. But you have a major assignment due Monday.',
    icon: 'PartyPopper',
    triggerCondition: { year: [1, 2, 3], week: [9, 17, 25], randomChance: 0.6 },
    choices: [
      {
        text: 'Go to the party — you\'ll find time to finish the assignment',
        consequences: { stats: { charisma: 2 }, happiness: 2, energy: -2, stress: 2, flags: ['partier'] },
      },
      {
        text: 'Stay home and crush the assignment',
        consequences: { stats: { diligence: 2, intelligence: 1 }, happiness: -1, stress: -1 },
      },
      {
        text: 'Go for an hour, then come home to study',
        consequences: { stats: { charisma: 1, diligence: 1 }, energy: -2, stress: 1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-betrayal',
    title: 'Friend in Need',
    description: 'Your best friend confides something serious — they\'re thinking about dropping out. They make you promise not to tell anyone. But you\'re worried about them.',
    icon: 'ShieldAlert',
    triggerCondition: { year: [2, 3], minRelationship: { 'npc-diego-morales': 5 }, randomChance: 0.3 },
    choices: [
      {
        text: 'Keep the promise but try to talk them out of it yourself',
        consequences: { stats: { charisma: 2 }, stress: 2, relationships: { 'npc-diego-morales': 2 } },
      },
      {
        text: 'Break the promise and tell a trusted adult',
        consequences: { stats: { diligence: 2 }, stress: 1, relationships: { 'npc-diego-morales': -3 }, flags: ['broke-trust'] },
      },
      {
        text: 'Support them no matter what they decide',
        consequences: { stats: { charisma: 1 }, happiness: -1, relationships: { 'npc-diego-morales': 1 }, flags: ['enabler'] },
      },
    ],
    category: 'social',
    npcId: 'npc-diego-morales',
  },
  {
    id: 'evt-crush-revelation',
    title: 'Butterflies',
    description: 'You realize you have a crush on someone in your class. Every time they look your way, your heart races. The school dance is coming up — this could be your chance.',
    icon: 'HeartPulse',
    triggerCondition: { year: [1, 2, 3], week: [11, 23], randomChance: 0.5 },
    choices: [
      {
        text: 'Write them a heartfelt note',
        consequences: { stats: { creativity: 1, charisma: 1 }, stress: 2, happiness: 1, flags: ['confessed-feelings'] },
      },
      {
        text: 'Try to get to know them better as a friend first',
        consequences: { stats: { charisma: 1, diligence: 1 }, happiness: 1 },
      },
      {
        text: 'Bury the feelings and focus on yourself',
        consequences: { stats: { diligence: 1 }, stress: 1, happiness: -1 },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-social-media-drama',
    title: 'Going Viral',
    description: 'An embarrassing photo of you from PE class gets posted online. Within an hour, half the school has seen it. Your phone won\'t stop buzzing.',
    icon: 'Smartphone',
    triggerCondition: { year: [1, 2, 3], week: [12, 20, 30], randomChance: 0.3 },
    choices: [
      {
        text: 'Laugh it off and post a self-deprecating follow-up',
        consequences: { stats: { charisma: 2 }, happiness: 1, stress: -1, flags: ['good-sport'] },
      },
      {
        text: 'Ask the person who posted it to take it down',
        consequences: { stats: { charisma: 1, diligence: 1 }, stress: 1 },
      },
      {
        text: 'Delete all your social media and lay low',
        consequences: { stress: 2, happiness: -2, flags: ['social-media-break'] },
      },
    ],
    category: 'social',
  },
  {
    id: 'evt-study-date',
    title: 'Study Session',
    description: 'Your classmate suggests studying together at the local café. It sounds productive, but the last time you "studied" together, you mostly talked for three hours.',
    icon: 'Coffee',
    triggerCondition: { year: [1, 2, 3], week: [7, 15, 23, 31], randomChance: 0.5 },
    choices: [
      {
        text: 'Go and actually study this time — set ground rules',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -1 },
      },
      {
        text: 'Go and enjoy the company — social time matters too',
        consequences: { stats: { charisma: 1 }, happiness: 2, energy: -1 },
      },
      {
        text: 'Suggest a rain check and study alone',
        consequences: { stats: { intelligence: 1, diligence: 1 }, happiness: -1 },
      },
    ],
    category: 'social',
  },

  // ── Extracurricular Events ──────────────────────────────────
  {
    id: 'evt-student-council-election',
    title: 'Student Council Election',
    description: 'Elections are coming up. Lily Zhang is running again, but some students want fresh leadership. You\'re urged to run — but do you really want the responsibility?',
    icon: 'Vote',
    triggerCondition: { year: [2, 3], week: [5, 6], minStat: { charisma: 5 }, randomChance: 0.5 },
    choices: [
      {
        text: 'Run for president — it\'s time for new ideas',
        consequences: { stats: { charisma: 3 }, energy: -3, stress: 3, flags: ['ran-for-council'] },
      },
      {
        text: 'Run for a smaller position — vice president or secretary',
        consequences: { stats: { charisma: 1, diligence: 1 }, energy: -2, stress: 1, flags: ['council-minor-role'] },
      },
      {
        text: 'Support Lily\'s campaign instead',
        consequences: { relationships: { 'npc-lily-zhang': 3 }, stats: { charisma: 1 }, happiness: 1 },
      },
    ],
    category: 'extracurricular',
    npcId: 'npc-lily-zhang',
  },
  {
    id: 'evt-talent-show',
    title: 'Talent Show',
    description: 'The annual talent show sign-up sheet is on the bulletin board. You\'ve been practicing something in secret. Is this the moment to share it with the school?',
    icon: 'Mic',
    triggerCondition: { year: [1, 2, 3], week: [18, 19], minStat: { creativity: 4 }, randomChance: 0.6 },
    choices: [
      {
        text: 'Sign up and perform your heart out',
        consequences: { stats: { creativity: 2, charisma: 2 }, energy: -2, stress: 2, happiness: 2, flags: ['talent-show-performer'] },
      },
      {
        text: 'Help backstage with tech and logistics',
        consequences: { stats: { intelligence: 1, diligence: 1 }, energy: -1, flags: ['talent-show-crew'] },
      },
      {
        text: 'Just watch and cheer for your friends',
        consequences: { stats: { charisma: 1 }, happiness: 1 },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-fundraiser',
    title: 'Charity Fundraiser',
    description: 'The school is raising money for a local shelter. Your club needs to come up with a creative way to contribute. The team that raises the most gets recognized at assembly.',
    icon: 'HandHeart',
    triggerCondition: { year: [1, 2, 3], week: [14, 26], flags: ['joined-first-club'], randomChance: 0.5 },
    choices: [
      {
        text: 'Organize a creative event — bake sale, car wash, or talent night',
        consequences: { stats: { charisma: 2, creativity: 1 }, energy: -2, happiness: 2 },
      },
      {
        text: 'Go door-to-door with donation forms',
        consequences: { stats: { diligence: 2, charisma: 1 }, energy: -3, stress: 1 },
      },
      {
        text: 'Donate your own savings and call it a day',
        consequences: { stats: { diligence: 1 }, happiness: -1, stress: -1 },
      },
    ],
    category: 'extracurricular',
  },
  {
    id: 'evt-chess-tournament',
    title: 'Chess Tournament',
    description: 'The regional chess tournament is this weekend. Your mind is sharp, but the competition is fierce. First prize is a trophy and serious bragging rights.',
    icon: 'Crown',
    triggerCondition: { year: [1, 2, 3], minStat: { intelligence: 6 }, flags: ['joined-first-club'], randomChance: 0.4 },
    choices: [
      {
        text: 'Enter and play aggressively — go for the win',
        consequences: { stats: { intelligence: 2 }, energy: -2, stress: 2, flags: ['chess-competitor'] },
      },
      {
        text: 'Enter but focus on learning from stronger players',
        consequences: { stats: { intelligence: 2, diligence: 1 }, energy: -1, stress: 1 },
      },
      {
        text: 'Skip it — you\'d rather practice on your own terms',
        consequences: { stats: { diligence: 1 }, happiness: -1 },
      },
    ],
    category: 'extracurricular',
  },

  // ── Random Events ───────────────────────────────────────────
  {
    id: 'evt-lost-and-found',
    title: 'Lost and Found',
    description: 'You find a brand-new phone in the hallway. It\'s unlocked, and you can see notifications from someone popular. Returning it could earn you a friend — or you could snoop first.',
    icon: 'Search',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.2 },
    choices: [
      {
        text: 'Turn it in to the office without looking',
        consequences: { stats: { diligence: 2 }, happiness: 1, flags: ['honest-finder'] },
      },
      {
        text: 'Check the contacts and return it personally',
        consequences: { stats: { charisma: 2 }, relationships: {}, happiness: 1 },
      },
      {
        text: 'Glance through it first — just curious',
        consequences: { stats: { intelligence: 1 }, stress: 1, flags: ['snooped-phone'] },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-rainy-day',
    title: 'Rainy Day',
    description: 'A sudden downpour traps you under the bus stop with a classmate you barely know. The rain isn\'t letting up anytime soon. Might as well talk.',
    icon: 'CloudRain',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.3 },
    choices: [
      {
        text: 'Strike up a genuine conversation',
        consequences: { stats: { charisma: 2 }, relationships: { 'npc-noah-kim': 2 }, happiness: 1 },
      },
      {
        text: 'Share your umbrella and walk together',
        consequences: { stats: { charisma: 1, athleticism: 1 }, relationships: { 'npc-noah-kim': 1 }, energy: -1 },
      },
      {
        text: 'Put in your earbuds and wait it out',
        consequences: { stats: { diligence: 1 }, energy: 1 },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-lucky-break',
    title: 'Lucky Break',
    description: 'You find a twenty-dollar bill on the ground near the vending machines. No one seems to be looking for it. The vending machine is right there...',
    icon: 'Clover',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.15 },
    choices: [
      {
        text: 'Ask around to find the owner',
        consequences: { stats: { charisma: 1, diligence: 1 }, happiness: 1 },
      },
      {
        text: 'Treat yourself and a friend to snacks',
        consequences: { stats: { charisma: 1 }, happiness: 2, relationships: {} },
      },
      {
        text: 'Pocket it — finders keepers',
        consequences: { happiness: 1, flags: ['kept-found-money'] },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-power-outage',
    title: 'Power Outage',
    description: 'The lights go out in the middle of class. Everyone freezes, then chaos erupts. Someone screams (dramatically). The teacher steps out to check on things. You\'re alone in the dark with your classmates.',
    icon: 'Zap',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.15 },
    choices: [
      {
        text: 'Calm everyone down and suggest a game to pass the time',
        consequences: { stats: { charisma: 2 }, happiness: 2, relationships: {} },
      },
      {
        text: 'Sneak out and explore the darkened halls',
        consequences: { stats: { creativity: 1, athleticism: 1 }, energy: -1, flags: ['rebel-moment'] },
      },
      {
        text: 'Pull out your phone flashlight and help the teacher',
        consequences: { stats: { diligence: 2 }, happiness: 1 },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-stray-cat',
    title: 'Stray Cat',
    description: 'On your way home, you spot a thin stray cat huddled under a bench. It meows pitifully at you. You\'re not supposed to have pets at home, but...',
    icon: 'Cat',
    triggerCondition: { year: [1, 2, 3], randomChance: 0.2 },
    choices: [
      {
        text: 'Take it home and deal with the consequences later',
        consequences: { stats: { charisma: 1 }, happiness: 2, stress: 1, flags: ['adopted-cat'] },
      },
      {
        text: 'Bring it some food and water from a nearby store',
        consequences: { stats: { diligence: 1 }, happiness: 1 },
      },
      {
        text: 'Call animal services — it\'s the responsible thing to do',
        consequences: { stats: { diligence: 2 }, happiness: -1 },
      },
    ],
    category: 'random',
  },
  {
    id: 'evt-mystery-note',
    title: 'Mystery Note',
    description: 'You find a folded note in your locker with no name — just a riddle. Following the clues leads you on a trail through the school. Someone set this up just for you.',
    icon: 'Scroll',
    triggerCondition: { year: [1, 2, 3], minStat: { intelligence: 3 }, randomChance: 0.2 },
    choices: [
      {
        text: 'Follow every clue — you love a good puzzle',
        consequences: { stats: { intelligence: 2, creativity: 1 }, energy: -1, happiness: 2, flags: ['solved-riddle'] },
      },
      {
        text: 'Show it to your friends and solve it together',
        consequences: { stats: { charisma: 1, intelligence: 1 }, happiness: 1 },
      },
      {
        text: 'Toss it — probably a prank',
        consequences: { stats: { diligence: 1 }, happiness: -1 },
      },
    ],
    category: 'random',
  },

  // ── More Milestone / Late-Game Events ───────────────────────
  {
    id: 'evt-sophomore-slump',
    title: 'Sophomore Slump',
    description: 'The novelty of high school has worn off. Classes feel repetitive, motivation is low, and you\'re questioning whether any of this matters. The "sophomore slump" is real.',
    icon: 'Cloud',
    triggerCondition: { year: [2], week: [10, 11, 12] },
    choices: [
      {
        text: 'Shake things up — try something completely new',
        consequences: { stats: { creativity: 2, charisma: 1 }, happiness: 2, energy: -1, flags: ['broke-slump'] },
      },
      {
        text: 'Double down on your goals and push through',
        consequences: { stats: { diligence: 3 }, energy: -2, stress: 2 },
      },
      {
        text: 'Talk to someone about how you\'re feeling',
        consequences: { stats: { charisma: 1 }, stress: -2, happiness: 1, flags: ['opened-up'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-college-visit',
    title: 'College Visit',
    description: 'The school organizes a college campus visit. Walking through the quad, sitting in on a lecture, seeing the dorms — it makes the future feel real. And a little overwhelming.',
    icon: 'Building2',
    triggerCondition: { year: [2, 3], week: [22, 23], randomChance: 0.6 },
    choices: [
      {
        text: 'Get excited and start planning your application strategy',
        consequences: { stats: { intelligence: 1, diligence: 2 }, stress: 1, flags: ['college-motivated'] },
      },
      {
        text: 'Feel the pressure and worry about whether you\'re good enough',
        consequences: { stress: 3, happiness: -1, flags: ['college-anxious'] },
      },
      {
        text: 'Realize college might not be your path — and that\'s okay',
        consequences: { stats: { creativity: 1, charisma: 1 }, happiness: 1, flags: ['alternative-path'] },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-senior-prank',
    title: 'Senior Prank',
    description: 'The seniors are planning the legendary end-of-year prank. It\'s tradition — but this year\'s idea might go too far. You\'re invited to join in.',
    icon: 'Laugh',
    triggerCondition: { year: [3], week: [36, 37], randomChance: 0.7 },
    choices: [
      {
        text: 'Join in — you only live once, and it\'s harmless fun',
        consequences: { stats: { charisma: 2, creativity: 1 }, happiness: 2, stress: -1, flags: ['senior-prank'] },
      },
      {
        text: 'Suggest a tamer version that won\'t get anyone in trouble',
        consequences: { stats: { charisma: 1, diligence: 1 }, happiness: 1 },
      },
      {
        text: 'Sit this one out — you don\'t want to risk graduation',
        consequences: { stats: { diligence: 2 }, happiness: -1 },
      },
    ],
    category: 'milestone',
  },
  {
    id: 'evt-last-day',
    title: 'The Last Day',
    description: 'The final bell rings. Lockers empty, yearbooks fill with signatures, and promises to "stay in touch" echo through the halls. Four years, done. You stand at the entrance, looking back.',
    icon: 'Sunset',
    triggerCondition: { year: [3], week: [40] },
    choices: [
      {
        text: 'Hug everyone and promise to never lose touch',
        consequences: { stats: { charisma: 2 }, happiness: 3, stress: -2 },
      },
      {
        text: 'Take one last walk through the empty halls alone',
        consequences: { stats: { creativity: 2 }, happiness: 1, stress: -1 },
      },
      {
        text: 'Walk out without looking back — the future is ahead',
        consequences: { stats: { diligence: 1, athleticism: 1 }, happiness: 1, flags: ['forward-looking'] },
      },
    ],
    category: 'milestone',
  },
];
