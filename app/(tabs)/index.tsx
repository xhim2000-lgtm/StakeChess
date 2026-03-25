import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import { WalletCard } from '@/components/WalletCard';
import { TournamentCard } from '@/components/TournamentCard';
import { onlineTournaments } from '@/data/onlineTournaments';
import { FilterType, FilterBuyIn, FilterStatus } from '@/types';

const typeFilters: { key: FilterType; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'blitz', label: 'Blitz' },
  { key: 'rapide', label: 'Rapide' },
  { key: 'classique', label: 'Classique' },
];

const buyInFilters: { key: FilterBuyIn; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: '5', label: '5€' },
  { key: '10', label: '10€' },
  { key: '25', label: '25€' },
  { key: '50+', label: '50€+' },
];

const statusFilters: { key: FilterStatus; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'open', label: 'Ouverts' },
  { key: 'in_progress', label: 'En cours' },
  { key: 'finished', label: 'Terminés' },
];

export default function TournamentsScreen() {
  const [typeFilter, setTypeFilter] = useState<FilterType>('all');
  const [buyInFilter, setBuyInFilter] = useState<FilterBuyIn>('all');
  const [statusFilter, setStatusFilter] = useState<FilterStatus>('all');

  const filtered = useMemo(() => {
    return onlineTournaments.filter(t => {
      if (typeFilter !== 'all' && t.type !== typeFilter) return false;
      if (statusFilter !== 'all' && t.status !== statusFilter) return false;
      if (buyInFilter !== 'all') {
        if (buyInFilter === '50+') {
          if (t.buyIn < 50) return false;
        } else {
          if (t.buyIn !== parseInt(buyInFilter)) return false;
        }
      }
      return true;
    });
  }, [typeFilter, buyInFilter, statusFilter]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <WalletCard />

      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Tournois en ligne</Text>

        {/* Type filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {typeFilters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, typeFilter === f.key && styles.filterChipActive]}
              onPress={() => setTypeFilter(f.key)}
            >
              <Text style={[styles.filterText, typeFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Buy-in filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {buyInFilters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, buyInFilter === f.key && styles.filterChipActive]}
              onPress={() => setBuyInFilter(f.key)}
            >
              <Text style={[styles.filterText, buyInFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Status filter */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow}>
          {statusFilters.map(f => (
            <TouchableOpacity
              key={f.key}
              style={[styles.filterChip, statusFilter === f.key && styles.filterChipActive]}
              onPress={() => setStatusFilter(f.key)}
            >
              <Text style={[styles.filterText, statusFilter === f.key && styles.filterTextActive]}>
                {f.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Aucun tournoi trouvé</Text>
          </View>
        ) : (
          filtered.map(t => <TournamentCard key={t.id} tournament={t} />)
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
  sectionTitle: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  filterRow: {
    marginBottom: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  filterText: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  filterTextActive: {
    color: Colors.white,
  },
  empty: {
    paddingVertical: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 16,
    color: Colors.textLight,
  },
});
