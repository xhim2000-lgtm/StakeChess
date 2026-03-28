import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';

const G = Colors.gaming;
const typeLabels: Record<string, string> = { blitz: 'Blitz', rapide: 'Rapide', classique: 'Classique' };

export default function ProfileScreen() {
  const { user } = useUser();
  const totalGames = user.wins + user.draws + user.losses;
  const winRate = totalGames > 0 ? ((user.wins / totalGames) * 100).toFixed(1) : '0';

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Landscape: avatar+balance left, stats right */}
        <View style={styles.topRow}>
          {/* Left: identity + balance */}
          <View style={styles.identityBlock}>
            <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
              <Text style={styles.avatarText}>{user.avatar}</Text>
            </View>
            <View>
              <Text style={styles.pseudo}>{user.pseudo}</Text>
              <Text style={styles.eloText}>ELO {user.elo}</Text>
            </View>
            <View style={styles.balanceChip}>
              <Ionicons name="wallet" size={16} color={G.gold} />
              <Text style={styles.balanceAmount}>{user.balance.toFixed(2)}€</Text>
            </View>
          </View>

          {/* Right: stats grid */}
          <View style={styles.statsGrid}>
            <StatBox icon="trophy" color={G.gold} label="Tournois" value={user.tournamentsPlayed.toString()} />
            <StatBox icon="checkmark-circle" color={G.green} label="Victoires" value={user.wins.toString()} />
            <StatBox icon="remove-circle" color={G.textMuted} label="Nulles" value={user.draws.toString()} />
            <StatBox icon="close-circle" color={G.red} label="Défaites" value={user.losses.toString()} />
            <StatBox icon="cash" color={G.gold} label="Gains" value={`${user.totalEarnings}€`} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>{winRate}%</Text>
              <Text style={styles.statLabel}>Win Rate</Text>
              <View style={styles.winRateBar}>
                <View style={[styles.winRateFill, { width: `${winRate}%` as any }]} />
              </View>
            </View>
          </View>
        </View>

        {/* Tournament history */}
        <Text style={styles.sectionTitle}>HISTORIQUE DES TOURNOIS</Text>
        {user.tournamentHistory.length === 0 ? (
          <Text style={styles.emptyText}>Aucun historique</Text>
        ) : (
          <View style={styles.historyGrid}>
            {user.tournamentHistory.map((h, i) => (
              <View key={i} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyName} numberOfLines={1}>{h.tournamentName}</Text>
                  <View style={styles.historyTypeBadge}>
                    <Text style={styles.historyType}>{typeLabels[h.type]}</Text>
                  </View>
                </View>
                <View style={styles.historyFooter}>
                  <Text style={styles.historyDate}>{new Date(h.date).toLocaleDateString('fr-FR')}</Text>
                  <Text style={styles.historyRank}>#{h.rank}/{h.totalPlayers}</Text>
                  {h.earnings > 0 ? (
                    <Text style={styles.historyEarnings}>+{h.earnings}€</Text>
                  ) : (
                    <Text style={styles.historyNoEarnings}>0€</Text>
                  )}
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

function StatBox({ icon, color, label, value }: { icon: string; color: string; label: string; value: string }) {
  return (
    <View style={styles.statBox}>
      <Ionicons name={icon as any} size={18} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg },
  content: { padding: 16 },
  topRow: { flexDirection: 'row', gap: 16, marginBottom: 20 },
  identityBlock: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  avatar: { width: 52, height: 52, borderRadius: 26, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: G.borderGold },
  avatarText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
  pseudo: { fontSize: 18, fontWeight: '800', color: G.textPrimary },
  eloText: { fontSize: 12, color: G.gold, fontWeight: '600', letterSpacing: 1 },
  balanceChip: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: G.bgTertiary, borderRadius: 10, paddingHorizontal: 12, paddingVertical: 8,
    borderWidth: 1, borderColor: G.borderGold, marginLeft: 8,
  },
  balanceAmount: { color: G.gold, fontSize: 18, fontWeight: '700' },
  statsGrid: { flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  statBox: {
    backgroundColor: G.bgSecondary, borderRadius: 10, padding: 10, alignItems: 'center',
    borderWidth: 1, borderColor: G.borderLight, minWidth: 90, flex: 1,
  },
  statValue: { fontSize: 16, fontWeight: '700', color: G.textPrimary, marginTop: 2 },
  statLabel: { fontSize: 9, color: G.textMuted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
  winRateBar: { width: '100%', height: 4, backgroundColor: G.bgTertiary, borderRadius: 2, marginTop: 4, overflow: 'hidden' },
  winRateFill: { height: '100%', backgroundColor: G.gold, borderRadius: 2 },
  sectionTitle: { fontSize: 14, fontWeight: '800', color: G.gold, letterSpacing: 1.5, marginBottom: 10 },
  historyGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  historyCard: {
    backgroundColor: G.bgSecondary, borderRadius: 10, padding: 12,
    borderWidth: 1, borderColor: G.borderLight, minWidth: 250, flex: 1, maxWidth: '32%' as any,
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyName: { fontSize: 13, fontWeight: '700', color: G.textPrimary, flex: 1, marginRight: 8 },
  historyTypeBadge: { backgroundColor: G.bgTertiary, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1, borderColor: G.borderGold },
  historyType: { fontSize: 10, color: G.gold, fontWeight: '600' },
  historyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyDate: { fontSize: 11, color: G.textMuted },
  historyRank: { fontSize: 13, fontWeight: '700', color: G.textPrimary },
  historyEarnings: { fontSize: 13, fontWeight: '700', color: G.gold },
  historyNoEarnings: { fontSize: 13, color: G.textMuted },
  emptyText: { fontSize: 13, color: G.textMuted, textAlign: 'center', paddingVertical: 20 },
});
