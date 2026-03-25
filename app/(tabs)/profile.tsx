import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { WalletCard } from '@/components/WalletCard';
import { PlayerStats } from '@/components/PlayerStats';
import { useUser } from '@/contexts/UserContext';

const typeLabels: Record<string, string> = {
  blitz: 'Blitz',
  rapide: 'Rapide',
  classique: 'Classique',
};

export default function ProfileScreen() {
  const { user } = useUser();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <WalletCard />

      <View style={styles.content}>
        {/* Avatar & name */}
        <View style={styles.avatarSection}>
          <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
            <Text style={styles.avatarText}>{user.avatar}</Text>
          </View>
          <Text style={styles.pseudo}>{user.pseudo}</Text>
          <Text style={styles.eloText}>Elo {user.elo}</Text>
        </View>

        {/* Balance highlight */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Solde disponible</Text>
          <Text style={styles.balanceAmount}>{user.balance.toFixed(2)}€</Text>
        </View>

        {/* Stats */}
        <Text style={styles.sectionTitle}>Statistiques</Text>
        <PlayerStats
          elo={user.elo}
          tournamentsPlayed={user.tournamentsPlayed}
          wins={user.wins}
          draws={user.draws}
          losses={user.losses}
          totalEarnings={user.totalEarnings}
        />

        {/* Tournament history */}
        <Text style={[styles.sectionTitle, { marginTop: 20 }]}>Historique des tournois</Text>
        {user.tournamentHistory.length === 0 ? (
          <Text style={styles.emptyText}>Aucun historique</Text>
        ) : (
          user.tournamentHistory.map((h, i) => (
            <View key={i} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <Text style={styles.historyName}>{h.tournamentName}</Text>
                <Text style={styles.historyType}>{typeLabels[h.type]}</Text>
              </View>
              <View style={styles.historyFooter}>
                <Text style={styles.historyDate}>
                  {new Date(h.date).toLocaleDateString('fr-FR')}
                </Text>
                <Text style={styles.historyRank}>#{h.rank}/{h.totalPlayers}</Text>
                {h.earnings > 0 ? (
                  <Text style={styles.historyEarnings}>+{h.earnings}€</Text>
                ) : (
                  <Text style={styles.historyNoEarnings}>0€</Text>
                )}
              </View>
            </View>
          ))
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
  avatarSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  avatarText: {
    color: Colors.white,
    fontSize: 24,
    fontWeight: '600',
  },
  pseudo: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
  },
  eloText: {
    fontSize: 15,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  balanceCard: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
  },
  balanceAmount: {
    color: Colors.white,
    fontSize: 32,
    fontWeight: '600',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  historyCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  historyName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  historyType: {
    fontSize: 12,
    color: Colors.primary,
    fontWeight: '500',
    backgroundColor: '#EBF4F8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  historyFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyDate: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  historyRank: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  historyEarnings: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.success,
  },
  historyNoEarnings: {
    fontSize: 14,
    color: Colors.textLight,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.textLight,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
