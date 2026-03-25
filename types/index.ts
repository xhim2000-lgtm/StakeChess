export type TournamentType = 'blitz' | 'rapide' | 'classique';
export type TournamentStatus = 'open' | 'in_progress' | 'finished';

export interface TimeControl {
  initial: number; // minutes
  increment: number; // seconds per move
  label: string;
}

export interface PrizeDistribution {
  first: number; // percentage
  second: number;
  third: number;
}

export interface Tournament {
  id: string;
  name: string;
  type: TournamentType;
  timeControl: TimeControl;
  buyIn: number;
  prizePool: number;
  prizeDistribution: PrizeDistribution;
  maxPlayers: number;
  currentPlayers: number;
  registeredPlayerIds: string[];
  rounds: number;
  currentRound: number;
  status: TournamentStatus;
  startTime: string; // ISO string
  description: string;
}

export interface Player {
  id: string;
  pseudo: string;
  elo: number;
  avatar: string; // initials
  avatarColor: string;
  tournamentsPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  totalEarnings: number;
}

export interface LeaderboardEntry {
  rank: number;
  playerId: string;
  player: Player;
  score: number;
  buchholz: number;
  gamesPlayed: number;
  wins: number;
  draws: number;
  losses: number;
}

export interface Match {
  id: string;
  tournamentId: string;
  round: number;
  whitePlayerId: string;
  blackPlayerId: string;
  result: 'white' | 'black' | 'draw' | 'ongoing';
  pgn: string;
}

export interface UserProfile {
  id: string;
  pseudo: string;
  elo: number;
  balance: number;
  avatar: string;
  avatarColor: string;
  tournamentsPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  totalEarnings: number;
  registeredTournaments: string[];
  tournamentHistory: TournamentHistoryEntry[];
}

export interface TournamentHistoryEntry {
  tournamentId: string;
  tournamentName: string;
  date: string;
  rank: number;
  totalPlayers: number;
  earnings: number;
  type: TournamentType;
}

export type FilterType = 'all' | TournamentType;
export type FilterBuyIn = 'all' | '5' | '10' | '25' | '50+';
export type FilterStatus = 'all' | 'open' | 'in_progress' | 'finished';
