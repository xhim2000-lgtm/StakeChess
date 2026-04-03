import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useLayout } from '@/hooks/useLayout';

const G = Colors.gaming;

export interface GamingTournament {
  id: string;
  badge: string;
  badgeColor: string;
  name: string;
  location: string;
  stake: number;
  prize: number;
  players: number;
  maxPlayers: number;
  bgColors: [string, string, string];
  icon: string;
  status: 'open' | 'in_progress' | 'live';
}

interface GamingTournamentCardProps {
  tournament: GamingTournament;
  index: number;
}

function formatCoins(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return n.toString();
}

export function GamingTournamentCard({ tournament, index }: GamingTournamentCardProps) {
  const router = useRouter();
  const { isLandscape, height: screenH } = useLayout();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const ctaPulse = useRef(new Animated.Value(0)).current;
  const livePulse = useRef(new Animated.Value(0)).current;

  const cardWidth = isLandscape ? 320 : 280;
  const cardHeight = isLandscape ? Math.min(screenH - 120, 400) : 340;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 400, delay: index * 80, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, delay: index * 80, useNativeDriver: true }),
    ]).start();

    // CTA button pulse
    Animated.loop(
      Animated.sequence([
        Animated.timing(ctaPulse, { toValue: 1, duration: 1200, useNativeDriver: true }),
        Animated.timing(ctaPulse, { toValue: 0, duration: 1200, useNativeDriver: true }),
      ]),
    ).start();

    // Live badge pulse
    if (tournament.status === 'live') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(livePulse, { toValue: 1, duration: 800, useNativeDriver: true }),
          Animated.timing(livePulse, { toValue: 0, duration: 800, useNativeDriver: true }),
        ]),
      ).start();
    }
  }, [fadeAnim, slideAnim, ctaPulse, livePulse, index, tournament.status]);

  const fillPct = (tournament.players / tournament.maxPlayers) * 100;

  const ctaGlowOpacity = ctaPulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.15, 0.45],
  });

  const liveDotOpacity = livePulse.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 1],
  });

  return (
    <Animated.View style={[styles.cardOuter, { width: cardWidth, opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity
        style={[styles.card, { height: cardHeight }]}
        activeOpacity={0.85}
        onPress={() => router.push(`/online/${tournament.id}`)}
      >
        {/* Background */}
        <View style={[styles.bgLayer, { backgroundColor: tournament.bgColors[0] }]} />
        <View style={[styles.bgGradientTop, { backgroundColor: tournament.bgColors[1] }]} />
        <View style={styles.bgGradientBottom} />
        <View style={styles.bgIcon}><Text style={styles.bgIconText}>{tournament.icon}</Text></View>
        <View style={styles.goldBorderTop} />

        <View style={styles.content}>
          {/* Badge (tilted) + Live */}
          <View style={styles.topRow}>
            <View style={styles.badgeOuter}>
              <View style={[styles.badge, { borderColor: tournament.badgeColor }]}>
                <Text style={[styles.badgeText, { color: tournament.badgeColor }]}>{tournament.badge}</Text>
              </View>
            </View>
            {tournament.status === 'live' && (
              <View style={styles.liveBadge}>
                <Animated.View style={[styles.liveDot, { opacity: liveDotOpacity }]} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>

          {/* Center icon area */}
          <View style={styles.centerArea}>
            <Text style={styles.centerIcon}>{tournament.icon}</Text>
          </View>

          {/* Info */}
          <View style={styles.infoSection}>
            <Text style={styles.locationText}>{tournament.location}</Text>
            <Text style={styles.nameText} numberOfLines={1}>{tournament.name}</Text>

            <View style={styles.stakesRow}>
              <View style={styles.stakeItem}>
                <Ionicons name="diamond" size={12} color={G.gold} />
                <Text style={styles.stakeLabel}>Mise</Text>
                <Text style={styles.stakeValue}>{formatCoins(tournament.stake)}</Text>
              </View>
              <View style={styles.stakeDivider} />
              <View style={styles.stakeItem}>
                <Ionicons name="trophy" size={12} color={G.gold} />
                <Text style={styles.stakeLabel}>Prix</Text>
                <Text style={styles.stakeValueGold}>{formatCoins(tournament.prize)}</Text>
              </View>
            </View>

            <View style={styles.playersRow}>
              <Ionicons name="people" size={10} color={G.textSecondary} />
              <Text style={styles.playersText}>{tournament.players}/{tournament.maxPlayers}</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${fillPct}%` as any }]} />
              </View>
            </View>

            {/* CTA with pulse glow */}
            <View style={styles.ctaWrap}>
              <Animated.View style={[styles.ctaGlow, { opacity: ctaGlowOpacity }]} />
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                <Ionicons name="flash" size={14} color={G.bg} />
                <Text style={styles.ctaText}>REJOINDRE</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {},
  card: {
    borderRadius: 16, overflow: 'hidden',
    borderWidth: 1, borderColor: G.borderGold,
    shadowColor: G.gold,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  bgLayer: { ...StyleSheet.absoluteFillObject },
  bgGradientTop: { position: 'absolute', top: 0, left: 0, right: 0, height: '40%', opacity: 0.5 },
  bgGradientBottom: { position: 'absolute', bottom: 0, left: 0, right: 0, height: '70%', backgroundColor: 'rgba(0,0,0,0.8)' },
  bgIcon: { position: 'absolute', top: 24, right: 16, opacity: 0.08 },
  bgIconText: { fontSize: 80 },
  goldBorderTop: { position: 'absolute', top: 0, left: 0, right: 0, height: 2, backgroundColor: G.gold, opacity: 0.6 },

  content: { flex: 1, padding: 14, justifyContent: 'space-between', zIndex: 10 },
  topRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },

  // Tilted badge
  badgeOuter: { transform: [{ rotate: '-3deg' }] },
  badge: { borderWidth: 1.5, borderRadius: 5, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: 'rgba(0,0,0,0.5)' },
  badgeText: { fontSize: 9, fontWeight: '800', letterSpacing: 1, textTransform: 'uppercase' },

  liveBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 4,
    backgroundColor: 'rgba(255,61,61,0.2)', borderWidth: 1, borderColor: G.red,
    borderRadius: 5, paddingHorizontal: 6, paddingVertical: 3,
  },
  liveDot: { width: 5, height: 5, borderRadius: 3, backgroundColor: G.red },
  liveText: { color: G.red, fontSize: 9, fontWeight: '800', letterSpacing: 1 },

  centerArea: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  centerIcon: { fontSize: 60, color: G.gold, opacity: 0.15 },

  infoSection: { gap: 6 },
  locationText: { color: G.gold, fontSize: 9, fontWeight: '600', letterSpacing: 1.5, textTransform: 'uppercase' },
  nameText: { color: G.textPrimary, fontSize: 20, fontWeight: '800' },

  stakesRow: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 8, padding: 10,
    borderWidth: 1, borderColor: G.borderGold,
  },
  stakeItem: { flex: 1, alignItems: 'center', gap: 2 },
  stakeDivider: { width: 1, height: 28, backgroundColor: G.borderGold },
  stakeLabel: { color: G.textSecondary, fontSize: 8, fontWeight: '500', textTransform: 'uppercase' },
  stakeValue: { color: G.textPrimary, fontSize: 16, fontWeight: '700' },
  stakeValueGold: { color: G.gold, fontSize: 16, fontWeight: '700' },

  playersRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  playersText: { color: G.textSecondary, fontSize: 10, fontWeight: '500' },
  progressBar: { flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: 2, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: G.gold, borderRadius: 2 },

  // CTA with glow
  ctaWrap: { alignItems: 'center', justifyContent: 'center' },
  ctaGlow: {
    position: 'absolute',
    width: '105%',
    height: '140%',
    borderRadius: 12,
    backgroundColor: G.glowGold,
  },
  ctaButton: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    backgroundColor: G.gold, paddingVertical: 11, borderRadius: 10, width: '100%',
    shadowColor: G.gold, shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 6,
  },
  ctaText: { color: G.bg, fontSize: 12, fontWeight: '800', letterSpacing: 1.2 },
});
