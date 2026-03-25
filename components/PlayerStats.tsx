import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';

interface PlayerStatsProps {
  elo: number;
  tournamentsPlayed: number;
  wins: number;
  draws: number;
  losses: number;
  totalEarnings: number;
}

export function PlayerStats({ elo, tournamentsPlayed, wins, draws, losses, totalEarnings }: PlayerStatsProps) {
  const totalGames = wins + draws + losses;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : '0';

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatBox icon="star" color={Colors.warning} label="Elo" value={elo.toString()} />
        <StatBox icon="trophy" color={Colors.primary} label="Tournois" value={tournamentsPlayed.toString()} />
        <StatBox icon="cash" color={Colors.success} label="Gains" value={`${totalEarnings}€`} />
      </View>
      <View style={styles.row}>
        <StatBox icon="checkmark-circle" color={Colors.success} label="Victoires" value={wins.toString()} />
        <StatBox icon="remove-circle" color={Colors.textLight} label="Nulles" value={draws.toString()} />
        <StatBox icon="close-circle" color={Colors.danger} label="Défaites" value={losses.toString()} />
      </View>
      <View style={styles.winRateContainer}>
        <Text style={styles.winRateLabel}>Win rate</Text>
        <Text style={styles.winRateValue}>{winRate}%</Text>
        <View style={styles.winRateBar}>
          <View style={[styles.winRateFill, { width: `${winRate}%` as any }]} />
        </View>
      </View>
    </View>
  );
}

function StatBox({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon as any} size={20} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 4,
  },
  statLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  winRateContainer: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  winRateLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
  },
  winRateValue: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.primary,
    marginBottom: 8,
  },
  winRateBar: {
    height: 8,
    backgroundColor: Colors.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  winRateFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
});
