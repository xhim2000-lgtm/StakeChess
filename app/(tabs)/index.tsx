import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useUser } from '@/contexts/UserContext';
import { GamingTournamentCard, GamingTournament } from '@/components/GamingTournamentCard';
import { RechargeModal } from '@/components/RechargeModal';

const G = Colors.gaming;
const { width: SCREEN_WIDTH } = Dimensions.get('window');

// ─── Gaming Tournament Data ───────────────────────────────────
const gamingTournaments: GamingTournament[] = [
  {
    id: 't1',
    badge: 'DUEL 1v1',
    badgeColor: G.gold,
    name: 'Salle Parisienne',
    location: 'Paris, France',
    stake: 5000,
    prize: 10000,
    players: 12,
    maxPlayers: 16,
    bgColors: ['#1a0a2e', '#2d1b69', '#000'],
    icon: '\u265A',
    status: 'open',
  },
  {
    id: 't2',
    badge: 'TOURNOI ELITE',
    badgeColor: '#FF6B6B',
    name: 'Arene de Londres',
    location: 'London, UK',
    stake: 1000000,
    prize: 5000000,
    players: 18,
    maxPlayers: 20,
    bgColors: ['#0a1628', '#1a3a5c', '#000'],
    icon: '\u265B',
    status: 'live',
  },
  {
    id: 't4',
    badge: 'MULTI-STAKE',
    badgeColor: '#00E5FF',
    name: 'Palais de Dubai',
    location: 'Dubai, UAE',
    stake: 50000,
    prize: 250000,
    players: 10,
    maxPlayers: 16,
    bgColors: ['#1a0f00', '#3d2800', '#000'],
    icon: '\u265C',
    status: 'open',
  },
  {
    id: 't5',
    badge: 'BLITZ MASTER',
    badgeColor: '#FFD700',
    name: 'Casino Monte-Carlo',
    location: 'Monaco',
    stake: 25000,
    prize: 100000,
    players: 16,
    maxPlayers: 16,
    bgColors: ['#1a0000', '#4a0e0e', '#000'],
    icon: '\u265E',
    status: 'live',
  },
  {
    id: 't6',
    badge: 'RAPID CHALLENGE',
    badgeColor: '#69F0AE',
    name: 'New York Skyline',
    location: 'New York, USA',
    stake: 10000,
    prize: 50000,
    players: 8,
    maxPlayers: 16,
    bgColors: ['#000d1a', '#0d2137', '#000'],
    icon: '\u265D',
    status: 'open',
  },
  {
    id: 't8',
    badge: 'GRAND MASTER',
    badgeColor: '#E040FB',
    name: 'Tokyo Lights',
    location: 'Tokyo, Japan',
    stake: 100000,
    prize: 500000,
    players: 14,
    maxPlayers: 16,
    bgColors: ['#1a001a', '#3d0042', '#000'],
    icon: '\u265A',
    status: 'live',
  },
];

// ─── Quick Action Data ────────────────────────────────────────
const quickActions = [
  { icon: 'stats-chart', label: 'Classement', color: G.gold },
  { icon: 'gift', label: 'Cadeaux', color: '#FF6B6B' },
  { icon: 'reload', label: 'Roue', color: '#69F0AE' },
  { icon: 'podium', label: 'Leaderboard', color: '#00E5FF' },
];

