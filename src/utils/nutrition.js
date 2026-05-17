const toNumberOrNull = (value) => {
    const number = Number(value);
    return Number.isFinite(number) ? number : null;
};

const scoreGula = (value) => {
    if (value === null) return null;
    if (value > 10) return 'D';
    if (value > 5) return 'C';
    if (value > 1) return 'B';
    return 'A';
};

const scoreGaram = (value) => {
    if (value === null) return null;
    if (value > 500) return 'D';
    if (value > 120) return 'C';
    if (value > 5) return 'B';
    return 'A';
};

const scoreLemakJenuh = (value) => {
    if (value === null) return null;
    if (value > 500) return 'D';
    if (value > 120) return 'C';
    if (value > 5) return 'B';
    return 'A';
};

export function calculateNutriLevel(gula, garam, lemakJenuh) {
    const gulaScore = scoreGula(toNumberOrNull(gula));
    const garamScore = scoreGaram(toNumberOrNull(garam));
    const lemakScore = scoreLemakJenuh(toNumberOrNull(lemakJenuh));
    const hierarchy = { A: 1, B: 2, C: 3, D: 4 };
    const knownScores = [gulaScore, garamScore, lemakScore].filter(Boolean);

    const level = knownScores.length
        ? knownScores.reduce((worst, score) => (hierarchy[score] > hierarchy[worst] ? score : worst), 'A')
        : 'N/A';

    return {
        level,
        gulaScore,
        garamScore,
        lemakScore
    };
}
