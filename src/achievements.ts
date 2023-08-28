import { $Enums } from '@prisma/client';

export interface AchievementData {
  name: string;
  description: string;
  icon: string;
  type: $Enums.AchievementType;
}

export const achievements: AchievementData[] = [
  {
    name: 'First Win',
    description: 'Win your first match',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.WIN_MATCH,
  },
  {
    name: 'First Loss',
    description: 'Lose your first match',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.LOSE_MATCH,
  },
  {
    name: 'Novice Player',
    description: 'Reach ranking 200',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.REACH_RANK_1,
  },
  {
    name: 'Intermediate Player',
    description: 'Reach ranking 400',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.REACH_RANK_2,
  },
  {
    name: 'Advanced Player',
    description: 'Reach ranking 600',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.REACH_RANK_3,
  },
  {
    name: 'Expert Player',
    description: 'Reach ranking 800',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.REACH_RANK_4,
  },
  {
    name: 'Master Player',
    description: 'Reach ranking 1000',
    icon: 'https://i.imgur.com/5J8hG9D.png',
    type: $Enums.AchievementType.REACH_RANK_5,
  },
];
