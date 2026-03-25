import { Player } from '@/types';

const avatarColors = [
  '#E74C3C', '#3498DB', '#2ECC71', '#F39C12', '#9B59B6',
  '#1ABC9C', '#E67E22', '#34495E', '#16A085', '#C0392B',
  '#2980B9', '#27AE60', '#8E44AD', '#D35400', '#2C3E50',
];

export const players: Player[] = [
  { id: 'p1', pseudo: 'MagnusF', elo: 2400, avatar: 'MF', avatarColor: avatarColors[0], tournamentsPlayed: 45, wins: 32, draws: 8, losses: 5, totalEarnings: 3250 },
  { id: 'p2', pseudo: 'ChessKing92', elo: 2150, avatar: 'CK', avatarColor: avatarColors[1], tournamentsPlayed: 38, wins: 22, draws: 10, losses: 6, totalEarnings: 1800 },
  { id: 'p3', pseudo: 'DarkBishop', elo: 1950, avatar: 'DB', avatarColor: avatarColors[2], tournamentsPlayed: 52, wins: 28, draws: 15, losses: 9, totalEarnings: 2100 },
  { id: 'p4', pseudo: 'QueenGambit', elo: 2050, avatar: 'QG', avatarColor: avatarColors[3], tournamentsPlayed: 30, wins: 18, draws: 7, losses: 5, totalEarnings: 1450 },
  { id: 'p5', pseudo: 'KnightRider', elo: 1800, avatar: 'KR', avatarColor: avatarColors[4], tournamentsPlayed: 25, wins: 12, draws: 8, losses: 5, totalEarnings: 750 },
  { id: 'p6', pseudo: 'RookStorm', elo: 2200, avatar: 'RS', avatarColor: avatarColors[5], tournamentsPlayed: 41, wins: 27, draws: 9, losses: 5, totalEarnings: 2800 },
  { id: 'p7', pseudo: 'PawnStar', elo: 1650, avatar: 'PS', avatarColor: avatarColors[6], tournamentsPlayed: 20, wins: 8, draws: 6, losses: 6, totalEarnings: 320 },
  { id: 'p8', pseudo: 'Kasparov_Jr', elo: 2300, avatar: 'KJ', avatarColor: avatarColors[7], tournamentsPlayed: 55, wins: 38, draws: 12, losses: 5, totalEarnings: 4100 },
  { id: 'p9', pseudo: 'SicilianDef', elo: 1900, avatar: 'SD', avatarColor: avatarColors[8], tournamentsPlayed: 33, wins: 17, draws: 10, losses: 6, totalEarnings: 980 },
  { id: 'p10', pseudo: 'EndgamePro', elo: 2100, avatar: 'EP', avatarColor: avatarColors[9], tournamentsPlayed: 40, wins: 25, draws: 8, losses: 7, totalEarnings: 2200 },
  { id: 'p11', pseudo: 'Fianchetto', elo: 1750, avatar: 'FI', avatarColor: avatarColors[10], tournamentsPlayed: 18, wins: 9, draws: 5, losses: 4, totalEarnings: 450 },
  { id: 'p12', pseudo: 'Zugzwang', elo: 2050, avatar: 'ZZ', avatarColor: avatarColors[11], tournamentsPlayed: 35, wins: 20, draws: 9, losses: 6, totalEarnings: 1650 },
  { id: 'p13', pseudo: 'BlitzMaster', elo: 2250, avatar: 'BM', avatarColor: avatarColors[12], tournamentsPlayed: 60, wins: 40, draws: 12, losses: 8, totalEarnings: 3800 },
  { id: 'p14', pseudo: 'CatalanKing', elo: 1850, avatar: 'CK', avatarColor: avatarColors[13], tournamentsPlayed: 28, wins: 14, draws: 8, losses: 6, totalEarnings: 680 },
  { id: 'p15', pseudo: 'TalStyle', elo: 2000, avatar: 'TS', avatarColor: avatarColors[14], tournamentsPlayed: 42, wins: 24, draws: 11, losses: 7, totalEarnings: 1900 },
  { id: 'p16', pseudo: 'FrenchDef', elo: 1700, avatar: 'FD', avatarColor: avatarColors[0], tournamentsPlayed: 22, wins: 10, draws: 7, losses: 5, totalEarnings: 400 },
  { id: 'p17', pseudo: 'GrunfeldFan', elo: 1950, avatar: 'GF', avatarColor: avatarColors[1], tournamentsPlayed: 36, wins: 19, draws: 10, losses: 7, totalEarnings: 1100 },
  { id: 'p18', pseudo: 'CaroKann', elo: 2100, avatar: 'CK', avatarColor: avatarColors[2], tournamentsPlayed: 44, wins: 28, draws: 10, losses: 6, totalEarnings: 2400 },
  { id: 'p19', pseudo: 'KingsIndian', elo: 1600, avatar: 'KI', avatarColor: avatarColors[3], tournamentsPlayed: 15, wins: 6, draws: 4, losses: 5, totalEarnings: 200 },
  { id: 'p20', pseudo: 'DoubleCheck', elo: 2350, avatar: 'DC', avatarColor: avatarColors[4], tournamentsPlayed: 48, wins: 33, draws: 10, losses: 5, totalEarnings: 3600 },
  { id: 'p21', pseudo: 'Checkmate99', elo: 1550, avatar: 'CM', avatarColor: avatarColors[5], tournamentsPlayed: 12, wins: 4, draws: 3, losses: 5, totalEarnings: 100 },
  { id: 'p22', pseudo: 'BishopPair', elo: 1900, avatar: 'BP', avatarColor: avatarColors[6], tournamentsPlayed: 30, wins: 15, draws: 9, losses: 6, totalEarnings: 850 },
  { id: 'p23', pseudo: 'OpenFile', elo: 2000, avatar: 'OF', avatarColor: avatarColors[7], tournamentsPlayed: 38, wins: 22, draws: 10, losses: 6, totalEarnings: 1700 },
  { id: 'p24', pseudo: 'Tempo_Plus', elo: 1750, avatar: 'TP', avatarColor: avatarColors[8], tournamentsPlayed: 24, wins: 11, draws: 7, losses: 6, totalEarnings: 520 },
  { id: 'p25', pseudo: 'Sacrifice77', elo: 2200, avatar: 'S7', avatarColor: avatarColors[9], tournamentsPlayed: 50, wins: 32, draws: 12, losses: 6, totalEarnings: 3100 },
  { id: 'p26', pseudo: 'QuietMove', elo: 1650, avatar: 'QM', avatarColor: avatarColors[10], tournamentsPlayed: 19, wins: 8, draws: 5, losses: 6, totalEarnings: 300 },
  { id: 'p27', pseudo: 'Promotion8', elo: 1850, avatar: 'P8', avatarColor: avatarColors[11], tournamentsPlayed: 27, wins: 13, draws: 8, losses: 6, totalEarnings: 620 },
  { id: 'p28', pseudo: 'IsolatedPawn', elo: 1200, avatar: 'IP', avatarColor: avatarColors[12], tournamentsPlayed: 8, wins: 2, draws: 2, losses: 4, totalEarnings: 50 },
  { id: 'p29', pseudo: 'Stalemate', elo: 1400, avatar: 'SM', avatarColor: avatarColors[13], tournamentsPlayed: 10, wins: 3, draws: 4, losses: 3, totalEarnings: 120 },
  { id: 'p30', pseudo: 'EnPassant', elo: 1500, avatar: 'EP', avatarColor: avatarColors[14], tournamentsPlayed: 14, wins: 5, draws: 4, losses: 5, totalEarnings: 180 },
];

export function getPlayerById(id: string): Player | undefined {
  return players.find(p => p.id === id);
}
