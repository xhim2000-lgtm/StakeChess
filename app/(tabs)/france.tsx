import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { franceTournaments, REGIONS, FranceTournament } from '@/data/franceTournaments';
import { PageBackground } from '@/components/PageBackground';
import { useLayout } from '@/hooks/useLayout';

const G = Colors.gaming;

const TYPE_LABELS: Record<string, string> = { blitz: 'Blitz', rapid: 'Rapide', classical: 'Classique' };
const TYPE_COLORS: Record<string, string> = { blitz: '#FFD700', rapid: '#00E5FF', classical: '#E040FB' };
const STATUS_LABELS: Record<string, string> = { open: 'OUVERT', filling: 'EN COURS', full: 'COMPLET', live: 'LIVE' };
const STATUS_COLORS: Record<string, string> = { open: G.green, filling: G.gold, full: G.red, live: '#FF3D3D' };
const FILTER_OPTIONS = ['all', 'blitz', 'rapid', 'classical'] as const;

function TournamentCard({ t }: { t: FranceTournament }) {
  const fill = (t.players.current / t.players.max) * 100;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.typeBadge, { borderColor: TYPE_COLORS[t.type] }]}>
          <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[t.type] }]}>{TYPE_LABELS[t.type]}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[t.status]}20`, borderColor: STATUS_COLORS[t.status] }]}>
          {t.status === 'live' && <View style={[styles.liveDot, { backgroundColor: STATUS_COLORS[t.status] }]} />}
          <Text style={[styles.statusText, { color: STATUS_COLORS[t.status] }]}>{STATUS_LABELS[t.status]}</Text>
        </View>
      </View>

      <Text style={styles.cardName}>{t.name}</Text>
      <View style={styles.cardInfoRow}>
        <Ionicons name="location-outline" size={12} color={G.textSecondary} />
        <Text style={styles.cardInfoText}>{t.venue}, {t.city}</Text>
      </View>
      <View style={styles.cardInfoRow}>
        <Ionicons name="calendar-outline" size={12} color={G.textSecondary} />
        <Text style={styles.cardInfoText}>{new Date(t.date).toLocaleDateString('fr-FR')} - {t.time}</Text>
      </View>

      <View style={styles.prizeRow}>
        <View style={styles.prizeItem}>
          <Text style={styles.prizeLabel}>Buy-in</Text>
          <Text style={styles.prizeValue}>{t.buyIn}€</Text>
        </View>
        <View style={styles.prizeDivider} />
        <View style={styles.prizeItem}>
          <Text style={styles.prizeLabel}>Prix</Text>
          <Text style={styles.prizeValueGold}>{t.prizePool.toLocaleString('fr-FR')}€</Text>
        </View>
      </View>

      <View style={styles.playersRow}>
        <Ionicons name="people-outline" size={11} color={G.textSecondary} />
        <Text style={styles.playersText}>{t.players.current}/{t.players.max}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${fill}%` as any }]} />
        </View>
      </View>

      <TouchableOpacity style={[styles.joinBtn, t.status === 'full' && styles.joinBtnDisabled]} disabled={t.status === 'full'}>
        <Ionicons name={t.status === 'full' ? 'close-circle' : 'enter-outline'} size={14} color={t.status === 'full' ? G.textMuted : G.bg} />
        <Text style={[styles.joinBtnText, t.status === 'full' && styles.joinBtnTextDisabled]}>
          {t.status === 'full' ? 'COMPLET' : "S'INSCRIRE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function FranceScreen() {
  const { isLandscape } = useLayout();
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<typeof FILTER_OPTIONS[number]>('all');

  const filteredTournaments = useMemo(() => {
    let list = franceTournaments;
    if (selectedRegion) list = list.filter(t => t.region === selectedRegion);
    if (filterType !== 'all') list = list.filter(t => t.type === filterType);
    return list;
  }, [selectedRegion, filterType]);

  const regionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of franceTournaments) {
      counts[t.region] = (counts[t.region] || 0) + 1;
    }
    return counts;
  }, []);

  const leftPanel = (
    <View style={[styles.leftPanel, !isLandscape && styles.leftPanelPortrait]}>
      <Text style={styles.pageTitle}>TOURNOIS EN FRANCE</Text>
      <Text style={styles.pageSubtitle}>{franceTournaments.length} tournois disponibles</Text>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.regionScroll}>
        <TouchableOpacity
          style={[styles.regionItem, !selectedRegion && styles.regionItemActive]}
          onPress={() => setSelectedRegion(null)}
        >
          <Text style={[styles.regionName, !selectedRegion && styles.regionNameActive]}>Toutes les regions</Text>
          <Text style={[styles.regionCount, !selectedRegion && styles.regionCountActive]}>{franceTournaments.length}</Text>
        </TouchableOpacity>

        {REGIONS.map(r => (
          <TouchableOpacity
            key={r}
            style={[styles.regionItem, selectedRegion === r && styles.regionItemActive]}
            onPress={() => setSelectedRegion(selectedRegion === r ? null : r)}
          >
            <Text style={[styles.regionName, selectedRegion === r && styles.regionNameActive]} numberOfLines={1}>{r}</Text>
            <Text style={[styles.regionCount, selectedRegion === r && styles.regionCountActive]}>{regionCounts[r] || 0}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );

  const rightPanel = (
    <View style={styles.rightPanel}>
      {/* Filters */}
      <View style={styles.filterRow}>
        {FILTER_OPTIONS.map(f => (
          <TouchableOpacity
            key={f}
            style={[styles.filterBtn, filterType === f && styles.filterBtnActive]}
            onPress={() => setFilterType(f)}
          >
            <Text style={[styles.filterBtnText, filterType === f && styles.filterBtnTextActive]}>
              {f === 'all' ? 'Tous' : TYPE_LABELS[f]}
            </Text>
          </TouchableOpacity>
        ))}
        <Text style={styles.resultCount}>{filteredTournaments.length} resultat{filteredTournaments.length > 1 ? 's' : ''}</Text>
      </View>

      {/* Tournament list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.tournamentList}>
        {filteredTournaments.length === 0 ? (
          <View style={styles.emptyBox}>
            <Ionicons name="search-outline" size={32} color={G.textMuted} />
            <Text style={styles.emptyText}>Aucun tournoi pour cette selection</Text>
          </View>
        ) : (
          filteredTournaments.map(t => <TournamentCard key={t.id} t={t} />)
        )}
      </ScrollView>
    </View>
  );

  return (
    <PageBackground variant="france" overlay={0.7}>
    <View style={[styles.root, !isLandscape && styles.rootPortrait]}>
      {leftPanel}
      {rightPanel}
    </View>
    </PageBackground>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, flexDirection: 'row', backgroundColor: G.bg, paddingBottom: 56 },
  rootPortrait: { flexDirection: 'column' },

  // Left panel - regions
  leftPanel: {
    width: '30%', padding: 16, gap: 8,
    borderRightWidth: 1, borderRightColor: G.borderGold, backgroundColor: 'rgba(0,0,0,0.3)',
  },
  leftPanelPortrait: {
    width: '100%', maxHeight: '35%',
    borderRightWidth: 0, borderBottomWidth: 1, borderBottomColor: G.borderGold,
  },
  pageTitle: { color: G.gold, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  pageSubtitle: { color: G.textMuted, fontSize: 11, fontWeight: '600' },
  regionScroll: { flex: 1, marginTop: 4 },
  regionItem: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, paddingHorizontal: 12, borderRadius: 8, marginBottom: 2,
  },
  regionItemActive: { backgroundColor: 'rgba(212,175,55,0.15)', borderWidth: 1, borderColor: G.borderGold },
  regionName: { color: G.textSecondary, fontSize: 12, fontWeight: '600', flex: 1, marginRight: 8 },
  regionNameActive: { color: G.gold },
  regionCount: { color: G.textMuted, fontSize: 11, fontWeight: '700' },
  regionCountActive: { color: G.gold },

  // Right panel - tournaments
  rightPanel: { flex: 1, padding: 16 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 },
  filterBtn: {
    paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14,
    borderWidth: 1, borderColor: G.borderLight, backgroundColor: 'rgba(255,255,255,0.03)',
  },
  filterBtnActive: { backgroundColor: G.gold, borderColor: G.gold },
  filterBtnText: { color: G.textSecondary, fontSize: 11, fontWeight: '700' },
  filterBtnTextActive: { color: G.bg },
  resultCount: { color: G.textMuted, fontSize: 10, fontWeight: '600', marginLeft: 'auto' },
  tournamentList: { gap: 10, paddingBottom: 16 },

  // Tournament card
  card: {
    backgroundColor: G.bgSecondary, borderRadius: 12, padding: 14,
    borderWidth: 1, borderColor: G.borderLight, gap: 8,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2 },
  typeBadgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  cardName: { color: G.textPrimary, fontSize: 16, fontWeight: '700' },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  cardInfoText: { color: G.textSecondary, fontSize: 11 },

  prizeRow: {
    flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 8,
    padding: 10, borderWidth: 1, borderColor: G.borderGold,
  },
  prizeItem: { flex: 1, alignItems: 'center' },
  prizeDivider: { width: 1, backgroundColor: G.borderGold },
  prizeLabel: { color: G.textMuted, fontSize: 8, fontWeight: '600', textTransform: 'uppercase' },
  prizeValue: { color: G.textPrimary, fontSize: 15, fontWeight: '700' },
  prizeValueGold: { color: G.gold, fontSize: 15, fontWeight: '700' },

  playersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  playersText: { color: G.textSecondary, fontSize: 10, fontWeight: '500' },
  progressBar: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: G.gold, borderRadius: 2 },

  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: G.gold, paddingVertical: 10, borderRadius: 10,
  },
  joinBtnDisabled: { backgroundColor: 'rgba(255,255,255,0.05)' },
  joinBtnText: { color: G.bg, fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  joinBtnTextDisabled: { color: G.textMuted },

  emptyBox: { alignItems: 'center', paddingVertical: 40, gap: 8 },
  emptyText: { color: G.textMuted, fontSize: 13 },
});
