import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { onlineTournaments } from '@/data/onlineTournaments';
import { PageBackground } from '@/components/PageBackground';
import { useLayout } from '@/hooks/useLayout';

const G = Colors.gaming;
const typeLabels: Record<string, string> = { blitz: 'Blitz', rapide: 'Rapide', classique: 'Classique' };

export default function MyTournamentsScreen() {
  const { user } = useUser();
  const router = useRouter();
  const { isLandscape } = useLayout();

  const registered = onlineTournaments.filter(t => user.registeredTournaments.includes(t.id));
  const inProgress = registered.filter(t => t.status === 'in_progress');
  const upcoming = registered.filter(t => t.status === 'open');
  const history = user.tournamentHistory;

  const renderCard = (
    t: { id: string; name: string; type: string; currentRound?: number; rounds?: number; buyIn?: number; status?: string },
    statusColor: string,
    extra?: React.ReactNode,
  ) => (
    <TouchableOpacity
      key={t.id}
      style={styles.card}
      onPress={() => router.push(`/online/${t.id}`)}
    >
      <View style={styles.cardHeader}>
        <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
        <Text style={styles.cardName}>{t.name}</Text>
        <View style={styles.cardTypeBadge}>
          <Text style={styles.cardTypeText}>{typeLabels[t.type]}</Text>
        </View>
      </View>
      {extra}
    </TouchableOpacity>
  );

  return (
    <PageBackground variant="dark" overlay={0.7}>
    <View style={[styles.root, !isLandscape && { flexDirection: 'column' }]}>
      {/* Left/Top: Summary */}
      <View style={[styles.leftPanel, !isLandscape && styles.topPanel]}>
        <Ionicons name="trophy" size={40} color={G.gold} />
        <Text style={styles.leftTitle}>MES TOURNOIS</Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{inProgress.length}</Text>
            <Text style={styles.summaryLabel}>En cours</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{upcoming.length}</Text>
            <Text style={styles.summaryLabel}>À venir</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryValue}>{history.length}</Text>
            <Text style={styles.summaryLabel}>Terminés</Text>
          </View>
        </View>
      </View>

      {/* Right: Lists */}
      <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
        <View style={styles.rightContent}>
          {inProgress.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>EN COURS</Text>
              {inProgress.map(t => renderCard(t, G.gold,
                <View style={styles.cardExtra}>
                  <Text style={styles.cardInfo}>Ronde {t.currentRound}/{t.rounds}</Text>
                  <TouchableOpacity
                    style={styles.playBtn}
                    onPress={() => router.push(`/game/${t.id}-r${t.currentRound}`)}
                  >
                    <Ionicons name="play" size={12} color={G.bg} />
                    <Text style={styles.playBtnText}>JOUER</Text>
                  </TouchableOpacity>
                </View>,
              ))}
            </>
          )}

          {upcoming.length > 0 && (
            <>
              <Text style={styles.sectionTitle}>À VENIR</Text>
              {upcoming.map(t => {
                const diff = new Date(t.startTime).getTime() - Date.now();
                const h = Math.floor(diff / 3600000);
                const m = Math.floor((diff % 3600000) / 60000);
                return renderCard(t, G.green,
                  <View style={styles.cardExtra}>
                    <Text style={styles.cardInfo}>Buy-in: {t.buyIn}€</Text>
                    <Text style={styles.countdown}>Dans {h}h {m}min</Text>
                  </View>,
                );
              })}
            </>
          )}

          <Text style={styles.sectionTitle}>HISTORIQUE</Text>
          {history.length === 0 ? (
            <View style={styles.emptyBox}>
              <Ionicons name="document-text-outline" size={28} color={G.textMuted} />
              <Text style={styles.emptyText}>Aucun historique</Text>
            </View>
          ) : (
            history.map((h, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusDot, { backgroundColor: G.textMuted }]} />
                  <Text style={styles.cardName}>{h.tournamentName}</Text>
                </View>
                <View style={styles.cardExtra}>
                  <Text style={styles.cardInfo}>{new Date(h.date).toLocaleDateString('fr-FR')}</Text>
                  <Text style={styles.rankText}>#{h.rank}/{h.totalPlayers}</Text>
                  {h.earnings > 0 && <Text style={styles.earningsText}>+{h.earnings}€</Text>}
                </View>
              </View>
            ))
          )}

          {registered.length === 0 && history.length === 0 && (
            <View style={styles.emptyBox}>
              <Ionicons name="trophy-outline" size={40} color={G.textMuted} />
              <Text style={styles.emptyTitle}>Aucun tournoi</Text>
              <Text style={styles.emptyText}>Inscrivez-vous pour commencer</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </View>
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: G.bg, paddingBottom: 56 },
  leftPanel: {
    width: '30%', padding: 20, alignItems: 'center', justifyContent: 'center', gap: 16,
    borderRightWidth: 1, borderRightColor: G.borderGold, backgroundColor: 'rgba(0,0,0,0.3)',
  },
  topPanel: {
    width: '100%', paddingVertical: 16, paddingHorizontal: 20, gap: 12,
    borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: G.borderGold,
  },
  leftTitle: { color: G.gold, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  summaryRow: { flexDirection: 'row', gap: 16 },
  summaryItem: { alignItems: 'center' },
  summaryValue: { color: G.textPrimary, fontSize: 24, fontWeight: '800' },
  summaryLabel: { color: G.textMuted, fontSize: 9, fontWeight: '600', letterSpacing: 0.5 },

  rightPanel: { flex: 1 },
  rightContent: { padding: 20 },
  sectionTitle: { color: G.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5, marginBottom: 10, marginTop: 10 },

  card: {
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 12, padding: 14, marginBottom: 8,
    borderWidth: 1, borderColor: G.borderLight,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  cardName: { color: G.textPrimary, fontSize: 14, fontWeight: '600', flex: 1 },
  cardTypeBadge: { backgroundColor: 'rgba(212,175,55,0.15)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  cardTypeText: { color: G.gold, fontSize: 10, fontWeight: '600' },
  cardExtra: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8, marginLeft: 16 },
  cardInfo: { color: G.textSecondary, fontSize: 12 },
  countdown: { color: G.gold, fontSize: 12, fontWeight: '600' },
  playBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: G.gold,
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8,
  },
  playBtnText: { color: G.bg, fontSize: 10, fontWeight: '800' },
  rankText: { color: G.textPrimary, fontSize: 13, fontWeight: '600' },
  earningsText: { color: G.green, fontSize: 13, fontWeight: '600' },
  emptyBox: { alignItems: 'center', paddingVertical: 30, gap: 6 },
  emptyTitle: { color: G.textSecondary, fontSize: 16, fontWeight: '600' },
  emptyText: { color: G.textMuted, fontSize: 12 },
});