function formatCoins(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

// ─── Main Component ───────────────────────────────────────────
export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();
  const [showRecharge, setShowRecharge] = useState(false);

  // Hero animation
  const heroScale = useRef(new Animated.Value(0.9)).current;
  const heroOpacity = useRef(new Animated.Value(0)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(heroScale, {
        toValue: 1,
        tension: 40,
        friction: 8,
        useNativeDriver: true,
      }),
      Animated.timing(heroOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Shimmer loop
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(shimmerAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ]),
    ).start();
  }, [heroScale, heroOpacity, shimmerAnim]);

  const shimmerOpacity = shimmerAnim.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.6, 1, 0.6],
  });

  return (
    <View style={styles.root}>
      <ScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── Header Bar ── */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Text style={styles.logoIcon}>{'\u265A'}</Text>
            </View>
            <View>
              <Text style={styles.logoText}>CHESS<Text style={styles.logoAccent}>_PRO</Text></Text>
              <Text style={styles.levelText}>NIVEAU 12</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.currencyChip} onPress={() => setShowRecharge(true)}>
              <Text style={styles.coinIcon}>{'\u2666'}</Text>
              <Text style={styles.currencyValue}>{formatCoins(user.balance * 1000)}</Text>
              <View style={styles.addIcon}>
                <Ionicons name="add" size={12} color={G.bg} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.currencyChipGreen} onPress={() => setShowRecharge(true)}>
              <Ionicons name="ticket" size={14} color={G.green} />
              <Text style={styles.ticketValue}>12</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={20} color={G.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Section ── */}
        <Animated.View style={[styles.heroSection, {
          opacity: heroOpacity,
          transform: [{ scale: heroScale }],
        }]}>
          {/* Decorative pieces */}
          <Text style={styles.heroChessLeft}>{'\u265B'}</Text>
          <Text style={styles.heroChessRight}>{'\u2654'}</Text>

          <View style={styles.heroContent}>
            <Text style={styles.heroSubtitle}>ONLINE TOURNAMENT PLATFORM</Text>
            <Animated.Text style={[styles.heroTitle, { opacity: shimmerOpacity }]}>
              STAKE
            </Animated.Text>
            <Text style={styles.heroTitleOutline}>CHESS</Text>
            <View style={styles.heroDivider}>
              <View style={styles.heroDividerLine} />
              <Ionicons name="diamond" size={14} color={G.gold} />
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
            <Text style={styles.playButtonText}>JOUEZ !</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* ── Quick Actions ── */}
        <View style={styles.quickActions}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.quickActionItem}>
              <View style={[styles.quickActionCircle, { borderColor: action.color }]}>
                <Ionicons name={action.icon as any} size={20} color={action.color} />
              </View>
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Featured Tournaments Section ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>TOURNOIS EN VEDETTE</Text>
            <Text style={styles.sectionSubtitle}>Les plus gros prize pools</Text>
          </View>
          <TouchableOpacity style={styles.seeAllButton}>
            <Text style={styles.seeAllText}>Voir tout</Text>
            <Ionicons name="chevron-forward" size={14} color={G.gold} />
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH > 600 ? (SCREEN_WIDTH - 64) / 2 + 16 : SCREEN_WIDTH - 32}
        >
          {gamingTournaments.filter(t => t.status === 'live' || t.prize >= 100000).map((t, i) => (
            <GamingTournamentCard key={t.id} tournament={t} index={i} />
          ))}
        </ScrollView>

        {/* ── Open Tournaments ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>SALLES OUVERTES</Text>
            <Text style={styles.sectionSubtitle}>Rejoignez une partie</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carouselContent}
          decelerationRate="fast"
          snapToInterval={SCREEN_WIDTH > 600 ? (SCREEN_WIDTH - 64) / 2 + 16 : SCREEN_WIDTH - 32}
        >
          {gamingTournaments.filter(t => t.status === 'open').map((t, i) => (
            <GamingTournamentCard key={t.id} tournament={t} index={i} />
          ))}
        </ScrollView>

        {/* ── Stats Banner ── */}
        <View style={styles.statsBanner}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.tournamentsPlayed}</Text>
            <Text style={styles.statLabel}>Parties</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValueGold}>{user.wins}</Text>
            <Text style={styles.statLabel}>Victoires</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValue}>{user.elo}</Text>
            <Text style={styles.statLabel}>Elo</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statValueGold}>{formatCoins(user.totalEarnings * 1000)}</Text>
            <Text style={styles.statLabel}>Gains</Text>
          </View>
        </View>

        {/* ── Bottom spacer ── */}
        <View style={{ height: 30 }} />
      </ScrollView>

      <RechargeModal visible={showRecharge} onClose={() => setShowRecharge(false)} />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: G.bg,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Header
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    backgroundColor: 'rgba(13,13,13,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: G.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoContainer: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: G.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  logoIcon: {
    fontSize: 22,
    color: G.gold,
  },
  logoText: {
    color: G.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoAccent: {
    color: G.gold,
  },
  levelText: {
    color: G.goldMuted,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  currencyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: G.bgTertiary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  coinIcon: {
    color: G.gold,
    fontSize: 14,
    fontWeight: '800',
  },
  currencyValue: {
    color: G.goldLight,
    fontSize: 13,
    fontWeight: '700',
  },
  addIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: G.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyChipGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: G.bgTertiary,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
  },
  ticketValue: {
    color: G.green,
    fontSize: 13,
    fontWeight: '700',
  },
  iconButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: G.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: 36,
    paddingHorizontal: 20,
    position: 'relative',
    overflow: 'hidden',
  },
  heroChessLeft: {
    position: 'absolute',
    left: -10,
    top: 20,
    fontSize: 120,
    color: G.gold,
    opacity: 0.04,
  },
  heroChessRight: {
    position: 'absolute',
    right: -10,
    bottom: 10,
    fontSize: 120,
    color: G.gold,
    opacity: 0.04,
  },
  heroContent: {
    alignItems: 'center',
    zIndex: 1,
  },
  heroSubtitle: {
    color: G.textMuted,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 8,
  },
  heroTitle: {
    color: G.gold,
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: 6,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 20,
    lineHeight: 72,
  },
  heroTitleOutline: {
    color: G.textPrimary,
    fontSize: 58,
    fontWeight: '900',
    letterSpacing: 12,
    marginTop: -6,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  heroDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 14,
  },
  heroDividerLine: {
    width: 50,
    height: 1,
    backgroundColor: G.goldMuted,
  },
  heroTagline: {
    color: G.goldLight,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 4,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    backgroundColor: G.gold,
    paddingHorizontal: 48,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    shadowColor: G.gold,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  playButtonText: {
    color: G.bg,
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 3,
  },

  // Quick actions
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: G.borderLight,
  },
  quickActionItem: {
    alignItems: 'center',
    gap: 6,
  },
  quickActionCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 1.5,
    backgroundColor: 'rgba(255,255,255,0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionLabel: {
    color: G.textSecondary,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Section headers
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 14,
  },
  sectionTitle: {
    color: G.textPrimary,
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    color: G.textMuted,
    fontSize: 12,
    marginTop: 2,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: G.gold,
    fontSize: 13,
    fontWeight: '600',
  },

  // Carousel
  carouselContent: {
    paddingLeft: 20,
    paddingRight: 4,
  },

  // Stats banner
  statsBanner: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginTop: 24,
    backgroundColor: G.bgTertiary,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: G.borderGold,
  },
  statValue: {
    color: G.textPrimary,
    fontSize: 20,
    fontWeight: '700',
  },
  statValueGold: {
    color: G.gold,
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: G.textMuted,
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
});
