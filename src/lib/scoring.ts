export interface ScoreCalculationParams {
  difficulty: 'EASY' | 'MEDIUM' | 'HARD' | 'EXPERT' | string;
  evaluationScore: number; // 0 - 100
  timeSpent: number; // in seconds
  totalTime: number; // in seconds (default e.g. 60s)
  hintsUsed: number;
  mode?: 'CLASSIC' | 'DAILY' | 'PRACTICE' | 'RANDOM' | string;
}

export interface ScoreBreakdown {
  baseXP: number;
  scoreMultiplier: number;
  speedBonusXP: number;
  hintPenaltyXP: number;
  modeMultiplier: number;
  totalXPEarned: number;
}

export function calculateXP(params: ScoreCalculationParams): ScoreBreakdown {
  const { difficulty, evaluationScore, timeSpent, totalTime = 60, hintsUsed, mode = 'CLASSIC' } = params;

  if (evaluationScore < 35) {
    return {
      baseXP: 0,
      scoreMultiplier: 0,
      speedBonusXP: 0,
      hintPenaltyXP: 0,
      modeMultiplier: 1,
      totalXPEarned: 0,
    };
  }

  // 1. Base XP by Difficulty
  let baseXP = 150;
  switch (difficulty.toUpperCase()) {
    case 'EASY':
      baseXP = 100;
      break;
    case 'MEDIUM':
      baseXP = 150;
      break;
    case 'HARD':
      baseXP = 250;
      break;
    case 'EXPERT':
      baseXP = 400;
      break;
  }

  // 2. Evaluation Score Multiplier
  const scoreMultiplier = evaluationScore / 100;
  let currentXP = baseXP * scoreMultiplier;

  // 3. Speed Bonus (up to +50% extra XP if answered immediately)
  const safeTimeSpent = Math.min(totalTime, Math.max(0, timeSpent));
  const remainingFraction = (totalTime - safeTimeSpent) / totalTime;
  const speedBonusXP = Math.round(currentXP * 0.5 * remainingFraction);

  currentXP += speedBonusXP;

  // 4. Hint Penalty (-20% per hint used)
  const hintPenaltyFraction = Math.min(0.6, hintsUsed * 0.2); // max 60% penalty
  const hintPenaltyXP = Math.round(currentXP * hintPenaltyFraction);
  currentXP -= hintPenaltyXP;

  // 5. Mode Multiplier
  let modeMultiplier = 1.0;
  if (mode === 'DAILY') modeMultiplier = 1.5;
  if (mode === 'PRACTICE') modeMultiplier = 0.5;

  const totalXPEarned = Math.max(0, Math.round(currentXP * modeMultiplier));

  return {
    baseXP,
    scoreMultiplier,
    speedBonusXP,
    hintPenaltyXP,
    modeMultiplier,
    totalXPEarned,
  };
}
