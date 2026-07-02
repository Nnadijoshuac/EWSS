import { User, BadgeType } from './types';

export interface BadgeDefinition {
  id: BadgeType;
  name: string;
  description: string;
  emoji: string;
  requirement: (user: User) => boolean;
}

export const badgeDefinitions: BadgeDefinition[] = [
  {
    id: 'first_report',
    name: 'First Report',
    description: 'Submit your first infrastructure report',
    emoji: '🚀',
    requirement: (user) => user.reportCount >= 1,
  },
  {
    id: 'reporter_5',
    name: 'Reporter',
    description: 'Submit 5 infrastructure reports',
    emoji: '⭐',
    requirement: (user) => user.reportCount >= 5,
  },
  {
    id: 'reporter_10',
    name: 'Super Reporter',
    description: 'Submit 10 infrastructure reports',
    emoji: '✨',
    requirement: (user) => user.reportCount >= 10,
  },
  {
    id: 'infrastructure_hero',
    name: 'Infrastructure Hero',
    description: 'Submit 50 infrastructure reports',
    emoji: '🦸',
    requirement: (user) => user.reportCount >= 50,
  },
  {
    id: 'community_leader',
    name: 'Community Leader',
    description: 'Earn 500+ points in a month',
    emoji: '👑',
    requirement: (user) => user.points >= 500,
  },
  {
    id: 'water_guardian',
    name: 'Water Guardian',
    description: '20+ verified reports leading to repairs',
    emoji: '💧',
    requirement: (user) => user.verifiedReportCount >= 20,
  },
];

export function checkBadges(user: User): BadgeType[] {
  return badgeDefinitions
    .filter((badge) => badge.requirement(user))
    .map((badge) => badge.id)
    .filter((badgeId) => !user.badges.includes(badgeId));
}

export function awardNewBadges(user: User): User {
  const newBadges = checkBadges(user);
  if (newBadges.length > 0) {
    return {
      ...user,
      badges: [...user.badges, ...newBadges],
    };
  }
  return user;
}

export function getBadgeDefinition(badgeId: BadgeType): BadgeDefinition | undefined {
  return badgeDefinitions.find((b) => b.id === badgeId);
}
