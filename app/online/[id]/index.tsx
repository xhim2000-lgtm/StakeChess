import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { getTournamentById } from '@/data/onlineTournaments';
import { getPlayerById } from '@/data/players';

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

        {/* Key info grid */}
        <View style={styles.infoGrid}>
          <InfoBox label="Buy-in" value={`${tournament.buyIn}€`} icon="ticket-outline" />
          <InfoBox label="Prize Pool" value={`${tournament.prizePool}€`} icon="trophy-outline" color={Colors.warning} />
          <InfoBox label="Cadence" value={tournament.timeControl.label} icon="time-outline" />
          <InfoBox label="Rondes" value={`${tournament.rounds}`} icon="layers-outline" />
          <InfoBox label="Joueurs" value={`${tournament.currentPlayers}/${tournament.maxPlayers}`} icon="people-outline" />
          <InfoBox label="Début" value={startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })} icon="calendar-outline" />
        </View>

        {/* Prize distribution */}
        <View style={styles.prizeCard}>
          <Text style={styles.sectionTitle}>Répartition des gains</Text>
          <View style={styles.prizeRow}>
            <PrizeItem rank="1er" emoji="🥇" amount={tournament.prizePool * 0.5} color={Colors.gold} />
            <PrizeItem rank="2ème" emoji="🥈" amount={tournament.prizePool * 0.3} color={Colors.silver} />
            <PrizeItem rank="3ème" emoji="🥉" amount={tournament.prizePool * 0.2} color={Colors.bronze} />
          </View>
        </View>

        {/* Players list */}
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

        {/* Actions */}
        <View style={styles.actions}>
          {canJoin && (
            <TouchableOpacity style={styles.joinButton} onPress={() => setShowConfirm(true)}>
              <Text style={styles.joinText}>Rejoindre ({tournament.buyIn}€)</Text>
            </TouchableOpacity>
          )}
          {canLeave && (
            <TouchableOpacity style={styles.leaveButton} onPress={handleLeave}>
              <Text style={styles.leaveText}>Se désinscrire</Text>
            </TouchableOpacity>
          )}
          {insufficientBalance && (
            <View style={styles.insufficientBadge}>
              <Ionicons name="warning" size={18} color={Colors.danger} />
              <Text style={styles.insufficientText}>Solde insuffisant ({user.balance.toFixed(2)}€)</Text>
            </View>
          )}
          {registered && (
            <View style={styles.registeredBadge}>
              <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
              <Text style={styles.registeredText}>Vous êtes inscrit</Text>
            </View>
          )}
          {(tournament.status === 'in_progress' || tournament.status === 'finished') && (
            <TouchableOpacity
              style={styles.leaderboardButton}
              onPress={() => router.push(`/online/${tournament.id}/leaderboard`)}
            >
              <Ionicons name="podium-outline" size={18} color={Colors.white} />
              <Text style={styles.leaderboardText}>Voir le classement</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Confirmation modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirmer l'inscription</Text>
            <Text style={styles.modalText}>
              Rejoindre <Text style={{ fontWeight: '600' }}>{tournament.name}</Text> ?
            </Text>
            <Text style={styles.modalText}>
              Buy-in : <Text style={{ fontWeight: '600', color: Colors.primary }}>{tournament.buyIn}€</Text>
            </Text>
            <Text style={styles.modalBalance}>
              Solde après inscription : {(user.balance - tournament.buyIn).toFixed(2)}€
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
      <Ionicons name={icon as any} size={20} color={color || Colors.primary} />
      <Text style={infoStyles.value}>{value}</Text>
      <Text style={infoStyles.label}>{label}</Text>
    </View>
  );
}

function PrizeItem({ rank, emoji, amount, color }: { rank: string; emoji: string; amount: number; color: string }) {
  return (
    <View style={prizeStyles.item}>
      <Text style={prizeStyles.emoji}>{emoji}</Text>
      <Text style={[prizeStyles.amount, { color }]}>{amount.toFixed(0)}€</Text>
      <Text style={prizeStyles.rank}>{rank}</Text>
    </View>
  );
}

const infoStyles = StyleSheet.create({
  box: {
    width: '30%',
    backgroundColor: Colors.card,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  value: { fontSize: 16, fontWeight: '600', color: Colors.text, marginTop: 4 },
  label: { fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
});

const prizeStyles = StyleSheet.create({
  item: { flex: 1, alignItems: 'center' },
  emoji: { fontSize: 28 },
  amount: { fontSize: 18, fontWeight: '600', marginTop: 4 },
  rank: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: 16 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  errorText: { fontSize: 16, color: Colors.danger },
  headerCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  typeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  typeText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  name: { fontSize: 22, fontWeight: '600', color: Colors.text, marginBottom: 6 },
  description: { fontSize: 14, color: Colors.textSecondary, lineHeight: 20 },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  prizeCard: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  prizeRow: { flexDirection: 'row' },
  playersSection: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  playerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  playerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  playerAvatarText: { color: Colors.white, fontSize: 12, fontWeight: '600' },
  playerName: { flex: 1, fontSize: 14, fontWeight: '500', color: Colors.text },
  playerElo: { fontSize: 14, color: Colors.textSecondary, fontWeight: '500' },
  actions: { gap: 10, marginBottom: 30 },
  joinButton: {
    backgroundColor: Colors.success,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  joinText: { color: Colors.white, fontSize: 16, fontWeight: '600' },
  leaveButton: {
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.danger,
  },
  leaveText: { color: Colors.danger, fontSize: 15, fontWeight: '600' },
  insufficientBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FEF2F2',
    padding: 12,
    borderRadius: 10,
  },
  insufficientText: { color: Colors.danger, fontSize: 14 },
  registeredBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
  },
  registeredText: { color: Colors.success, fontSize: 14, fontWeight: '500' },
  leaderboardButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: Colors.primary,
    padding: 14,
    borderRadius: 12,
  },
  leaderboardText: { color: Colors.white, fontSize: 15, fontWeight: '600' },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    width: '85%',
    maxWidth: 360,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', color: Colors.text, marginBottom: 12 },
  modalText: { fontSize: 15, color: Colors.text, marginBottom: 6 },
  modalBalance: { fontSize: 14, color: Colors.textSecondary, marginTop: 8, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  cancelButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelText: { color: Colors.textSecondary, fontWeight: '600' },
  confirmButton: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    backgroundColor: Colors.success,
  },
  confirmText: { color: Colors.white, fontWeight: '600' },
});
