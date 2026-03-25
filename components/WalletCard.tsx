import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { RechargeModal } from './RechargeModal';

export function WalletCard() {
  const { user } = useUser();
  const [showRecharge, setShowRecharge] = useState(false);

  return (
    <>
      <TouchableOpacity style={styles.container} onPress={() => setShowRecharge(true)}>
        <View style={styles.left}>
          <Ionicons name="wallet-outline" size={22} color={Colors.white} />
          <Text style={styles.label}>Solde</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>{user.balance.toFixed(2)}€</Text>
          <Ionicons name="add-circle" size={22} color={Colors.white} />
        </View>
      </TouchableOpacity>
      <RechargeModal visible={showRecharge} onClose={() => setShowRecharge(false)} />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    borderRadius: 12,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  label: {
    color: Colors.white,
    fontSize: 15,
    fontWeight: '500',
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  amount: {
    color: Colors.white,
    fontSize: 20,
    fontWeight: '600',
  },
});
