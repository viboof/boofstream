// this  was adapted from parry.gg's own frontend code, as gifted to
// boofstream by blorppppp.  we love you blorppppp, we love you parry.gg

import { Match } from "@parry-gg/client";

const GRAND_FINAL_RESET_LABEL = "Grand Final Reset";
const GRAND_FINAL_LABEL = "Grand Final";
const WINNERS_FINAL_LABEL = "Winners Final";
const WINNERS_SEMI_LABEL = "Winners Semi-Final";
const WINNERS_QUARTER_LABEL = "Winners Quarter-Final";
const LOSERS_FINAL_LABEL = "Losers Final";
const LOSERS_SEMI_LABEL = "Losers Semi-Final";
const LOSERS_QUARTER_LABEL = "Losers Quarter-Final";

const roundKey = (round: number, winnersSide: boolean) => {
  return `${round},${winnersSide}`;
};

const getRoundLabel = (matches: Match[], roundToLabel: Map<string, string>) => {
  if (!matches?.length) {
    throw new Error(`Can't get round label for empty round`);
  }
  const match = matches[0];
  const nextRoundKey = roundKey(match.getRound() + 1, match.getWinnersSide());
  if (match.getWinnersSide()) {
    const isGFReset = match.getGrandFinals() && 
      (!match.getWinnersMatchId() || (match.getWinnersMatchId() != match.getLosersMatchId()));

    if (isGFReset) {
      return GRAND_FINAL_RESET_LABEL;
    } else if (match.getGrandFinals()) {
      return GRAND_FINAL_LABEL;
      // Non-power of 2 brackets can contain a single match in
      // round 1, so we explicitly skip this.
    } else if (matches.length === 1 && match.getRound() > 1) {
      return WINNERS_FINAL_LABEL;
    } else if (
      matches.length === 2 &&
      (!roundToLabel.get(nextRoundKey) ||
        roundToLabel.get(nextRoundKey) === WINNERS_FINAL_LABEL)
    ) {
      return WINNERS_SEMI_LABEL;
    } else if (
      matches.length === 4 &&
      (!roundToLabel.get(nextRoundKey) ||
        roundToLabel.get(nextRoundKey) === WINNERS_SEMI_LABEL)
    ) {
      return WINNERS_QUARTER_LABEL;
    }
  } else {
    if (matches.length === 1 && !roundToLabel.has(nextRoundKey)) {
      return LOSERS_FINAL_LABEL;
    } else if (roundToLabel.get(nextRoundKey) === LOSERS_FINAL_LABEL) {
      return LOSERS_SEMI_LABEL;
    } else if (roundToLabel.get(nextRoundKey) === LOSERS_SEMI_LABEL) {
      return LOSERS_QUARTER_LABEL;
    }
  }

  const prefix = match.getWinnersSide() ? "Winners" : "Losers";
  return `${prefix} Round ${match.getRound()}`;
};

const keyToValues = (key: string): { round: number; winnersSide: boolean } => {
  const parts = key.split(",");
  return { round: parseInt(parts[0], 10), winnersSide: parts[1] === "true" };
};

export class Round {
  constructor(
    public round: number,
    public winnersSide: boolean,
    public label: string,
  ) {}
}

export const getRounds = (matches: Match[]): Round[] => {
  const roundToMatches: Map<string, Match[]> = matches.reduce(
    (acc, current) => {
      const match = current;
      const key = roundKey(match.getRound(), match.getWinnersSide());
      const matches = acc.get(key) ?? [];
      matches.push(match);
      acc.set(key, matches);
      return acc;
    },
    new Map(),
  );

  const descendingRounds = [...roundToMatches.keys()].sort((a, b) => {
    const { round: numA, winnersSide: isWinnersSideA } = keyToValues(a);
    const { round: numB, winnersSide: isWinnersSideB } = keyToValues(b);
    if (numA === numB) {
      return Number(isWinnersSideB) - Number(isWinnersSideA);
    }
    return numB - numA;
  });

  const roundToRoundLabel = new Map<string, string>();
  const encounteredLabels = new Set<string>();
  for (const round of descendingRounds) {
    const matches = roundToMatches.get(round) ?? [];
    const label = getRoundLabel(matches, roundToRoundLabel);
    encounteredLabels.add(label);
    roundToRoundLabel.set(round, label);
  }

  return [...roundToMatches.keys()].map((k) => {
    const { round, winnersSide } = keyToValues(k);
    return new Round(round, winnersSide, roundToRoundLabel.get(k)!);
  });
};
