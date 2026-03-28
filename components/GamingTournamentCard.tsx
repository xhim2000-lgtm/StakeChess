import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';

const G = Colors.gaming;
const { width: SCREEN_W, height: SCREEN_H } = Dimensions.get('window');
// Landscape: cards sized to fit visible height minus header/tabs
const CARD_WIDTH = Math.min(SCREEN_W * 0.35, 320);

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
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 100,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, index]);

  const fillPct = (tournament.players / tournament.maxPlayers) * 100;

  return (
    <Animated.View style={[styles.cardOuter, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => router.push(`/online/${tournament.id}`)}
      >
        {/* Background layers */}
        <View style={[styles.bgLayer, { backgroundColor: tournament.bgColors[0] }]} />
        <View style={[styles.bgGradientTop, { backgroundColor: tournament.bgColors[1] }]} />
        <View style={styles.bgGradientBottom} />

        {/* Decorative chess piece */}
        <View style={styles.bgIcon}>
          <Text style={styles.bgIconText}>{tournament.icon}</Text>
        </View>

        {/* Gold top border */}
        <View style={styles.goldBorderTop} />

        {/* Content */}
        <View style={styles.content}>
          {/* Top: Badge + Status */}
          <View style={styles.topRow}>
            <View style={[styles.badge, { borderColor: tournament.badgeColor }]}>
              <Text style={[styles.badgeText, { color: tournament.badgeColor }]}>{tournament.badge}</Text>
            </View>
            {tournament.status === 'live' && (
              <View style={styles.liveBadge}>
                <View style={styles.liveIndicator} />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
            )}
          </View>

          {/* Title + Location */}
          <View style={styles.middleSection}>
            <Text style={styles.locationText}>{tournament.location}</Text>
            <Text style={styles.nameText} numberOfLines={1}>{tournament.name}</Text>
          </View>

          {/* Stakes + Button */}
          <View style={styles.bottomSection}>
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

            {/* Players bar */}
            <View style={styles.playersSection}>
              <View style={styles.playersRow}>
                <Ionicons name="people" size={10} color={G.textSecondary} />
                <Text style={styles.playersText}>
                  {tournament.players}/{tournament.maxPlayers}
                </Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: `${fillPct}%` as any }]} />
              </View>
            </View>

            {/* CTA */}
            <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
              <Ionicons name="flash" size={14} color={G.bg} />
              <Text style={styles.ctaText}>REJOINDRE</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    width: CARD_WIDTH,
    marginRight: 14,
  },
  card: {
    height: 260,
    borderRadius: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  bgLayer: {
    ...StyleSheet.absoluteFillObject,
  },
  bgGradientTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '50%',
    opacity: 0.5,
  },
  bgGradientBottom: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '65%',
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  bgIcon: {
    position: 'absolute',
    top: 16,
    right: 12,
    opacity: 0.1,
  },
  bgIconText: {
    fontSize: 60,
  },
  goldBorderTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: G.gold,
    opacity: 0.6,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
    zIndex: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderWidth: 1.5,
    borderRadius: 5,
    paddingHorizontal: 8,
    paddingVertical: 3,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  badgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 61, 61, 0.2)',
    borderWidth: 1,
    borderColor: G.red,
    borderRadius: 5,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  liveIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    backgroundColor: G.red,
  },
  liveText: {
    color: G.red,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 1,
  },
  middleSection: {
    marginTop: 'auto',
  },
  locationText: {
    color: G.gold,
    fontSize: 9,
    fontWeight: '600',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  nameText: {
    color: G.textPrimary,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  bottomSection: {
    gap: 6,
  },
  stakesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  stakeItem: {
    flex: 1,
    alignItems: 'center',
    gap: 1,
  },
  stakeDivider: {
    width: 1,
    height: 24,
    backgroundColor: G.borderGold,
  },
  stakeLabel: {
    color: G.textSecondary,
    fontSize: 8,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  stakeValue: {
    color: G.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  stakeValueGold: {
    color: G.gold,
    fontSize: 14,
    fontWeight: '700',
  },
  playersSection: {
    gap: 3,
  },
  playersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  playersText: {
    color: G.textSecondary,
    fontSize: 10,
    fontWeight: '500',
  },
  progressBar: {
    height: 2,
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 1,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: G.gold,
    borderRadius: 1,
  },
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    backgroundColor: G.gold,
    paddingVertical: 9,
    borderRadius: 8,
    shadowColor: G.gold,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 6,
  },
  ctaText: {
    color: G.bg,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
