import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';

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
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.modal}>
          {confirmed ? (
            <View style={styles.confirmation}>
              <Ionicons name="checkmark-circle" size={64} color={Colors.success} />
              <Text style={styles.confirmText}>Rechargement effectué !</Text>
            </View>
          ) : (
            <>
              <View style={styles.header}>
                <Text style={styles.title}>Recharger le solde</Text>
                <TouchableOpacity onPress={onClose}>
                  <Ionicons name="close" size={24} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>

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

              <Text style={styles.subtitle}>Montant personnalisé</Text>
              <View style={styles.customRow}>
                <TextInput
                  style={styles.input}
                  placeholder="Montant en €"
                  keyboardType="numeric"
                  value={customAmount}
                  onChangeText={setCustomAmount}
                  placeholderTextColor={Colors.textLight}
                />
                <TouchableOpacity style={styles.customButton} onPress={handleCustomRecharge}>
                  <Text style={styles.customButtonText}>Recharger</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.paypalButton}>
                <Text style={styles.paypalText}>Payer via PayPal (simulation)</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    minHeight: 380,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textSecondary,
    marginBottom: 10,
    marginTop: 8,
  },
  quickGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginBottom: 12,
  },
  quickButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    minWidth: 80,
    alignItems: 'center',
  },
  quickButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  customRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    color: Colors.text,
  },
  customButton: {
    backgroundColor: Colors.success,
    paddingHorizontal: 20,
    borderRadius: 10,
    justifyContent: 'center',
  },
  customButtonText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 15,
  },
  paypalButton: {
    backgroundColor: '#0070BA',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  paypalText: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '600',
  },
  confirmation: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  confirmText: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.success,
    marginTop: 16,
  },
});
