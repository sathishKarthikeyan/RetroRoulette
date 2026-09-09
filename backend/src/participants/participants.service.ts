import { Injectable, BadRequestException } from '@nestjs/common';
import { Participant, SpinResult, ResetResult } from './participants.types';
import { selectNextParticipant } from './selection.util';

const INITIAL_PARTICIPANTS: Omit<Participant, 'spokenCount'>[] = [
  { id: 1, name: 'Alex', color: '#6366f1' },    // Indigo
  { id: 2, name: 'Maya', color: '#ec4899' },    // Pink
  { id: 3, name: 'Sam', color: '#10b981' },     // Emerald
  { id: 4, name: 'Priya', color: '#f59e0b' },   // Amber
  { id: 5, name: 'Jordan', color: '#06b6d4' },  // Cyan
  { id: 6, name: 'Chris', color: '#8b5cf6' },   // Purple
  { id: 7, name: 'Taylor', color: '#ef4444' },  // Red/Coral
  { id: 8, name: 'Morgan', color: '#14b8a6' },  // Teal
];

@Injectable()
export class ParticipantsService {
  private participants: Participant[] = [];
  private lastWinnerId: number | null = null;

  constructor() {
    this.initializeParticipants();
  }

  private initializeParticipants(): void {
    this.participants = INITIAL_PARTICIPANTS.map((p) => ({
      ...p,
      spokenCount: 0,
    }));
    this.lastWinnerId = null;
  }

  getParticipants(): Participant[] {
    return this.participants;
  }

  spin(): SpinResult {
    if (this.participants.length === 0) {
      throw new BadRequestException('No participants found to spin');
    }

    const winner = selectNextParticipant(this.participants, this.lastWinnerId);

    // Update in-memory spoken count
    winner.spokenCount += 1;
    const previousWinnerId = this.lastWinnerId;
    this.lastWinnerId = winner.id;

    return {
      winner: { ...winner },
      previousWinnerId,
    };
  }

  reset(): ResetResult {
    this.initializeParticipants();
    return {
      message: 'Retro reset successfully',
      participants: [...this.participants],
    };
  }
}
