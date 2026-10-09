export interface LevelInfo {
  level: number;
  title: string;
  badgeColor: string;
  currentLevelXP: number;
  nextLevelXP: number;
  progressPercent: number;
}

/**
 * Total cumulative XP required to reach a specific level
 */
export function getXPForLevel(level: number): number {
  if (level <= 1) return 0;
  // Formula: 100 * (level - 1)^1.6
  return Math.floor(100 * Math.pow(level - 1, 1.6));
}

/**
 * Returns LevelInfo based on total accumulated user XP
 */
export function getLevelInfoFromXP(totalXP: number): LevelInfo {
  let level = 1;

  while (getXPForLevel(level + 1) <= totalXP) {
    level++;
  }

  const currentLevelStartXP = getXPForLevel(level);
  const nextLevelXP = getXPForLevel(level + 1);
  const xpInCurrentLevel = totalXP - currentLevelStartXP;
  const xpNeededForNextLevel = nextLevelXP - currentLevelStartXP;

  const progressPercent = Math.min(
    100,
    Math.max(0, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100))
  );

  let title = 'Havaskor';
  let badgeColor = 'from-amber-600 to-yellow-500';

  if (level >= 100) {
    title = 'Zakovat Afsonasi';
    badgeColor = 'from-amber-400 via-yellow-300 to-amber-500';
  } else if (level >= 75) {
    title = 'Zakovat Dahosi';
    badgeColor = 'from-purple-500 to-pink-500';
  } else if (level >= 51) {
    title = 'Zakovat Ustasi';
    badgeColor = 'from-emerald-500 to-teal-400';
  } else if (level >= 36) {
    title = 'Grossmeyster';
    badgeColor = 'from-blue-500 to-indigo-600';
  } else if (level >= 21) {
    title = 'Ekspert';
    badgeColor = 'from-yellow-500 to-amber-600';
  } else if (level >= 11) {
    title = 'Izlanuvchi';
    badgeColor = 'from-cyan-500 to-blue-500';
  } else if (level >= 6) {
    title = 'Bilimdon';
    badgeColor = 'from-amber-700 to-yellow-600';
  }

  return {
    level,
    title,
    badgeColor,
    currentLevelXP: xpInCurrentLevel,
    nextLevelXP: xpNeededForNextLevel,
    progressPercent,
  };
}
