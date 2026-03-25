import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { WalletCard } from '@/components/WalletCard';
import { useUser } from '@/contexts/UserContext';
import { onlineTournaments } from '@/data/onlineTournaments';

const typeLabels: Record<string, string> = {
  blitz: 'Blitz',
  rapide: 'Rapide',
  classique: 'Classique',
};

export default function MyTournamentsScreen() {
  const { user } = useUser();
  const router = useRouter();

  const registered = onlineTournaments.filter(t =>
    user.registeredTournaments.includes(t.id)
  );

  const inProgress = registered.filter(t => t.status === 'in_progress');
  const upcoming = registered.filter(t => t.status === 'open');

  const history = user.tournamentHistory;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <WalletCard />

      <View style={styles.content}>
        <Text style={styles.title}>Mes Tournois</Text>

        {/* In progress */}
        {inProgress.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>En cours</Text>
            {inProgress.map(t => (
              <TouchableOpacity
                key={t.id}
                style={styles.card}
                onPress={() => router.push(`/online/${t.id}`)}
              >
                <View style={styles.cardHeader}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.warning }]} />
                  <Text style={styles.cardName}>{t.name}</Text>
                </View>
                <Text style={styles.cardInfo}>
                  {typeLabels[t.type]} - Ronde {t.currentRound}/{t.rounds}
                </Text>
                <TouchableOpacity
                  style={styles.playButton}
                  onPress={() => router.push(`/game/${t.id}-r${t.currentRound}`)}
                >
                  <Ionicons name="play-circle" size={18} color={Colors.white} />
                  <Text style={styles.playButtonText}>Rejouer</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>A venir</Text>
            {upcoming.map(t => {
              const start = new Date(t.startTime);
              const diff = start.getTime() - Date.now();
              const hours = Math.floor(diff / 3600000);
              const mins = Math.floor((diff % 3600000) / 60000);
              return (
                <TouchableOpacity
                  key={t.id}
                  style={styles.card}
                  onPress={() => router.push(`/online/${t.id}`)}
                >
                  <View style={styles.cardHeader}>
                    <View style={[styles.statusDot, { backgroundColor: Colors.success }]} />
                    <Text style={styles.cardName}>{t.name}</Text>
                  </View>
                  <Text style={styles.cardInfo}>
                    {typeLabels[t.type]} - Buy-in: {t.buyIn}€
                  </Text>
                  <Text style={styles.countdown}>
                    Commence dans {hours}h {mins}min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* History */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historique</Text>
          {history.length === 0 ? (
            <Text style={styles.emptyText}>Aucun historique</Text>
          ) : (
            history.map((h, i) => (
              <View key={i} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={[styles.statusDot, { backgroundColor: Colors.textLight }]} />
                  <Text style={styles.cardName}>{h.tournamentName}</Text>
                </View>
                <Text style={styles.cardInfo}>
                  {typeLabels[h.type]} - {new Date(h.date).toLocaleDateString('fr-FR')}
                </Text>
                <View style={styles.resultRow}>
                  <Text style={styles.rankText}>
                    #{h.rank}/{h.totalPlayers}
                  </Text>
                  {h.earnings > 0 && (
                    <Text style={styles.earningsText}>+{h.earnings}€</Text>
                  )}
                </View>
              </View>
            ))
          )}
        </View>

        {registered.length === 0 && history.length === 0 && (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={48} color={Colors.textLight} />
            <Text style={styles.emptyTitle}>Aucun tournoi</Text>
            <Text style={styles.emptySubtitle}>
              Inscrivez-vous à un tournoi pour commencer
            </Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  cardName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
  },
  cardInfo: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginLeft: 16,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    alignSelf: 'flex-start',
    marginTop: 8,
    marginLeft: 16,
  },
  playButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 13,
  },
  countdown: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '500',
    marginTop: 4,
    marginLeft: 16,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginLeft: 16,
  },
  rankText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  earningsText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
  },
});
