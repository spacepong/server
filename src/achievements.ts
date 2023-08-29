export interface AchievementData {
  name: string;
  description: string;
  icon: string;
}

export const achievements: AchievementData[] = [
  {
    name: 'First Win',
    description: 'Win your first match',
    icon: `${process.env.BACKEND_URL}achievement/FirstWin.png`,
  },
  {
    name: 'First Loss',
    description: 'Lose your first match',
    icon: `${process.env.BACKEND_URL}achievement/FirstLoss.png`,
  },
  {
    name: 'Novice Player',
    description: 'Reach ranking 200',
    icon: `${process.env.BACKEND_URL}achievement/NovicePlayer.png`,
  },
  {
    name: 'Intermediate Player',
    description: 'Reach ranking 400',
    icon: `${process.env.BACKEND_URL}achievement/IntermediatePlayer.png`,
  },
  {
    name: 'Advanced Player',
    description: 'Reach ranking 600',
    icon: `${process.env.BACKEND_URL}achievement/AdvancedPlayer.png`,
  },
  {
    name: 'Expert Player',
    description: 'Reach ranking 800',
    icon: `${process.env.BACKEND_URL}achievement/ExpertPlayer.png`,
  },
  {
    name: 'Master Player',
    description: 'Reach ranking 1000',
    icon: `${process.env.BACKEND_URL}achievement/MasterPlayer.png`,
  },
];
