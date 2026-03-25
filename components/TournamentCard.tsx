import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { Tournament } from '@/types';

interface TournamentCardProps {
  tournament: Tournament;
}

const typeLabels: Record<string, string> = {
  blitz: 'Blitz',
  rapide: 'Rapide',
  classique: 'Classique',
};

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  open: { label: 'Inscription ouverte', color: Colors.success, bg: '#ECFDF5' },
  in_progress: { label: 'En cours', color: Colors.warning, bg: '#FFFBEB' },
  finished: { label: 'Terminé', color: Colors.textSecondary, bg: '#F3F4F6' },
};

export function TournamentCard({ tournament }: TournamentCardProps) {
  const router = useRouter();
  const status = statusConfig[tournament.status];
  const fillPercent = (tournament.currentPlayers / tournament.maxPlayers) * 100;

  const startDate = new Date(tournament.startTime);
  const timeStr = startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
  const dateStr = startDate.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/online/${tournament.id}`)}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{typeLabels[tournament.type]}</Text>
          </View>
          <Text style={styles.timeControl}>{tournament.timeControl.label}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
          <Text style={[styles.statusText, { color: status.color }]}>{status.label}</Text>
        </View>
      </View>

      <Text style={styles.name}>{tournament.name}</Text>

      <View style={styles.infoRow}>
        <View style={styles.infoItem}>
          <Ionicons name="ticket-outline" size={16} color={Colors.textSecondary} />
          <Text style={styles.infoText}>Buy-in: {tournament.buyIn}€</Text>
        </View>
        <View style={styles.infoItem}>
          <Ionicons name="trophy-outline" size={16} color={Colors.warning} />
          <Text style={[styles.infoText, { color: Colors.warning, fontWeight: '600' }]}>
            {tournament.prizePool}€
          </Text>
        </View>
      </View>

      <View style={styles.prizeRow}>
        <Text style={styles.prizeLabel}>
          🥇 {(tournament.prizePool * 0.5).toFixed(0)}€
        </Text>
        <Text style={styles.prizeLabel}>
          🥈 {(tournament.prizePool * 0.3).toFixed(0)}€
        </Text>
        <Text style={styles.prizeLabel}>
          🥉 {(tournament.prizePool * 0.2).toFixed(0)}€
        </Text>
      </View>

      <View style={styles.progressSection}>
        <View style={styles.progressHeader}>
          <Text style={styles.playersText}>
            <Ionicons name="people-outline" size={14} color={Colors.textSecondary} />{' '}
            {tournament.currentPlayers}/{tournament.maxPlayers}
          </Text>
          <Text style={styles.dateText}>
            {dateStr} - {timeStr}
          </Text>
        </View>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${fillPercent}%` }]} />
        </View>
      </View>

      <View style={styles.footer}>
        <Text style={styles.roundsText}>
          {tournament.rounds} rondes
          {tournament.status === 'in_progress' && ` (ronde ${tournament.currentRound}/${tournament.rounds})`}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  typeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  timeControl: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  name: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  prizeRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  prizeLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressSection: {
    marginBottom: 8,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  playersText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  dateText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.border,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: 3,
  },
  footer: {
    marginTop: 4,
  },
  roundsText: {
    fontSize: 12,
    color: Colors.textLight,
  },
});
