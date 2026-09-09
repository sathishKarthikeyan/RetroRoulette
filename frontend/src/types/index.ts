export interface Participant {
  id: number;
  name: string;
  spokenCount: number;
  color: string;
}

export interface SpinResponse {
  winner: Participant;
  previousWinnerId?: number | null;
}

export interface ResetResponse {
  message: string;
  participants: Participant[];
}
