import { Participant } from './participants.types';

/**
 * Selects the next participant based on weighted probability:
 * 1. Participants with fewer spoken counts have higher probability.
 * 2. The most recent speaker is excluded to prevent back-to-back repeats (if >1 candidate).
 */
export function selectNextParticipant(
  participants: Participant[],
  lastWinnerId: number | null,
): Participant {
  if (!participants || participants.length === 0) {
    throw new Error('No participants available');
  }

  // Prevent immediate repeats if other candidates are available
  const candidates =
    participants.length > 1 && lastWinnerId !== null
      ? participants.filter((p) => p.id !== lastWinnerId)
      : participants;

  // Calculate weights: Lower spoken count = higher weight.
  // Weight formula: (maxSpoken - spokenCount + 1)
  const maxSpoken = Math.max(...candidates.map((c) => c.spokenCount));

  const weightedCandidates = candidates.map((candidate) => ({
    candidate,
    weight: maxSpoken - candidate.spokenCount + 1,
  }));

  const totalWeight = weightedCandidates.reduce((acc, item) => acc + item.weight, 0);

  // Pick random float in [0, totalWeight)
  let randomValue = Math.random() * totalWeight;

  for (const item of weightedCandidates) {
    if (randomValue < item.weight) {
      return item.candidate;
    }
    randomValue -= item.weight;
  }

  return weightedCandidates[weightedCandidates.length - 1].candidate;
}
