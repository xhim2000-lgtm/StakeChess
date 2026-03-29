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
const { width: SCREEN_W } = Dimensions.get('window');

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
  { icon: 'stats-chart', label: 'MÉTRIQUES', color: G.gold },
  { icon: 'trophy', label: 'CLASSEMENTS', color: '#00E5FF' },
  { icon: 'gift', label: 'CADEAUX', color: '#FF6B6B' },
  { icon: 'reload', label: 'ROUE DE LA CHANCE', color: '#69F0AE' },
];

// ─── Training Levels ──────────────────────────────────────────
const trainingLevels = [
  { id: 'beginner', name: 'Débutant', icon: 'happy-outline', color: G.green, elo: '800-1200', desc: 'Apprenez les bases' },
  { id: 'intermediate', name: 'Intermédiaire', icon: 'skull-outline', color: G.gold, elo: '1400-1800', desc: 'Améliorez votre jeu' },
  { id: 'expert', name: 'Expert', icon: 'flame-outline', color: '#FF3D3D', elo: '2000-2400', desc: 'Stockfish pleine puissance' },
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
                <Ionicons name="add" size={10} color={G.bg} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.currencyChipGreen} onPress={() => setShowRecharge(true)}>
              <Ionicons name="ticket" size={12} color={G.green} />
              <Text style={styles.ticketValue}>12</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconButton}>
              <Ionicons name="settings-outline" size={18} color={G.textSecondary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Hero Section — Landscape: horizontal layout ── */}
        <Animated.View style={[styles.heroSection, {
          opacity: heroOpacity,
          transform: [{ scale: heroScale }],
        }]}>
          {/* Decorative pieces */}
          <Text style={styles.heroChessLeft}>{'\u265B'}</Text>
          <Text style={styles.heroChessRight}>{'\u2654'}</Text>

          <View style={styles.heroRow}>
            {/* Left: branding */}
            <View style={styles.heroTextBlock}>
              <Text style={styles.heroSubtitle}>ONLINE TOURNAMENT PLATFORM</Text>
              <View style={styles.heroTitleRow}>
                <Animated.Text style={[styles.heroTitle, { opacity: shimmerOpacity }]}>
                  STAKE
                </Animated.Text>
                <Text style={styles.heroTitleOutline}> CHESS</Text>
              </View>
              <View style={styles.heroDivider}>
                <View style={styles.heroDividerLine} />
                <Ionicons name="diamond" size={12} color={G.gold} />
                <View style={styles.heroDividerLine} />
              </View>
              <Text style={styles.heroTagline}>MISEZ. JOUEZ. GAGNEZ.</Text>
            </View>

            {/* Right: stats + play button */}
            <View style={styles.heroRightBlock}>
              {/* Compact stats */}
              <View style={styles.heroStats}>
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValue}>{user.elo}</Text>
                  <Text style={styles.heroStatLabel}>ELO</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValueGold}>{user.wins}</Text>
                  <Text style={styles.heroStatLabel}>WINS</Text>
                </View>
                <View style={styles.heroStatDivider} />
                <View style={styles.heroStatItem}>
                  <Text style={styles.heroStatValueGold}>{formatCoins(user.totalEarnings * 1000)}</Text>
                  <Text style={styles.heroStatLabel}>GAINS</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.playButton}
                activeOpacity={0.85}
                onPress={() => router.push('/online/t1')}
              >
                <Ionicons name="play" size={16} color={G.bg} />
                <Text style={styles.playButtonText}>JOUEZ !</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* ── Action Buttons Row ── */}
        <View style={styles.actionRow}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={i} style={styles.actionBtn}>
              <View style={[styles.actionIconWrap, { borderColor: action.color }]}>
                <Ionicons name={action.icon as any} size={18} color={action.color} />
              </View>
              <Text style={[styles.actionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnPlay]}
            onPress={() => router.push('/online/t1')}
          >
            <View style={[styles.actionIconWrap, styles.actionIconPlay]}>
              <Ionicons name="play" size={22} color={G.bg} />
            </View>
            <Text style={styles.actionLabelPlay}>JOUEZ!</Text>
          </TouchableOpacity>
        </View>

        {/* ── Training Section ── */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>ENTRAÎNEMENT IA</Text>
            <Text style={styles.sectionSubtitle}>Jouez contre Stockfish</Text>
          </View>
        </View>

        <View style={styles.trainingRow}>
          {trainingLevels.map((lvl) => (
            <TouchableOpacity
              key={lvl.id}
              style={styles.trainingCard}
              activeOpacity={0.8}
              onPress={() => router.push(`/training/${lvl.id}` as any)}
            >
              <View style={[styles.trainingIconWrap, { borderColor: lvl.color }]}>
                <Ionicons name={lvl.icon as any} size={22} color={lvl.color} />
              </View>
              <Text style={[styles.trainingName, { color: lvl.color }]}>{lvl.name}</Text>
              <Text style={styles.trainingElo}>Elo {lvl.elo}</Text>
              <Text style={styles.trainingDesc}>{lvl.desc}</Text>
              <View style={[styles.trainingPlayBtn, { backgroundColor: lvl.color }]}>
                <Text style={styles.trainingPlayText}>JOUER</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Featured Tournaments ── */}
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
        >
          {gamingTournaments.filter(t => t.status === 'open').map((t, i) => (
            <GamingTournamentCard key={t.id} tournament={t} index={i} />
          ))}
        </ScrollView>

        <View style={{ height: 16 }} />
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
    paddingBottom: 10,
  },

  // ── Header ──
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 8,
    backgroundColor: 'rgba(13,13,13,0.95)',
    borderBottomWidth: 1,
    borderBottomColor: G.borderLight,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoContainer: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: G.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  logoIcon: {
    fontSize: 18,
    color: G.gold,
  },
  logoText: {
    color: G.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1,
  },
  logoAccent: {
    color: G.gold,
  },
  levelText: {
    color: G.goldMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  currencyChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: G.bgTertiary,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  coinIcon: {
    color: G.gold,
    fontSize: 12,
    fontWeight: '800',
  },
  currencyValue: {
    color: G.goldLight,
    fontSize: 12,
    fontWeight: '700',
  },
  addIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: G.gold,
    alignItems: 'center',
    justifyContent: 'center',
  },
  currencyChipGreen: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: G.bgTertiary,
    borderRadius: 16,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: 'rgba(0, 200, 83, 0.3)',
  },
  ticketValue: {
    color: G.green,
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: G.bgTertiary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // ── Hero — Landscape horizontal layout ──
  heroSection: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  heroChessLeft: {
    position: 'absolute',
    left: 10,
    top: -10,
    fontSize: 100,
    color: G.gold,
    opacity: 0.03,
  },
  heroChessRight: {
    position: 'absolute',
    right: 10,
    bottom: -10,
    fontSize: 100,
    color: G.gold,
    opacity: 0.03,
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    zIndex: 1,
  },
  heroTextBlock: {
    flex: 1,
  },
  heroSubtitle: {
    color: G.textMuted,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 3,
    marginBottom: 4,
  },
  heroTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  heroTitle: {
    color: G.gold,
    fontSize: 42,
    fontWeight: '900',
    letterSpacing: 4,
    textShadowColor: 'rgba(212, 175, 55, 0.3)',
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 16,
  },
  heroTitleOutline: {
    color: G.textPrimary,
    fontSize: 38,
    fontWeight: '900',
    letterSpacing: 8,
    textShadowColor: 'rgba(255, 255, 255, 0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  heroDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginVertical: 8,
  },
  heroDividerLine: {
    width: 40,
    height: 1,
    backgroundColor: G.goldMuted,
  },
  heroTagline: {
    color: G.goldLight,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 4,
  },
  heroRightBlock: {
    alignItems: 'center',
    gap: 12,
    marginLeft: 24,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: G.bgTertiary,
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: G.borderGold,
    gap: 0,
  },
  heroStatItem: {
    alignItems: 'center',
    paddingHorizontal: 14,
  },
  heroStatDivider: {
    width: 1,
    backgroundColor: G.borderGold,
  },
  heroStatValue: {
    color: G.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  heroStatValueGold: {
    color: G.gold,
    fontSize: 18,
    fontWeight: '700',
  },
  heroStatLabel: {
    color: G.textMuted,
    fontSize: 8,
    fontWeight: '600',
    letterSpacing: 1,
    marginTop: 2,
  },
  playButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: G.gold,
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: G.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 10,
  },
  playButtonText: {
    color: G.bg,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },

  // ── Section headers ──
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 10,
  },
  sectionTitle: {
    color: G.textPrimary,
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  sectionSubtitle: {
    color: G.textMuted,
    fontSize: 11,
    marginTop: 1,
  },
  seeAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  seeAllText: {
    color: G.gold,
    fontSize: 12,
    fontWeight: '600',
  },

  // ── Action Buttons Row ──
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: G.borderLight,
  },
  actionBtn: {
    alignItems: 'center',
    gap: 4,
  },
  actionBtnPlay: {
    marginLeft: 8,
  },
  actionIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  actionIconPlay: {
    backgroundColor: G.gold,
    borderColor: G.gold,
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  actionLabel: {
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    textAlign: 'center',
    maxWidth: 70,
  },
  actionLabelPlay: {
    color: G.gold,
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 1,
  },

  // ── Training Section ──
  trainingRow: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  trainingCard: {
    flex: 1,
    backgroundColor: G.bgCard,
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  trainingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
  trainingName: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  trainingElo: {
    color: G.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  trainingDesc: {
    color: G.textSecondary,
    fontSize: 9,
    textAlign: 'center',
  },
  trainingPlayBtn: {
    paddingHorizontal: 16,
    paddingVertical: 5,
    borderRadius: 12,
    marginTop: 4,
  },
  trainingPlayText: {
    color: G.bg,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // ── Carousel ──
  carouselContent: {
    paddingLeft: 20,
    paddingRight: 6,
  },
});
