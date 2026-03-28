import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { getTournamentById } from '@/data/onlineTournaments';
import { getPlayerById } from '@/data/players';

const G = Colors.gaming;

const typeLabels: Record<string, string> = {
  blitz: 'Blitz',
  rapide: 'Rapide',
  classique: 'Classique',
};

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user, registerForTournament, unregisterFromTournament, isRegistered } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  const tournament = getTournamentById(id);
  if (!tournament) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Tournoi introuvable</Text>
      </View>
    );
  }

  const registered = isRegistered(tournament.id);
  const canJoin = tournament.status === 'open' && !registered && user.balance >= tournament.buyIn
    && tournament.currentPlayers < tournament.maxPlayers;
  const canLeave = tournament.status === 'open' && registered;
  const insufficientBalance = tournament.status === 'open' && !registered && user.balance < tournament.buyIn;

  const handleJoin = () => {
    const success = registerForTournament(tournament.id, tournament.buyIn);
    if (success) {
      setShowConfirm(false);
      Alert.alert('Inscription confirmée', `Vous avez rejoint ${tournament.name}. ${tournament.buyIn}€ déduits.`);
    }
  };

  const handleLeave = () => {
    Alert.alert('Se désinscrire', `Voulez-vous quitter ${tournament.name} ? Vous serez remboursé de ${tournament.buyIn}€.`, [
      { text: 'Non', style: 'cancel' },
      {
        text: 'Oui',
        onPress: () => unregisterFromTournament(tournament.id, tournament.buyIn),
      },
    ]);
  };

  const startDate = new Date(tournament.startTime);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.content}>
        {/* Header info */}
        <View style={styles.headerCard}>
          <View style={styles.typeBadge}>
            <Text style={styles.typeText}>{typeLabels[tournament.type]}</Text>
          </View>
          <Text style={styles.name}>{tournament.name}</Text>
          <Text style={styles.description}>{tournament.description}</Text>
        </View>

        {/* Landscape: two-column layout */}
        <View style={styles.columnsRow}>
          {/* Left column: info + prizes */}
          <View style={styles.column}>
            {/* Key info grid */}
            <View style={styles.infoGrid}>
              <InfoBox label="Buy-in" value={`${tournament.buyIn}€`} icon="ticket-outline" />
              <InfoBox label="Prize Pool" value={`${tournament.prizePool}€`} icon="trophy-outline" color={G.gold} />
              <InfoBox label="Cadence" value={tournament.timeControl.label} icon="time-outline" />
              <InfoBox label="Rondes" value={`${tournament.rounds}`} icon="layers-outline" />
              <InfoBox label="Joueurs" value={`${tournament.currentPlayers}/${tournament.maxPlayers}`} icon="people-outline" />
              <InfoBox label="Début" value={startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} icon="calendar-outline" />
            </View>

            {/* Prize distribution */}
            <View style={styles.prizeCard}>
              <Text style={styles.sectionTitle}>Répartition des gains</Text>
              <View style={styles.prizeRow}>
                <PrizeItem rank="1er" emoji="🥇" amount={tournament.prizePool * 0.5} />
                <PrizeItem rank="2ème" emoji="🥈" amount={tournament.prizePool * 0.3} />
                <PrizeItem rank="3ème" emoji="🥉" amount={tournament.prizePool * 0.2} />
              </View>
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {canJoin && (
                <TouchableOpacity style={styles.joinButton} onPress={() => setShowConfirm(true)}>
                  <Ionicons name="flash" size={18} color={G.bg} />
                  <Text style={styles.joinText}>REJOINDRE ({tournament.buyIn}€)</Text>
                </TouchableOpacity>
              )}
              {canLeave && (
                <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
                  <Text style={styles.leaveText}>Se désinscrire</Text>
                </TouchableOpacity>
              )}
              {insufficientBalance && (
                <View style={styles.insufficientBadge}>
                  <Ionicons name="warning" size={16} color={G.red} />
                  <Text style={styles.insufficientText}>Solde insuffisant ({user.balance.toFixed(2)}€)</Text>
                </View>
              )}
              {registered && (
                <View style={styles.registeredBadge}>
                  <Ionicons name="checkmark-circle" size={16} color={G.green} />
                  <Text style={styles.registeredText}>Vous êtes inscrit</Text>
                </View>
              )}
              {(tournament.status === 'in_progress' || tournament.status === 'finished') && (
                <TouchableOpacity
                  style={styles.leaderboardButton}
                  onPress={() => router.push(`/online/${tournament.id}/leaderboard`)}
                >
                  <Ionicons name="podium-outline" size={16} color={G.bg} />
                  <Text style={styles.leaderboardText}>CLASSEMENT</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Right column: players list */}
          <View style={styles.column}>
            <View style={styles.playersSection}>
              <Text style={styles.sectionTitle}>Joueurs inscrits ({tournament.currentPlayers})</Text>
              {tournament.registeredPlayerIds.map(pid => {
                const player = getPlayerById(pid);
                if (!player) return null;
                return (
                  <View key={pid} style={styles.playerRow}>
                    <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor }]}>
                      <Text style={styles.playerAvatarText}>{player.avatar}</Text>
                    </View>
                    <Text style={styles.playerName}>{player.pseudo}</Text>
                    <Text style={styles.playerElo}>{player.elo}</Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* Confirmation modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirmer l'inscription</Text>
            <Text style={styles.modalText}>
              Rejoindre <Text style={{ fontWeight: '700', color: G.gold }}>{tournament.name}</Text> ?
            </Text>
            <Text style={styles.modalText}>
              Buy-in : <Text style={{ fontWeight: '700', color: G.gold }}>{tournament.buyIn}€</Text>
            </Text>
            <Text style={styles.modalBalance}>
              Solde après : {(user.balance - tournament.buyIn).toFixed(2)}€
            </Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setShowConfirm(false)}>
                <Text style={styles.cancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.confirmButton} onPress={handleJoin}>
                <Text style={styles.confirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

function InfoBox({ label, value, icon, color }: { label: string; value: string; icon: string; color?: string }) {
  return (
    <View style={infoStyles.box}>
      <Ionicons name={icon as any} size={18} color={color || G.gold} />
      <Text style={infoStyles.value}>{value}</Text>
      <Text style={infoStyles.label}>{label}</Text>
    </View>
  );
}

function PrizeItem({ rank, emoji, amount }: { rank: string; emoji: string; amount: number }) {
  return (
    <View style={prizeStyles.item}>
      <Text style={prizeStyles.emoji}>{emoji}</Text>
      <Text style={prizeStyles.amount}>{amount.toFixed(0)}€</Text>
      <Text style={prizeStyles.rank}>{rank}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  box: {
    width: '30%',
    backgroundColor: G.bgTertiary,
    borderRadius: 10,
    padding: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  value: { fontSize: 15, fontWeight: '700', color: G.textPrimary, marginTop: 3 },
  label: { fontSize: 10, color: G.textSecondary, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.5 },
});

const prizeStyles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center' },
  emoji: { fontSize: 24 },
  amount: { fontSize: 16, fontWeight: '700', color: G.gold, marginTop: 4 },
  rank: { fontSize: 11, color: G.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: G.bg },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: G.bg },
  errorText: { fontSize: 16, color: G.red },

  headerCard: {
    backgroundColor: G.bgSecondary,
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  typeBadge: {
    backgroundColor: G.gold,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: { color: G.bg, fontSize: 11, fontWeight: '800', letterSpacing: 1 },
  name: { fontSize: 20, fontWeight: '800', color: G.textPrimary, marginBottom: 4 },
  description: { fontSize: 13, color: G.textSecondary, lineHeight: 18 },

  columnsRow: { flexDirection: 'row', gap: 14 },
  column: { flex: 1 },

  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 14,
    justifyContent: 'space-between',
  },
  prizeCard: {
    backgroundColor: G.bgSecondary,
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: G.gold, marginBottom: 10, letterSpacing: 0.5 },
  prizeRow: { flexDirection: 'row' },

  playersSection: {
    backgroundColor: G.bgSecondary,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: G.borderLight,
  },
  playerAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  playerAvatarText: { color: '#FFF', fontSize: 10, fontWeight: '700' },
  playerName: { flex: 1, fontSize: 13, fontWeight: '500', color: G.textPrimary },
  playerElo: { fontSize: 13, color: G.gold, fontWeight: '600' },

  actions: { gap: 8 },
  joinButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: G.gold,
    padding: 14,
    borderRadius: 10,
    shadowColor: G.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  joinText: { color: G.bg, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  leaveButton: {
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: G.red,
  },
  leaveText: { color: G.red, fontSize: 13, fontWeight: '700' },
  insufficientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,61,61,0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255,61,61,0.3)',
  },
  insufficientText: { color: G.red, fontSize: 12 },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0,200,83,0.1)',
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(0,200,83,0.3)',
  },
  registeredText: { color: G.green, fontSize: 13, fontWeight: '600' },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: G.gold,
    padding: 12,
    borderRadius: 10,
  },
  leaderboardText: { color: G.bg, fontSize: 13, fontWeight: '800', letterSpacing: 1 },

  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: G.bgSecondary,
    borderRadius: 16,
    padding: 24,
    width: '50%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: G.textPrimary, marginBottom: 12 },
  modalText: { fontSize: 14, color: G.textSecondary, marginBottom: 6 },
  modalBalance: { fontSize: 13, color: G.textMuted, marginTop: 8, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  cancelText: { color: G.textSecondary, fontWeight: '600' },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: G.gold,
  },
  confirmText: { color: G.bg, fontWeight: '800' },
});
