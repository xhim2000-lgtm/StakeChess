import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { Ionicons } from '@expo/vector-icons';
import { PageBackground } from '@/components/PageBackground';
import { useLayout } from '@/hooks/useLayout';

const G = Colors.gaming;

const typeLabels: Record<string, string> = {
  blitz: 'Blitz', rapide: 'Rapide', classique: 'Classique',
};

export default function ProfileScreen() {
  const { user } = useUser();
  const { isLandscape } = useLayout();
  const winRate = user.tournamentsPlayed > 0
    ? Math.round((user.wins / user.tournamentsPlayed) * 100) : 0;

  return (
    <PageBackground variant="profile" overlay={0.7}>
    <View style={[styles.root, !isLandscape && { flexDirection: 'column' }]}>
      {/* Left/Top: Avatar + Key Stats */}
      <View style={[styles.leftPanel, !isLandscape && styles.topPanel]}>
        <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
          <Text style={styles.avatarText}>{user.avatar}</Text>
        </View>
        <Text style={styles.pseudo}>{user.pseudo}</Text>
        <Text style={styles.eloText}>Elo {user.elo}</Text>

        <View style={styles.balanceCard}>
          <Ionicons name="wallet-outline" size={16} color={G.gold} />
          <Text style={styles.balanceAmount}>{user.balance.toFixed(2)}€</Text>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
        </View>

        <View style={styles.miniStats}>
          {[
            { v: user.wins, l: 'Victoires' },
            { v: user.draws, l: 'Nuls' },
            { v: user.losses, l: 'Défaites' },
          ].map((s, i) => (
            <View key={i} style={styles.miniStatItem}>
              <Text style={styles.miniStatValue}>{s.v}</Text>
              <Text style={styles.miniStatLabel}>{s.l}</Text>
            </View>
          ))}
        </View>

        <View style={styles.winRateBox}>
          <Text style={styles.winRateLabel}>WIN RATE</Text>
          <Text style={styles.winRateValue}>{winRate}%</Text>
          <View style={styles.winRateBar}>
            <View style={[styles.winRateFill, { width: `${winRate}%` as any }]} />
          </View>
        </View>
      </View>

      {/* Right: Stats + History */}
      <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
        <View style={styles.rightContent}>
          <Text style={styles.sectionTitle}>STATISTIQUES</Text>
          <View style={styles.statsGrid}>
            {[
              { label: 'Tournois joués', value: `${user.tournamentsPlayed}`, icon: 'trophy-outline', color: G.gold },
              { label: 'Gains totaux', value: `${user.totalEarnings.toFixed(0)}€`, icon: 'cash-outline', color: G.green },
              { label: 'Elo actuel', value: `${user.elo}`, icon: 'trending-up-outline', color: '#00E5FF' },
              { label: 'Parties', value: `${user.wins + user.draws + user.losses}`, icon: 'game-controller-outline', color: '#E040FB' },
            ].map((s, i) => (
              <View key={i} style={[styles.statCard, !isLandscape && { width: '46%' }]}>
                <Ionicons name={s.icon as any} size={18} color={s.color} />
                <Text style={styles.statCardValue}>{s.value}</Text>
                <Text style={styles.statCardLabel}>{s.label}</Text>
              </View>
            ))}
          </View>

          <Text style={[styles.sectionTitle, { marginTop: 20 }]}>HISTORIQUE DES TOURNOIS</Text>
          {user.tournamentHistory.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="document-text-outline" size={32} color={G.textMuted} />
              <Text style={styles.emptyText}>Aucun historique</Text>
            </View>
          ) : (
            user.tournamentHistory.map((h, i) => (
              <View key={i} style={styles.historyCard}>
                <View style={styles.historyHeader}>
                  <Text style={styles.historyName}>{h.tournamentName}</Text>
                  <View style={styles.historyBadge}>
                    <Text style={styles.historyBadgeText}>{typeLabels[h.type]}</Text>
                  </View>
                </View>
                <View style={styles.historyFooter}>
                  <Text style={styles.historyDate}>{new Date(h.date).toLocaleDateString('fr-FR')}</Text>
                  <Text style={styles.historyRank}>#{h.rank}/{h.totalPlayers}</Text>
                  <Text style={[styles.historyEarnings, h.earnings > 0 && { color: G.green }]}>
                    {h.earnings > 0 ? `+${h.earnings}€` : '0€'}
                  </Text>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </View>
    </PageBackground>
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
  root: { flex: 1, flexDirection: 'row', backgroundColor: G.bg, paddingBottom: 56 },
  leftPanel: {
    width: '30%', padding: 20, alignItems: 'center', justifyContent: 'center', gap: 10,
    borderRightWidth: 1, borderRightColor: G.borderGold, backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topPanel: {
    width: '100%', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
    paddingVertical: 16, paddingHorizontal: 20, gap: 12,
    borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: G.borderGold,
  },
  avatar: {
    width: 72, height: 72, borderRadius: 36, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: G.gold,
  },
  avatarText: { color: '#FFF', fontSize: 24, fontWeight: '700' },
  pseudo: { color: G.textPrimary, fontSize: 20, fontWeight: '800' },
  eloText: { color: G.gold, fontSize: 14, fontWeight: '600' },
  balanceCard: {
    alignItems: 'center', gap: 4, backgroundColor: 'rgba(212,175,55,0.1)',
    borderRadius: 12, padding: 14, width: '100%', borderWidth: 1, borderColor: G.borderGold,
  },
  balanceAmount: { color: G.gold, fontSize: 28, fontWeight: '800' },
  balanceLabel: { color: G.textMuted, fontSize: 10, fontWeight: '600' },
  miniStats: { flexDirection: 'row', gap: 12, width: '100%', justifyContent: 'center' },
  miniStatItem: { alignItems: 'center' },
  miniStatValue: { color: G.textPrimary, fontSize: 16, fontWeight: '700' },
  miniStatLabel: { color: G.textMuted, fontSize: 9, fontWeight: '600' },
  winRateBox: {
    width: '100%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 12,
    alignItems: 'center', gap: 4,
  },
  winRateLabel: { color: G.textMuted, fontSize: 9, fontWeight: '700', letterSpacing: 1 },
  winRateValue: { color: G.gold, fontSize: 22, fontWeight: '800' },
  winRateBar: { width: '100%', height: 4, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  winRateFill: { height: '100%', backgroundColor: G.gold, borderRadius: 2 },

  rightPanel: { flex: 1 },
  rightContent: { padding: 20 },
  sectionTitle: { color: G.textPrimary, fontSize: 14, fontWeight: '800', letterSpacing: 1.5, marginBottom: 12 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  statCard: {
    width: '23%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 14,
    alignItems: 'center', gap: 4, borderWidth: 1, borderColor: G.borderLight,
  },
  statCardValue: { color: G.textPrimary, fontSize: 18, fontWeight: '700' },
  statCardLabel: { color: G.textMuted, fontSize: 9, fontWeight: '600', textAlign: 'center' },
  emptyBox: { alignItems: 'center', paddingVertical: 30, gap: 8 },
  emptyText: { color: G.textMuted, fontSize: 13 },
  historyCard: {
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: G.borderLight,
  },
  historyHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  historyName: { color: G.textPrimary, fontSize: 14, fontWeight: '600', flex: 1 },
  historyBadge: { backgroundColor: 'rgba(212,175,55,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  historyBadgeText: { color: G.gold, fontSize: 10, fontWeight: '600' },
  historyFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  historyDate: { color: G.textMuted, fontSize: 12 },
  historyRank: { color: G.textSecondary, fontSize: 13, fontWeight: '600' },
  historyEarnings: { color: G.textMuted, fontSize: 13, fontWeight: '600' },
  statBox: { alignItems: 'center', gap: 4, padding: 10 },
  statValue: { color: G.textPrimary, fontSize: 18, fontWeight: '700' },
  statLabel: { color: G.textMuted, fontSize: 9, fontWeight: '600' },
});
