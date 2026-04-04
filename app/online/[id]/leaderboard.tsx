import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { getTournamentById } from '@/data/onlineTournaments';
import { getPlayerById } from '@/data/players';
import { LeaderboardEntry } from '@/types';

const G = Colors.gaming;
const RANK_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();
  const tournament = getTournamentById(id);

  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    if (!tournament) return [];
    const entries: LeaderboardEntry[] = tournament.registeredPlayerIds.map((pid, idx) => {
      const player = getPlayerById(pid);
      if (!player) return null;
      const maxScore = tournament.currentRound;
      const eloFactor = (player.elo - 1200) / 1200;
      const randomness = (Math.sin(idx * 7.3 + player.elo) + 1) / 4;
      const rawScore = maxScore * (eloFactor * 0.6 + randomness);
      const score = Math.round(Math.min(rawScore, maxScore) * 2) / 2;
      const wins = Math.floor(score);
      const draws = (score - wins) * 2;
      const losses = tournament.currentRound - wins - draws;
      const buchholz = Math.round((score * 3 + player.elo / 500) * 10) / 10;
      return {
        rank: 0, playerId: pid, player, score: Math.max(0, score), buchholz,
        gamesPlayed: tournament.currentRound, wins: Math.max(0, wins),
        draws: Math.max(0, Math.round(draws)), losses: Math.max(0, Math.round(losses)),
      };
    }).filter(Boolean) as LeaderboardEntry[];
    entries.sort((a, b) => b.score - a.score || b.buchholz - a.buchholz);
    entries.forEach((e, i) => { e.rank = i + 1; });
    return entries;
  }, [tournament]);

  if (!tournament) {
    return <View style={styles.center}><Text style={styles.errorText}>Tournoi introuvable</Text></View>;
  }

  const isFinished = tournament.status === 'finished';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.subtitle}>
          {isFinished ? 'Classement final' : `Ronde ${tournament.currentRound}/${tournament.rounds}`}
        </Text>

        {isFinished && leaderboard.length >= 3 && (
          <View style={styles.prizeCard}>
            {[0, 1, 2].map(i => {
              const entry = leaderboard[i];
              const pct = i === 0 ? 0.5 : i === 1 ? 0.3 : 0.2;
              const prize = tournament.prizePool * pct;
              return (
                <View key={i} style={styles.prizeRow}>
                  <Text style={styles.prizeEmoji}>{RANK_EMOJI[i + 1]}</Text>
                  <Text style={styles.prizeName}>{entry.player.pseudo}</Text>
                  <Text style={styles.prizeAmount}>+{prize.toFixed(0)}€</Text>
                </View>
              );
            })}
          </View>
        )}

        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: 36 }]}>#</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Joueur</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>Score</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>Buch.</Text>
            <Text style={[styles.headerCell, { width: 36 }]}>V</Text>
            <Text style={[styles.headerCell, { width: 36 }]}>N</Text>
            <Text style={[styles.headerCell, { width: 36 }]}>D</Text>
          </View>

          {leaderboard.map(entry => {
            const isCurrentUser = entry.playerId === user.id;
            return (
              <View key={entry.playerId} style={[styles.tableRow, isCurrentUser && styles.userRow]}>
                <View style={{ width: 36, alignItems: 'center' }}>
                  {RANK_EMOJI[entry.rank] ? (
                    <Text style={styles.rankEmoji}>{RANK_EMOJI[entry.rank]}</Text>
                  ) : (
                    <Text style={styles.rankNum}>{entry.rank}</Text>
                  )}
                </View>
                <View style={styles.playerCell}>
                  <View style={[styles.miniAvatar, { backgroundColor: entry.player.avatarColor }]}>
                    <Text style={styles.miniAvatarText}>{entry.player.avatar}</Text>
                  </View>
                  <View>
                    <Text style={[styles.playerName, isCurrentUser && styles.userText]}>
                      {entry.player.pseudo}
                    </Text>
                    <Text style={styles.playerElo}>{entry.player.elo}</Text>
                  </View>
                </View>
                <Text style={[styles.cell, { width: 50, fontWeight: '700', color: G.gold }]}>{entry.score}</Text>
                <Text style={[styles.cell, { width: 50 }]}>{entry.buchholz}</Text>
                <Text style={[styles.cell, { width: 36, color: G.green }]}>{entry.wins}</Text>
                <Text style={[styles.cell, { width: 36 }]}>{entry.draws}</Text>
                <Text style={[styles.cell, { width: 36, color: G.red }]}>{entry.losses}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: G.bg },
  errorText: { fontSize: 16, color: G.red },
  title: { fontSize: 18, fontWeight: '800', color: G.textPrimary, letterSpacing: 0.5 },
  subtitle: { fontSize: 13, color: G.textSecondary, marginBottom: 14, marginTop: 2 },
  prizeCard: {
    backgroundColor: G.bgSecondary,
    borderRadius: 12,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: G.borderGold,
    gap: 8,
  },
  prizeRow: { flexDirection: 'row', alignItems: 'center' },
  prizeEmoji: { fontSize: 20, marginRight: 8 },
  prizeName: { flex: 1, fontSize: 14, fontWeight: '600', color: G.textPrimary },
  prizeAmount: { fontSize: 15, fontWeight: '700', color: G.gold },
  table: {
    backgroundColor: G.bgSecondary,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: G.borderLight,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: G.bgTertiary,
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: G.borderGold,
  },
  headerCell: { color: G.gold, fontSize: 11, fontWeight: '700', textAlign: 'center', letterSpacing: 0.5 },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: G.borderLight,
  },
  userRow: { backgroundColor: 'rgba(212, 175, 55, 0.08)' },
  rankEmoji: { fontSize: 16 },
  rankNum: { fontSize: 13, fontWeight: '600', color: G.textSecondary, textAlign: 'center' },
  playerCell: { flex: 1, flexDirection: 'row', alignItems: 'center', gap: 6 },
  miniAvatar: { width: 24, height: 24, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  miniAvatarText: { color: '#FFF', fontSize: 9, fontWeight: '700' },
  playerName: { fontSize: 12, fontWeight: '600', color: G.textPrimary },
  playerElo: { fontSize: 10, color: G.textMuted },
  userText: { color: G.gold, fontWeight: '700' },
  cell: { fontSize: 12, color: G.textSecondary, textAlign: 'center' },
});
