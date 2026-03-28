import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { onlineTournaments } from '@/data/onlineTournaments';

const G = Colors.gaming;
const typeLabels: Record<string, string> = { blitz: 'Blitz', rapide: 'Rapide', classique: 'Classique' };

export default function MyTournamentsScreen() {
  const { user } = useUser();
  const router = useRouter();

  const registered = onlineTournaments.filter(t => user.registeredTournaments.includes(t.id));
  const inProgress = registered.filter(t => t.status === 'in_progress');
  const upcoming = registered.filter(t => t.status === 'open');
  const history = user.tournamentHistory;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        <Text style={styles.title}>MES TOURNOIS</Text>

        {/* In progress */}
        {inProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>EN COURS</Text>
            <View style={styles.cardsRow}>
              {inProgress.map(t => (
                <TouchableOpacity key={t.id} style={styles.card} onPress={() => router.push(`/online/${t.id}`)}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusDot, { backgroundColor: G.gold }]} />
                    <Text style={styles.cardName}>{t.name}</Text>
                  </View>
                  <Text style={styles.cardInfo}>{typeLabels[t.type]} - Ronde {t.currentRound}/{t.rounds}</Text>
                  <TouchableOpacity style={styles.playButton} onPress={() => router.push(`/game/${t.id}-r${t.currentRound}`)}>
                    <Ionicons name="play-circle" size={16} color={G.bg} />
                    <Text style={styles.playButtonText}>REJOUER</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>A VENIR</Text>
            <View style={styles.cardsRow}>
              {upcoming.map(t => {
                const diff = new Date(t.startTime).getTime() - Date.now();
                const hours = Math.floor(diff / 3600000);
                const mins = Math.floor((diff % 3600000) / 60000);
                return (
                  <TouchableOpacity key={t.id} style={styles.card} onPress={() => router.push(`/online/${t.id}`)}>
                    <View style={styles.cardHeader}>
                      <View style={[styles.statusDot, { backgroundColor: G.green }]} />
                      <Text style={styles.cardName}>{t.name}</Text>
                    </View>
                    <Text style={styles.cardInfo}>{typeLabels[t.type]} - Buy-in: {t.buyIn}€</Text>
                    <Text style={styles.countdown}>Commence dans {hours}h {mins}min</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>HISTORIQUE</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>Aucun historique</Text>
          ) : (
            <View style={styles.cardsRow}>
              {history.map((h, i) => (
                <View key={i} style={styles.card}>
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusDot, { backgroundColor: G.textMuted }]} />
                    <Text style={styles.cardName}>{h.tournamentName}</Text>
                  </View>
                  <Text style={styles.cardInfo}>{typeLabels[h.type]} - {new Date(h.date).toLocaleDateString('fr-FR')}</Text>
                  <View style={styles.resultRow}>
                    <Text style={styles.rankText}>#{h.rank}/{h.totalPlayers}</Text>
                    {h.earnings > 0 && <Text style={styles.earningsText}>+{h.earnings}€</Text>}
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {registered.length === 0 && history.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={40} color={G.textMuted} />
            <Text style={styles.emptyTitle}>Aucun tournoi</Text>
            <Text style={styles.emptySubtitle}>Inscrivez-vous à un tournoi pour commencer</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg },
  content: { padding: 16 },
  title: { fontSize: 18, fontWeight: '800', color: G.textPrimary, letterSpacing: 2, marginBottom: 16 },
  section: { marginBottom: 18 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: G.gold, letterSpacing: 1.5, marginBottom: 10 },
  cardsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  card: {
    backgroundColor: G.bgSecondary,
    borderRadius: 12,
    padding: 12,
    minWidth: 240,
    flex: 1,
    maxWidth: '48%' as any,
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 },
  statusDot: { width: 7, height: 7, borderRadius: 4 },
  cardName: { fontSize: 14, fontWeight: '700', color: G.textPrimary },
  cardInfo: { fontSize: 12, color: G.textSecondary, marginLeft: 13 },
  playButton: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    backgroundColor: G.gold, paddingHorizontal: 12, paddingVertical: 7,
    borderRadius: 8, alignSelf: 'flex-start', marginTop: 8, marginLeft: 13,
  },
  playButtonText: { color: G.bg, fontWeight: '800', fontSize: 11, letterSpacing: 0.5 },
  countdown: { fontSize: 12, color: G.gold, fontWeight: '600', marginTop: 4, marginLeft: 13 },
  resultRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 6, marginLeft: 13 },
  rankText: { fontSize: 13, fontWeight: '700', color: G.textPrimary },
  earningsText: { fontSize: 13, fontWeight: '700', color: G.gold },
  emptyContainer: { alignItems: 'center', paddingVertical: 40 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: G.textSecondary, marginTop: 10 },
  emptySubtitle: { fontSize: 13, color: G.textMuted, marginTop: 4 },
  emptyText: { fontSize: 13, color: G.textMuted },
});
