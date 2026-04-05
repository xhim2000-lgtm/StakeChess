import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Modal, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { getTournamentById } from '@/data/onlineTournaments';
import { getPlayerById } from '@/data/players';
import { useLayout } from '@/hooks/useLayout';

const G = Colors.gaming;
const typeLabels: Record<string, string> = { blitz: 'Blitz', rapide: 'Rapide', classique: 'Classique' };

export default function TournamentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { isLandscape } = useLayout();
  const { user, registerForTournament, unregisterFromTournament, isRegistered } = useUser();
  const [showConfirm, setShowConfirm] = useState(false);

  const tournament = getTournamentById(id);
  if (!tournament) {
    return (
      <View style={styles.errorBox}>
        <Ionicons name="alert-circle-outline" size={40} color={G.red} />
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
      Alert.alert('Inscription confirmée', `${tournament.buyIn}€ déduits.`);
    }
  };

  const handleLeave = () => {
    Alert.alert('Se désinscrire', `Quitter ${tournament.name} ?`, [
      { text: 'Non', style: 'cancel' },
      { text: 'Oui', onPress: () => unregisterFromTournament(tournament.id, tournament.buyIn) },
    ]);
  };

  const startDate = new Date(tournament.startTime);

  return (
    <View style={[styles.root, !isLandscape && { flexDirection: 'column' }]}>
      {/* Left/Top: Tournament Info */}
      <View style={[styles.leftPanel, !isLandscape && styles.topPanel]}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.leftContent}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={18} color={G.gold} />
              <Text style={styles.backText}>Retour</Text>
            </TouchableOpacity>

            <View style={styles.typeBadge}>
              <Text style={styles.typeText}>{typeLabels[tournament.type]}</Text>
            </View>
            <Text style={styles.name}>{tournament.name}</Text>
            <Text style={styles.description}>{tournament.description}</Text>

            {/* Info Grid */}
            <View style={styles.infoGrid}>
              {[
                { icon: 'ticket-outline', label: 'Buy-in', value: `${tournament.buyIn}€` },
                { icon: 'trophy-outline', label: 'Prize Pool', value: `${tournament.prizePool}€` },
                { icon: 'time-outline', label: 'Cadence', value: tournament.timeControl.label },
                { icon: 'layers-outline', label: 'Rondes', value: `${tournament.rounds}` },
                { icon: 'people-outline', label: 'Joueurs', value: `${tournament.currentPlayers}/${tournament.maxPlayers}` },
                { icon: 'calendar-outline', label: 'Début', value: startDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) },
              ].map((item, i) => (
                <View key={i} style={styles.infoBox}>
                  <Ionicons name={item.icon as any} size={16} color={G.gold} />
                  <Text style={styles.infoValue}>{item.value}</Text>
                  <Text style={styles.infoLabel}>{item.label}</Text>
                </View>
              ))}
            </View>

            {/* Prize Distribution */}
            <Text style={styles.sectionTitle}>RÉPARTITION DES GAINS</Text>
            <View style={styles.prizeRow}>
              {[
                { rank: '1er', pct: 0.5, color: G.gold },
                { rank: '2ème', pct: 0.3, color: G.textSecondary },
                { rank: '3ème', pct: 0.2, color: '#CD7F32' },
              ].map((p, i) => (
                <View key={i} style={styles.prizeItem}>
                  <Text style={[styles.prizeAmount, { color: p.color }]}>{(tournament.prizePool * p.pct).toFixed(0)}€</Text>
                  <Text style={styles.prizeRank}>{p.rank}</Text>
                </View>
              ))}
            </View>

            {/* Actions */}
            <View style={styles.actions}>
              {canJoin && (
                <TouchableOpacity style={styles.joinBtn} onPress={() => setShowConfirm(true)}>
                  <Ionicons name="flash" size={16} color={G.bg} />
                  <Text style={styles.joinText}>REJOINDRE ({tournament.buyIn}€)</Text>
                </TouchableOpacity>
              )}
              {canLeave && (
                <TouchableOpacity style={styles.leaveBtn} onPress={handleLeave}>
                  <Text style={styles.leaveText}>SE DÉSINSCRIRE</Text>
                </TouchableOpacity>
              )}
              {insufficientBalance && (
                <View style={styles.warningBadge}>
                  <Ionicons name="warning" size={14} color={G.red} />
                  <Text style={styles.warningText}>Solde insuffisant ({user.balance.toFixed(2)}€)</Text>
                </View>
              )}
              {registered && (
                <View style={styles.regBadge}>
                  <Ionicons name="checkmark-circle" size={14} color={G.green} />
                  <Text style={styles.regText}>Vous êtes inscrit</Text>
                </View>
              )}
              {(tournament.status === 'in_progress' || tournament.status === 'finished') && (
                <TouchableOpacity style={styles.leaderboardBtn} onPress={() => router.push(`/online/${tournament.id}/leaderboard`)}>
                  <Ionicons name="podium-outline" size={16} color={G.bg} />
                  <Text style={styles.leaderboardText}>CLASSEMENT</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      {/* Right: Players List (60%) */}
      <ScrollView style={styles.rightPanel} showsVerticalScrollIndicator={false}>
        <View style={styles.rightContent}>
          <Text style={styles.sectionTitle}>JOUEURS INSCRITS ({tournament.currentPlayers})</Text>
          {tournament.registeredPlayerIds.map((pid, i) => {
            const player = getPlayerById(pid);
            if (!player) return null;
            return (
              <View key={pid} style={styles.playerRow}>
                <Text style={styles.playerRankNum}>{i + 1}</Text>
                <View style={[styles.playerAvatar, { backgroundColor: player.avatarColor }]}>
                  <Text style={styles.playerAvatarText}>{player.avatar}</Text>
                </View>
                <Text style={styles.playerName}>{player.pseudo}</Text>
                <Text style={styles.playerElo}>Elo {player.elo}</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Confirmation Modal */}
      <Modal visible={showConfirm} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>Confirmer l'inscription</Text>
            <Text style={styles.modalText}>
              Rejoindre <Text style={{ fontWeight: '700', color: G.gold }}>{tournament.name}</Text> ?
            </Text>
            <Text style={styles.modalInfo}>Buy-in : {tournament.buyIn}€</Text>
            <Text style={styles.modalBalance}>Solde après : {(user.balance - tournament.buyIn).toFixed(2)}€</Text>
            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setShowConfirm(false)}>
                <Text style={styles.modalCancelText}>Annuler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalConfirm} onPress={handleJoin}>
                <Text style={styles.modalConfirmText}>Confirmer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: G.bg },
  errorBox: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
  errorText: { color: G.red, fontSize: 16, fontWeight: '600' },

  // Left panel
  leftPanel: { width: '40%', borderRightWidth: 1, borderRightColor: G.borderGold, backgroundColor: 'rgba(0,0,0,0.3)' },
  topPanel: { width: '100%', borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: G.borderGold, maxHeight: '50%' },
  leftContent: { padding: 20, gap: 12 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 },
  backText: { color: G.gold, fontSize: 12, fontWeight: '600' },
  typeBadge: { backgroundColor: 'rgba(212,175,55,0.15)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, alignSelf: 'flex-start' },
  typeText: { color: G.gold, fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  name: { color: G.textPrimary, fontSize: 22, fontWeight: '800' },
  description: { color: G.textSecondary, fontSize: 13, lineHeight: 18 },

  infoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  infoBox: {
    width: '30%', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 10,
    alignItems: 'center', gap: 3, borderWidth: 1, borderColor: G.borderLight,
  },
  infoValue: { color: G.textPrimary, fontSize: 14, fontWeight: '700' },
  infoLabel: { color: G.textMuted, fontSize: 9, fontWeight: '600' },

  sectionTitle: { color: G.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5 },
  prizeRow: { flexDirection: 'row', gap: 12 },
  prizeItem: { flex: 1, alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: G.borderLight },
  prizeAmount: { fontSize: 18, fontWeight: '700' },
  prizeRank: { color: G.textMuted, fontSize: 10, marginTop: 2 },

  actions: { gap: 8, marginTop: 4 },
  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: G.gold, padding: 14, borderRadius: 12,
  },
  joinText: { color: G.bg, fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  leaveBtn: { padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: G.red },
  leaveText: { color: G.red, fontSize: 13, fontWeight: '700' },
  warningBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(255,61,61,0.1)', padding: 10, borderRadius: 10 },
  warningText: { color: G.red, fontSize: 12 },
  regBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'rgba(0,200,83,0.1)', padding: 10, borderRadius: 10 },
  regText: { color: G.green, fontSize: 12, fontWeight: '500' },
  leaderboardBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: G.gold, padding: 12, borderRadius: 12,
  },
  leaderboardText: { color: G.bg, fontSize: 13, fontWeight: '800' },

  // Right panel
  rightPanel: { flex: 1 },
  rightContent: { padding: 20 },
  playerRow: {
    flexDirection: 'row', alignItems: 'center', gap: 10, paddingVertical: 10,
    borderBottomWidth: 1, borderBottomColor: G.borderLight,
  },
  playerRankNum: { color: G.textMuted, fontSize: 12, fontWeight: '700', width: 20, textAlign: 'center' },
  playerAvatar: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center' },
  playerAvatarText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  playerName: { flex: 1, color: G.textPrimary, fontSize: 14, fontWeight: '500' },
  playerElo: { color: G.gold, fontSize: 13, fontWeight: '600' },

  // Modal
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'center', alignItems: 'center' },
  modal: { backgroundColor: G.bgSecondary, borderRadius: 16, padding: 24, width: '40%', maxWidth: 400, borderWidth: 1, borderColor: G.borderGold },
  modalTitle: { color: G.textPrimary, fontSize: 18, fontWeight: '700', marginBottom: 12 },
  modalText: { color: G.textSecondary, fontSize: 14, marginBottom: 4 },
  modalInfo: { color: G.gold, fontSize: 14, fontWeight: '600', marginBottom: 4 },
  modalBalance: { color: G.textMuted, fontSize: 13, marginBottom: 20 },
  modalActions: { flexDirection: 'row', gap: 12 },
  modalCancel: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', borderWidth: 1, borderColor: G.borderLight },
  modalCancelText: { color: G.textSecondary, fontWeight: '600' },
  modalConfirm: { flex: 1, padding: 12, borderRadius: 10, alignItems: 'center', backgroundColor: G.gold },
  modalConfirmText: { color: G.bg, fontWeight: '700' },
});
