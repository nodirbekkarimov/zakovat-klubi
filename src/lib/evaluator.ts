import stringSimilarity from 'string-similarity';

export type EvaluationVerdict = 'CORRECT' | 'ALMOST_CORRECT' | 'PARTIAL' | 'WRONG';

export interface EvaluationResult {
  score: number; // 0 to 100
  verdict: EvaluationVerdict;
  matchedKeywords: string[];
  missingKeywords: string[];
  similarityRatio: number;
  explanation: string;
  isPassed: boolean;
}

/**
 * Stage 1: Text Normalization
 * Standardizes apostrophes, strips extraneous punctuation, converts to lowercase.
 */
export function normalizeText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    // Standardize Uzbek apostrophes and quotes
    .replace(/[’`‘']/g, "'")
    // Replace non-alphanumeric characters (except single apostrophe and space) with space
    .replace(/[^a-z0-9'ʻʼ\u0400-\u04FF\s]/gi, ' ')
    // Collapse multiple spaces
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Calculates Levenshtein Distance similarity ratio (0 to 1)
 */
function levenshteinSimilarity(s1: string, s2: string): number {
  const a = normalizeText(s1);
  const b = normalizeText(s2);
  if (a === b) return 1.0;
  if (!a.length || !b.length) return 0.0;

  const matrix: number[][] = [];
  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  const distance = matrix[b.length][a.length];
  const maxLength = Math.max(a.length, b.length);
  return 1 - distance / maxLength;
}

/**
 * Stage 2 to 5: Main Answer Evaluator Pipeline
 */
export function evaluateAnswer(
  userAnswerInput: string,
  officialAnswer: string,
  acceptableAnswersInput: string[] | string = [],
  keywordsInput: string[] | string = []
): EvaluationResult {
  const normUser = normalizeText(userAnswerInput);
  const normOfficial = normalizeText(officialAnswer);

  const acceptableAnswers: string[] = Array.isArray(acceptableAnswersInput)
    ? acceptableAnswersInput
    : typeof acceptableAnswersInput === 'string'
    ? JSON.parse(acceptableAnswersInput || '[]')
    : [];

  const keywords: string[] = Array.isArray(keywordsInput)
    ? keywordsInput
    : typeof keywordsInput === 'string'
    ? JSON.parse(keywordsInput || '[]')
    : [];

  const normAcceptable = acceptableAnswers.map((a) => normalizeText(a));

  // If user provided empty answer
  if (!normUser) {
    return {
      score: 0,
      verdict: 'WRONG',
      matchedKeywords: [],
      missingKeywords: keywords,
      similarityRatio: 0,
      explanation: "Javob kiritilmadi.",
      isPassed: false,
    };
  }

  // 1. Exact Match Check
  if (normUser === normOfficial || normAcceptable.includes(normUser)) {
    return {
      score: 100,
      verdict: 'CORRECT',
      matchedKeywords: keywords,
      missingKeywords: [],
      similarityRatio: 1.0,
      explanation: "Mukammal aniq javob!",
      isPassed: true,
    };
  }

  // Check if official answer is contained within user's complete text
  if (normUser.includes(normOfficial) || normAcceptable.some((acc) => acc && normUser.includes(acc))) {
    return {
      score: 95,
      verdict: 'CORRECT',
      matchedKeywords: keywords,
      missingKeywords: [],
      similarityRatio: 0.95,
      explanation: "To'g'ri javob matn tarkibida topildi!",
      isPassed: true,
    };
  }

  // 2. Keyword Coverage Scoring
  const matchedKeywords: string[] = [];
  const missingKeywords: string[] = [];

  keywords.forEach((kw) => {
    const normKw = normalizeText(kw);
    if (normKw && normUser.includes(normKw)) {
      matchedKeywords.push(kw);
    } else if (normKw) {
      missingKeywords.push(kw);
    }
  });

  const keywordCoverageRatio = keywords.length > 0 ? matchedKeywords.length / keywords.length : 0;

  // 3. String Similarity Scoring (Dice + Levenshtein maximum)
  const allTargetAnswers = [officialAnswer, ...acceptableAnswers].filter(Boolean);
  let maxSimilarity = 0;

  allTargetAnswers.forEach((target) => {
    const normTarget = normalizeText(target);
    const diceSim = stringSimilarity.compareTwoStrings(normUser, normTarget);
    const levSim = levenshteinSimilarity(normUser, normTarget);
    const bestSim = Math.max(diceSim, levSim);

    // Also check token set overlap
    const userWords = new Set(normUser.split(' '));
    const targetWords = normTarget.split(' ');
    const matchedWordsCount = targetWords.filter((w) => userWords.has(w)).length;
    const wordOverlapRatio = targetWords.length > 0 ? matchedWordsCount / targetWords.length : 0;

    const combinedSim = Math.max(bestSim, wordOverlapRatio * 0.9);
    if (combinedSim > maxSimilarity) {
      maxSimilarity = combinedSim;
    }
  });

  // 4. Combined Weighted Score Calculation
  let finalScore = 0;

  if (keywords.length > 0) {
    // 60% Keyword Score + 40% Similarity Score
    finalScore = keywordCoverageRatio * 60 + maxSimilarity * 40;
  } else {
    // 100% Similarity Score
    finalScore = maxSimilarity * 100;
  }

  // Cap final score between 0 and 100
  finalScore = Math.min(100, Math.max(0, Math.round(finalScore)));

  // 5. Final Verdict Assignment
  let verdict: EvaluationVerdict = 'WRONG';
  let explanation = '';
  let isPassed = false;

  if (finalScore >= 85) {
    verdict = 'CORRECT';
    explanation = "To'g me'yorda qabul qilindi.";
    isPassed = true;
  } else if (finalScore >= 65) {
    verdict = 'ALMOST_CORRECT';
    explanation = "Javobingiz to'g'ri javobga judayam yaqin!";
    isPassed = true;
  } else if (finalScore >= 35) {
    verdict = 'PARTIAL';
    explanation = "Javobda ba'zi to'g mezonlar bor, lekin to'liq emas.";
    isPassed = false;
  } else {
    verdict = 'WRONG';
    explanation = "Noto'g'ri javob.";
    isPassed = false;
  }

  return {
    score: finalScore,
    verdict,
    matchedKeywords,
    missingKeywords,
    similarityRatio: maxSimilarity,
    explanation,
    isPassed,
  };
}
