import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

const G = Colors.gaming;

export default function FranceScreen() {
  return (
    <View style={styles.root}>
      <Text style={styles.title}>TOURNOIS EN FRANCE</Text>
      <Text style={styles.subtitle}>Chargement...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: G.bg, paddingBottom: 56 },
  title: { color: G.gold, fontSize: 20, fontWeight: '900', letterSpacing: 2 },
  subtitle: { color: G.textMuted, fontSize: 14, marginTop: 8 },
});
