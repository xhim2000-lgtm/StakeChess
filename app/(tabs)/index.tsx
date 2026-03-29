import React, { useEffect, useRef, useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { GamingTournamentCard, GamingTournament } from '@/components/GamingTournamentCard';
import { RechargeModal } from '@/components/RechargeModal';

const G = Colors.gaming;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');

// ─── Tournament Data ─────────────────────────────────────────
const gamingTournaments: GamingTournament[] = [
  { id: 't1', badge: 'DUEL 1v1', badgeColor: G.gold, name: 'Salle Parisienne', location: 'Paris, France', stake: 5000, prize: 10000, players: 12, maxPlayers: 16, bgColors: ['#1a0a2e', '#2d1b69', '#000'], icon: '\u265A', status: 'open' },
  { id: 't2', badge: 'TOURNOI ELITE', badgeColor: '#FF6B6B', name: 'Arene de Londres', location: 'London, UK', stake: 1000000, prize: 5000000, players: 18, maxPlayers: 20, bgColors: ['#0a1628', '#1a3a5c', '#000'], icon: '\u265B', status: 'live' },
  { id: 't4', badge: 'MULTI-STAKE', badgeColor: '#00E5FF', name: 'Palais de Dubai', location: 'Dubai, UAE', stake: 50000, prize: 250000, players: 10, maxPlayers: 16, bgColors: ['#1a0f00', '#3d2800', '#000'], icon: '\u265C', status: 'open' },
  { id: 't5', badge: 'BLITZ MASTER', badgeColor: '#FFD700', name: 'Casino Monte-Carlo', location: 'Monaco', stake: 25000, prize: 100000, players: 16, maxPlayers: 16, bgColors: ['#1a0000', '#4a0e0e', '#000'], icon: '\u265E', status: 'live' },
  { id: 't6', badge: 'RAPID CHALLENGE', badgeColor: '#69F0AE', name: 'New York Skyline', location: 'New York, USA', stake: 10000, prize: 50000, players: 8, maxPlayers: 16, bgColors: ['#000d1a', '#0d2137', '#000'], icon: '\u265D', status: 'open' },
  { id: 't8', badge: 'GRAND MASTER', badgeColor: '#E040FB', name: 'Tokyo Lights', location: 'Tokyo, Japan', stake: 100000, prize: 500000, players: 14, maxPlayers: 16, bgColors: ['#1a001a', '#3d0042', '#000'], icon: '\u265A', status: 'live' },
];

// ─── Quick Actions ───────────────────────────────────────────
const quickActions = [
  { icon: 'stats-chart', label: 'MÉTRIQUES', color: G.gold },
  { icon: 'trophy', label: 'CLASSEMENTS', color: '#00E5FF' },
  { icon: 'gift', label: 'CADEAUX', color: '#FF6B6B' },
  { icon: 'reload', label: 'ROUE', color: '#69F0AE' },
];

// ─── Training Levels ─────────────────────────────────────────
const trainingLevels = [
  { id: 'beginner', name: 'Débutant', icon: 'happy-outline', color: G.green, elo: '800-1200' },
  { id: 'intermediate', name: 'Intermédiaire', icon: 'skull-outline', color: G.gold, elo: '1400-1800' },
  { id: 'expert', name: 'Expert', icon: 'flame-outline', color: '#FF3D3D', elo: '2000-2400' },
];

function formatCoins(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

const CARD_WIDTH = 320;

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [showRecharge, setShowRecharge] = useState(false);

  const heroOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(heroOpacity, { toValue: 1, duration: 600, useNativeDriver: true }).start();
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]),
    ).start();
  }, [heroOpacity, shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1], outputRange: [0.6, 1, 0.6],
  });

  return (
    <View style={styles.root}>
      {/* ── HEADER ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.logoIcon}>{'\u265A'}</Text>
          <Text style={styles.logoText}>STAKE <Text style={styles.logoAccent}>CHESS</Text></Text>
        </View>

        <View style={styles.headerActions}>
          {quickActions.map((a, i) => (
            <TouchableOpacity key={i} style={[styles.headerActionBtn, { borderColor: a.color }]}>
              <Ionicons name={a.icon as any} size={14} color={a.color} />
              <Text style={[styles.headerActionLabel, { color: a.color }]}>{a.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.walletChip} onPress={() => setShowRecharge(true)}>
            <Text style={styles.coinIcon}>{'\u2666'}</Text>
            <Text style={styles.walletValue}>{formatCoins(user.balance * 1000)}</Text>
            <View style={styles.addBadge}><Ionicons name="add" size={10} color={G.bg} /></View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.settingsBtn}>
            <Ionicons name="settings-outline" size={18} color={G.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* ── MAIN CONTENT: Hero Left + Carousels Right ── */}
      <View style={styles.mainRow}>
        {/* ═══ LEFT: Hero Panel ═══ */}
        <Animated.View style={[styles.heroPanel, { opacity: heroOpacity }]}>
          <View style={styles.heroBranding}>
            <Text style={styles.heroSubtitle}>ONLINE TOURNAMENT PLATFORM</Text>
            <Animated.Text style={[styles.heroTitle, { opacity: shimmerOpacity }]}>
              STAKE
            </Animated.Text>
            <Text style={styles.heroTitleWhite}>CHESS</Text>
            <View style={styles.heroDivider}>
              <View style={styles.heroDividerLine} />
              <View style={styles.heroDiamond} />
              <View style={styles.heroDividerLine} />
            </View>
            <Text style={styles.heroTagline}>MISEZ. JOUEZ. GAGNEZ.</Text>
          </View>

          {/* Play button */}
          <TouchableOpacity
            style={styles.playButton}
            activeOpacity={0.85}
            onPress={() => router.push('/online/t1')}
          >
            <Ionicons name="play" size={18} color={G.bg} />
            <Text style={styles.playButtonText}>JOUER MAINTENANT</Text>
          </TouchableOpacity>

          {/* Stats */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{user.elo}</Text>
              <Text style={styles.statLabel}>ELO</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValueGold}>{user.wins}</Text>
              <Text style={styles.statLabel}>WINS</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValueGold}>{formatCoins(user.totalEarnings * 1000)}</Text>
              <Text style={styles.statLabel}>GAINS</Text>
            </View>
          </View>

          {/* Quick actions */}
          <View style={styles.heroQuickRow}>
            {quickActions.map((a, i) => (
              <TouchableOpacity key={i} style={styles.heroQuickBtn}>
                <Ionicons name={a.icon as any} size={16} color={a.color} />
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* ═══ RIGHT: Scrollable Carousels ═══ */}
        <ScrollView
          style={styles.rightPanel}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.rightContent}
        >
          {/* Training Section */}
          <View style={styles.sectionHeader}>
            <Ionicons name="hardware-chip-outline" size={14} color={G.gold} />
            <Text style={styles.sectionTitle}>ENTRAÎNEMENT IA</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {trainingLevels.map((lvl) => (
              <TouchableOpacity
                key={lvl.id}
                style={styles.trainingCard}
                activeOpacity={0.85}
                onPress={() => router.push(`/training/${lvl.id}` as any)}
              >
                <View style={styles.trainingCardInner}>
                  <View style={[styles.trainingIconWrap, { borderColor: lvl.color }]}>
                    <Ionicons name={lvl.icon as any} size={32} color={lvl.color} />
                  </View>
                  <Text style={[styles.trainingName, { color: lvl.color }]}>{lvl.name}</Text>
                  <Text style={styles.trainingElo}>Elo {lvl.elo}</Text>
                  <Text style={styles.trainingEngine}>Stockfish Engine</Text>
                  <View style={[styles.trainingPlayBtn, { backgroundColor: lvl.color }]}>
                    <Ionicons name="play" size={12} color={G.bg} />
                    <Text style={styles.trainingPlayText}>JOUER</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Featured Tournaments */}
          <View style={styles.sectionHeader}>
            <Ionicons name="flame-outline" size={14} color={G.gold} />
            <Text style={styles.sectionTitle}>TOURNOIS EN VEDETTE</Text>
            <TouchableOpacity style={styles.seeAll}>
              <Text style={styles.seeAllText}>Voir tout</Text>
              <Ionicons name="chevron-forward" size={12} color={G.gold} />
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {gamingTournaments.filter(t => t.status === 'live' || t.prize >= 100000).map((t, i) => (
              <GamingTournamentCard key={t.id} tournament={t} index={i} />
            ))}
          </ScrollView>

          {/* Open Tournaments */}
          <View style={styles.sectionHeader}>
            <Ionicons name="enter-outline" size={14} color={G.gold} />
            <Text style={styles.sectionTitle}>SALLES OUVERTES</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH + 16}
            decelerationRate="fast"
            contentContainerStyle={styles.carouselContent}
          >
            {gamingTournaments.filter(t => t.status === 'open').map((t, i) => (
              <GamingTournamentCard key={t.id} tournament={t} index={i} />
            ))}
          </ScrollView>

          <View style={{ height: 20 }} />
        </ScrollView>
      </View>

      <RechargeModal visible={showRecharge} onClose={() => setShowRecharge(false)} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },

  // ── Header ──
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.8)',
    borderBottomWidth: 1,
    borderBottomColor: G.borderGold,
  },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  logoIcon: { fontSize: 22, color: G.gold },
  logoText: { color: G.textPrimary, fontSize: 16, fontWeight: '900', letterSpacing: 2 },
  logoAccent: { color: G.gold },
  headerActions: { flexDirection: 'row', gap: 8 },
  headerActionBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    borderWidth: 1, borderRadius: 14, paddingHorizontal: 10, paddingVertical: 4,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  headerActionLabel: { fontSize: 9, fontWeight: '700', letterSpacing: 0.5 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  walletChip: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(212,175,55,0.1)', borderRadius: 14,
    paddingHorizontal: 10, paddingVertical: 5,
    borderWidth: 1, borderColor: G.borderGold,
  },
  coinIcon: { color: G.gold, fontSize: 12, fontWeight: '800' },
  walletValue: { color: G.goldLight, fontSize: 12, fontWeight: '700' },
  addBadge: {
    width: 14, height: 14, borderRadius: 7,
    backgroundColor: G.gold, alignItems: 'center', justifyContent: 'center',
  },
  settingsBtn: {
    width: 30, height: 30, borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.05)',
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Main Layout ──
  mainRow: { flex: 1, flexDirection: 'row' },

  // ── Hero Panel (Left 30%) ──
  heroPanel: {
    width: '30%',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    borderRightWidth: 1,
    borderRightColor: G.borderGold,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  heroBranding: { alignItems: 'center' },
  heroSubtitle: {
    color: G.textMuted, fontSize: 8, fontWeight: '600', letterSpacing: 3, marginBottom: 6,
  },
  heroTitle: {
    color: G.gold, fontSize: 48, fontWeight: '900', letterSpacing: 6,
    textShadowColor: 'rgba(212, 175, 55, 0.4)',
    textShadowOffset: { width: 0, height: 3 }, textShadowRadius: 16,
  },
  heroTitleWhite: {
    color: G.textPrimary, fontSize: 42, fontWeight: '900', letterSpacing: 10, marginTop: -8,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 8,
  },
  heroDivider: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginVertical: 10,
  },
  heroDividerLine: { width: 30, height: 1, backgroundColor: G.goldMuted },
  heroDiamond: {
    width: 6, height: 6, backgroundColor: G.gold, transform: [{ rotate: '45deg' }],
  },
  heroTagline: {
    color: G.goldLight, fontSize: 10, fontWeight: '700', letterSpacing: 4,
  },
  playButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8,
    backgroundColor: G.gold, paddingHorizontal: 32, paddingVertical: 14, borderRadius: 12,
    shadowColor: G.gold, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 12, elevation: 10, width: '100%',
  },
  playButtonText: { color: G.bg, fontSize: 14, fontWeight: '900', letterSpacing: 2 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0,0,0,0.5)', borderRadius: 10,
    paddingVertical: 10, paddingHorizontal: 12,
    borderWidth: 1, borderColor: G.borderGold, width: '100%',
  },
  statItem: { flex: 1, alignItems: 'center' },
  statDivider: { width: 1, backgroundColor: G.borderGold },
  statValue: { color: G.textPrimary, fontSize: 18, fontWeight: '700' },
  statValueGold: { color: G.gold, fontSize: 18, fontWeight: '700' },
  statLabel: { color: G.textMuted, fontSize: 8, fontWeight: '600', letterSpacing: 1, marginTop: 2 },
  heroQuickRow: { flexDirection: 'row', gap: 10 },
  heroQuickBtn: {
    width: 36, height: 36, borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1, borderColor: G.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },

  // ── Right Panel (70%) ──
  rightPanel: { flex: 1 },
  rightContent: { paddingBottom: 10 },

  // ── Section Headers ──
  sectionHeader: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 20, paddingTop: 14, paddingBottom: 8,
  },
  sectionTitle: { color: G.textPrimary, fontSize: 13, fontWeight: '800', letterSpacing: 1.5, flex: 1 },
  seeAll: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  seeAllText: { color: G.gold, fontSize: 11, fontWeight: '600' },

  // ── Carousel ──
  carouselContent: { paddingHorizontal: 20, gap: 16 },

  // ── Training Cards ──
  trainingCard: {
    width: 180, height: 220, borderRadius: 14, overflow: 'hidden',
    borderWidth: 1, borderColor: G.borderLight,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  trainingCardInner: {
    flex: 1, padding: 16, alignItems: 'center', justifyContent: 'center', gap: 8,
  },
  trainingIconWrap: {
    width: 56, height: 56, borderRadius: 28,
    borderWidth: 2, alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  trainingName: { fontSize: 14, fontWeight: '800', letterSpacing: 1 },
  trainingElo: { color: G.textMuted, fontSize: 11, fontWeight: '600' },
  trainingEngine: { color: G.textMuted, fontSize: 8, fontWeight: '600', letterSpacing: 1 },
  trainingPlayBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 5,
    paddingHorizontal: 18, paddingVertical: 7, borderRadius: 12, marginTop: 4,
  },
  trainingPlayText: { color: G.bg, fontSize: 10, fontWeight: '800', letterSpacing: 1 },
});
