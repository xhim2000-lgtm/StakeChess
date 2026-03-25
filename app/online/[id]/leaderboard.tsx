import React, { useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { getTournamentById } from '@/data/onlineTournaments';
import { getPlayerById } from '@/data/players';
import { LeaderboardEntry } from '@/types';

const RANK_EMOJI: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' };

export default function LeaderboardScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user } = useUser();

  const tournament = getTournamentById(id);

  // Generate simulated Swiss leaderboard
  const leaderboard: LeaderboardEntry[] = useMemo(() => {
    if (!tournament) return [];
    const entries: LeaderboardEntry[] = tournament.registeredPlayerIds.map((pid, idx) => {
      const player = getPlayerById(pid);
      if (!player) return null;

      // Simulate scores based on player elo (higher elo = generally better score)
      const maxScore = tournament.currentRound;
      const eloFactor = (player.elo - 1200) / 1200;
      const randomness = (Math.sin(idx * 7.3 + player.elo) + 1) / 4; // deterministic pseudo-random
      const rawScore = maxScore * (eloFactor * 0.6 + randomness);
      const score = Math.round(Math.min(rawScore, maxScore) * 2) / 2; // half-point increments

      const wins = Math.floor(score);
      const draws = (score - wins) * 2;
      const losses = tournament.currentRound - wins - draws;
      const buchholz = Math.round((score * 3 + player.elo / 500) * 10) / 10;

      return {
        rank: 0,
        playerId: pid,
        player,
        score: Math.max(0, score),
        buchholz,
        gamesPlayed: tournament.currentRound,
        wins: Math.max(0, wins),
        draws: Math.max(0, Math.round(draws)),
        losses: Math.max(0, Math.round(losses)),
      };
    }).filter(Boolean) as LeaderboardEntry[];

    // Sort by score desc, then buchholz desc
    entries.sort((a, b) => b.score - a.score || b.buchholz - a.buchholz);
    entries.forEach((e, i) => { e.rank = i + 1; });

    return entries;
  }, [tournament]);

  if (!tournament) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Tournoi introuvable</Text>
      </View>
    );
  }

  const isFinished = tournament.status === 'finished';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>{tournament.name}</Text>
        <Text style={styles.subtitle}>
          {isFinished ? 'Classement final' : `Ronde ${tournament.currentRound}/${tournament.rounds}`}
        </Text>

        {/* Prize info for finished tournaments */}
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

        {/* Leaderboard table */}
        <View style={styles.table}>
          {/* Header */}
          <View style={styles.tableHeader}>
            <Text style={[styles.headerCell, { width: 40 }]}>#</Text>
            <Text style={[styles.headerCell, { flex: 1 }]}>Joueur</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>Score</Text>
            <Text style={[styles.headerCell, { width: 50 }]}>Buch.</Text>
            <Text style={[styles.headerCell, { width: 40 }]}>V</Text>
            <Text style={[styles.headerCell, { width: 40 }]}>N</Text>
            <Text style={[styles.headerCell, { width: 40 }]}>D</Text>
          </View>

          {/* Rows */}
          {leaderboard.map(entry => {
            const isUser = entry.playerId === user.id;
            return (
              <View
                key={entry.playerId}
                style={[styles.tableRow, isUser && styles.userRow]}
              >
                <View style={{ width: 40, alignItems: 'center' }}>
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
                    <Text style={[styles.playerName, isUser && styles.userText]}>
                      {entry.player.pseudo}
                    </Text>
                    <Text style={styles.playerElo}>{entry.player.elo}</Text>
                  </View>
                </View>
                <Text style={[styles.cell, { width: 50, fontWeight: '600' }]}>{entry.score}</Text>
                <Text style={[styles.cell, { width: 50 }]}>{entry.buchholz}</Text>
                <Text style={[styles.cell, { width: 40, color: Colors.success }]}>{entry.wins}</Text>
                <Text style={[styles.cell, { width: 40 }]}>{entry.draws}</Text>
                <Text style={[styles.cell, { width: 40, color: Colors.danger }]}>{entry.losses}</Text>
              </View>
            );
          })}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.danger },
  title: { fontSize: 20, fontWeight: '600', color: Colors.text },
  subtitle: { fontSize: 14, color: Colors.textSecondary, marginBottom: 16, marginTop: 2 },
  prizeCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 10,
  },
  prizeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  prizeEmoji: { fontSize: 22, marginRight: 10 },
  prizeName: { flex: 1, fontSize: 15, fontWeight: '500', color: Colors.text },
  prizeAmount: { fontSize: 16, fontWeight: '600', color: Colors.success },
  table: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: Colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 8,
  },
  headerCell: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  userRow: {
    backgroundColor: '#EBF4F8',
  },
  rankEmoji: { fontSize: 18 },
  rankNum: { fontSize: 14, fontWeight: '500', color: Colors.textSecondary, textAlign: 'center' },
  playerCell: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  miniAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniAvatarText: { color: Colors.white, fontSize: 10, fontWeight: '600' },
  playerName: { fontSize: 13, fontWeight: '500', color: Colors.text },
  playerElo: { fontSize: 11, color: Colors.textSecondary },
  userText: { color: Colors.primary, fontWeight: '600' },
  cell: { fontSize: 13, color: Colors.text, textAlign: 'center' },
});
