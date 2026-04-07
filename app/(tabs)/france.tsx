import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FranceMapInteractive } from '@/components/FranceMapInteractive';
import { franceTournaments, FranceTournament } from '@/data/franceTournaments';

const GOLD = '#D4AF37';
const TYPE_LABELS: Record<string, string> = { blitz: 'Blitz', rapid: 'Rapide', classical: 'Classique' };
const TYPE_COLORS: Record<string, string> = { blitz: '#E8A800', rapid: '#0088CC', classical: '#8B5CF6' };
const STATUS_LABELS: Record<string, string> = { open: 'OUVERT', filling: 'EN COURS', full: 'COMPLET', live: 'LIVE' };
const STATUS_COLORS: Record<string, string> = { open: '#22C55E', filling: '#F59E0B', full: '#EF4444', live: '#EF4444' };

function TournamentCard({ t }: { t: FranceTournament }) {
  const fill = (t.players.current / t.players.max) * 100;
  return (
    <View style={styles.card}>
      <View style={styles.cardTop}>
        <View style={[styles.typeBadge, { borderColor: TYPE_COLORS[t.type], backgroundColor: `${TYPE_COLORS[t.type]}12` }]}>
          <Text style={[styles.typeBadgeText, { color: TYPE_COLORS[t.type] }]}>{TYPE_LABELS[t.type]}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: `${STATUS_COLORS[t.status]}15`, borderColor: STATUS_COLORS[t.status] }]}>
          {t.status === 'live' && <View style={[styles.liveDot, { backgroundColor: STATUS_COLORS[t.status] }]} />}
          <Text style={[styles.statusText, { color: STATUS_COLORS[t.status] }]}>{STATUS_LABELS[t.status]}</Text>
        </View>
      </View>

      <Text style={styles.cardName}>{t.name}</Text>
      <View style={styles.cardInfoRow}>
        <Ionicons name="location-outline" size={13} color="#888" />
        <Text style={styles.cardInfoText}>{t.venue}, {t.city}</Text>
      </View>
      <View style={styles.cardInfoRow}>
        <Ionicons name="calendar-outline" size={13} color="#888" />
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
        <Ionicons name="people-outline" size={12} color="#888" />
        <Text style={styles.playersText}>{t.players.current}/{t.players.max}</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${fill}%` as any }]} />
        </View>
      </View>

      <TouchableOpacity
        style={[styles.joinBtn, t.status === 'full' && styles.joinBtnDisabled]}
        disabled={t.status === 'full'}
      >
        <Ionicons name={t.status === 'full' ? 'close-circle' : 'enter-outline'} size={14} color={t.status === 'full' ? '#999' : '#FFF'} />
        <Text style={[styles.joinBtnText, t.status === 'full' && styles.joinBtnTextDisabled]}>
          {t.status === 'full' ? 'COMPLET' : "S'INSCRIRE"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export default function TournoisScreen() {
  const [selectedRegion, setSelectedRegion] = useState<string>('');

  const tournoisCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const t of franceTournaments) {
      counts[t.region] = (counts[t.region] || 0) + 1;
    }
    return counts;
  }, []);

  const filteredTournaments = useMemo(() => {
    if (!selectedRegion) return [];
    return franceTournaments.filter(t => t.region === selectedRegion);
  }, [selectedRegion]);

  const regionDisplayName = selectedRegion || '';

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>TOURNOIS EN FRANCE</Text>
        <Text style={styles.subtitle}>
          {franceTournaments.length} tournois disponibles - Selectionnez une region
        </Text>
      </View>

      {/* Layout horizontal */}
      <View style={styles.content}>
        {/* Left - France Map */}
        <View style={styles.mapContainer}>
          <FranceMapInteractive
            onRegionSelect={setSelectedRegion}
            tournoisCounts={tournoisCounts}
          />
        </View>

        {/* Right - Tournament List */}
        <View style={styles.tournoisContainer}>
          {selectedRegion ? (
            <>
              <View style={styles.regionHeader}>
                <Text style={styles.regionTitle}>{regionDisplayName.toUpperCase()}</Text>
                <Text style={styles.tournoisCount}>
                  {filteredTournaments.length} tournoi{filteredTournaments.length > 1 ? 's' : ''} disponible{filteredTournaments.length > 1 ? 's' : ''}
                </Text>
              </View>

              <ScrollView style={styles.tournoisList} showsVerticalScrollIndicator={false}>
                {filteredTournaments.map(tournoi => (
                  <TournamentCard key={tournoi.id} t={tournoi} />
                ))}
              </ScrollView>
            </>
          ) : (
            <View style={styles.placeholder}>
              <Ionicons name="map-outline" size={48} color="#DDD" />
              <Text style={styles.placeholderTitle}>Selectionnez une region</Text>
              <Text style={styles.placeholderText}>
                Cliquez sur une region de la carte pour decouvrir les tournois disponibles
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingBottom: 56,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
    backgroundColor: '#FAFAFA',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: GOLD,
    letterSpacing: 1.5,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
  },
  mapContainer: {
    width: '45%',
    padding: 16,
    backgroundColor: '#FAFAFA',
    borderRightWidth: 1,
    borderRightColor: '#E5E5E5',
  },
  tournoisContainer: {
    width: '55%',
    padding: 16,
  },
  regionHeader: {
    marginBottom: 12,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  regionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#333',
    letterSpacing: 0.5,
  },
  tournoisCount: {
    fontSize: 13,
    color: '#888',
    marginTop: 2,
  },
  tournoisList: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#AAA',
  },
  placeholderText: {
    fontSize: 14,
    color: '#BBB',
    textAlign: 'center',
    maxWidth: 280,
    lineHeight: 20,
  },

  // Tournament Card - white theme
  card: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E5E5E5',
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  typeBadge: { borderWidth: 1, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 2 },
  typeBadgeText: { fontSize: 10, fontWeight: '800', letterSpacing: 0.5 },
  statusBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3 },
  statusText: { fontSize: 9, fontWeight: '800', letterSpacing: 0.5 },
  cardName: { color: '#222', fontSize: 16, fontWeight: '700' },
  cardInfoRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  cardInfoText: { color: '#666', fontSize: 12 },

  prizeRow: {
    flexDirection: 'row', backgroundColor: '#F8F6F0', borderRadius: 8,
    padding: 10, borderWidth: 1, borderColor: '#E8E0CC',
  },
  prizeItem: { flex: 1, alignItems: 'center' },
  prizeDivider: { width: 1, backgroundColor: '#E8E0CC' },
  prizeLabel: { color: '#999', fontSize: 9, fontWeight: '600', textTransform: 'uppercase' },
  prizeValue: { color: '#333', fontSize: 15, fontWeight: '700' },
  prizeValueGold: { color: GOLD, fontSize: 15, fontWeight: '700' },

  playersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  playersText: { color: '#888', fontSize: 11, fontWeight: '500' },
  progressBar: { flex: 1, height: 3, backgroundColor: '#EEE', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: GOLD, borderRadius: 2 },

  joinBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: GOLD, paddingVertical: 10, borderRadius: 10,
  },
  joinBtnDisabled: { backgroundColor: '#F0F0F0' },
  joinBtnText: { color: '#FFF', fontSize: 12, fontWeight: '800', letterSpacing: 1 },
  joinBtnTextDisabled: { color: '#999' },
});
