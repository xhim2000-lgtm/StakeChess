import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';

const G = Colors.gaming;

interface RechargeModalProps {
  visible: boolean;
  onClose: () => void;
}

const quickAmounts = [10, 25, 50, 100, 250];

export function RechargeModal({ visible, onClose }: RechargeModalProps) {
  const { addBalance } = useUser();
  const [customAmount, setCustomAmount] = useState('');
  const [confirmed, setConfirmed] = useState(false);

  const handleRecharge = (amount: number) => {
    if (amount <= 0) return;
    addBalance(amount);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setCustomAmount('');
      onClose();
    }, 1500);
  };

  const handleCustomRecharge = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0) {
      Alert.alert('Erreur', 'Veuillez entrer un montant valide.');
      return;
    }
    handleRecharge(amount);
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={onClose}
      >
        <TouchableOpacity activeOpacity={1} style={styles.modal}>
          {/* Close button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Text style={styles.closeIcon}>{'\u2715'}</Text>
          </TouchableOpacity>

          {confirmed ? (
            <View style={styles.confirmation}>
              <Ionicons name="checkmark-circle" size={64} color={G.green} />
              <Text style={styles.confirmText}>Rechargement effectue !</Text>
            </View>
          ) : (
            <>
              <Text style={styles.title}>Recharger le solde</Text>

              <Text style={styles.subtitle}>Montants rapides</Text>
              <View style={styles.quickGrid}>
                {quickAmounts.map(amount => (
                  <TouchableOpacity
                    key={amount}
                    style={styles.quickButton}
                    onPress={() => handleRecharge(amount)}
                  >
                    <Text style={styles.quickButtonText}>+{amount}€</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.subtitle}>Montant personnalise</Text>
              <View style={styles.customRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Montant en €"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  placeholderTextColor={G.textMuted}
                />
                <TouchableOpacity style={styles.customButton} onPress={handleCustomRecharge}>
                  <Text style={styles.customButtonText}>Recharger</Text>
                </TouchableOpacity>
              </View>
            </>
          )}
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
    width: '85%',
    maxWidth: 400,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeIcon: {
    color: G.gold,
    fontSize: 18,
    fontWeight: '700',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: G.textPrimary,
    letterSpacing: 1,
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
    color: G.textSecondary,
    marginBottom: 8,
    marginTop: 4,
    letterSpacing: 0.5,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  quickButton: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderWidth: 1,
    borderColor: G.borderGold,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    minWidth: 70,
    alignItems: 'center',
  },
  quickButtonText: {
    color: G.gold,
    fontSize: 15,
    fontWeight: '700',
  },
  customRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: G.borderLight,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 15,
    color: G.textPrimary,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  customButton: {
    backgroundColor: G.gold,
    paddingHorizontal: 18,
    borderRadius: 10,
    justifyContent: 'center',
  },
  customButtonText: {
    color: G.bg,
    fontWeight: '800',
    fontSize: 13,
  },
  confirmation: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  confirmText: {
    fontSize: 18,
    fontWeight: '700',
    color: G.green,
    marginTop: 12,
  },
});
