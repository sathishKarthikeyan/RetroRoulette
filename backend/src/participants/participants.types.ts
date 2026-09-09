export interface Participant {
  id: number;
  name: string;
  spokenCount: number;
  color: string;
}

export interface SpinResult {
  winner: Participant;
  previousWinnerId?: number | null;
}

export interface ResetResult {
  message: string;
  participants: Participant[];
}
