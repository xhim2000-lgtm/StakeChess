import React, { useState, useRef, useEffect } from 'react';
import {
  View, Text, ScrollView, TextInput, TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import { ChessBoard } from './ChessBoard';
import { Chess } from 'chess.js';

const G = Colors.gaming;

interface PlayerInfo {
  name: string;
  level: string;
  elo: number;
  avatar: string;
  avatarColor: string;
  isAI?: boolean;
  aiIcon?: string;
}

interface GameLayoutProps {
  game: Chess;
  opponent: PlayerInfo;
  player: PlayerInfo;
  whiteTime: number;
  blackTime: number;
  isWhiteTurn: boolean;
  gameActive: boolean;
  moveHistory: string[];
  onGameEnd: (result: 'white' | 'black' | 'draw') => void;
  onMove: () => void;
  onResign: () => void;
  onDrawOffer: () => void;
  playerColor?: 'w' | 'b';
  lastMove?: { from: string; to: string } | null;
  locked?: boolean;
  /** Extra content below player card (e.g. result + restart) */
  bottomExtra?: React.ReactNode;
}

interface ChatMessage {
  id: number;
  sender: 'player' | 'opponent' | 'system';
  name: string;
  text: string;
}

const QUICK_MESSAGES = ['Bien joué !', 'Bonne chance', 'Merci', 'GG'];

function formatTimer(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

export function GameLayout({
  game, opponent, player, whiteTime, blackTime, isWhiteTurn, gameActive,
  moveHistory, onGameEnd, onMove, onResign, onDrawOffer, playerColor = 'w',
  lastMove, locked, bottomExtra,
}: GameLayoutProps) {
  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: 0, sender: 'system', name: 'Système', text: 'La partie a commencé. Bonne chance !' },
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatScrollRef = useRef<ScrollView>(null);
  const nextId = useRef(1);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const msg: ChatMessage = { id: nextId.current++, sender: 'player', name: player.name, text: text.trim() };
    setMessages(prev => [...prev, msg]);
    setChatInput('');

    setTimeout(() => {
      const replies = ['Merci !', 'Bien joué !', '...', 'Intéressant.', 'Hmm...'];
      const reply: ChatMessage = {
        id: nextId.current++,
        sender: 'opponent',
        name: opponent.name,
        text: replies[Math.floor(Math.random() * replies.length)],
      };
      setMessages(prev => [...prev, reply]);
    }, 1500 + Math.random() * 2000);
  };

  useEffect(() => {
    chatScrollRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Format move history into numbered pairs
  const formattedMoves: string[] = [];
  for (let i = 0; i < moveHistory.length; i += 2) {
    const num = Math.floor(i / 2) + 1;
    const white = moveHistory[i] || '';
    const black = moveHistory[i + 1] || '';
    formattedMoves.push(`${num}. ${white} ${black}`);
  }

  const opponentTimerActive = gameActive && !isWhiteTurn;
  const playerTimerActive = gameActive && isWhiteTurn;

  return (
    <View style={styles.root}>
      {/* Decorative background pieces */}
      <Text style={styles.bgPieceLeft}>{'\u265B'}</Text>
      <Text style={styles.bgPieceRight}>{'\u2654'}</Text>

      {/* ── STAKE CHESS Header ── */}
      <View style={styles.gameHeader}>
        <View style={styles.gameHeaderLeft}>
          <Text style={styles.gameHeaderIcon}>{'\u265A'}</Text>
          <View>
            <Text style={styles.gameHeaderTitle}>
              STAKE <Text style={styles.gameHeaderTitleGold}>CHESS</Text>
            </Text>
          </View>
        </View>
        <View style={styles.gameHeaderCenter}>
          <View style={styles.gameHeaderDiamond} />
          <Text style={styles.gameHeaderSubtitle}>PARTIE EN COURS</Text>
          <View style={styles.gameHeaderDiamond} />
        </View>
        <View style={styles.gameHeaderRight}>
          <Ionicons name="settings-outline" size={16} color={G.textMuted} />
        </View>
      </View>

      <View style={styles.threeColumns}>
        {/* ═══ LEFT COLUMN ═══ */}
        <View style={styles.leftCol}>
          {/* Opponent card */}
          <View style={styles.playerCard}>
            <View style={styles.playerCardRow}>
              {opponent.isAI ? (
                <View style={[styles.avatarCircle, { borderColor: opponent.avatarColor }]}>
                  <Ionicons name={opponent.aiIcon as any || 'hardware-chip-outline'} size={20} color={opponent.avatarColor} />
                </View>
              ) : (
                <View style={[styles.avatarCircle, { backgroundColor: opponent.avatarColor }]}>
                  <Text style={styles.avatarText}>{opponent.avatar}</Text>
                </View>
              )}
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{opponent.name}</Text>
                <Text style={styles.playerLevel}>{opponent.level}</Text>
                <Text style={styles.playerElo}>Elo {opponent.elo}</Text>
              </View>
            </View>
          </View>

          {/* Opponent timer */}
          <View style={[styles.timerBox, opponentTimerActive && styles.timerBoxActive]}>
            <Ionicons name="time-outline" size={14} color={opponentTimerActive ? G.bg : G.textMuted} />
            <Text style={[styles.timerText, opponentTimerActive && styles.timerTextActive]}>
              [{formatTimer(blackTime)}]
            </Text>
          </View>

          {/* Move history */}
          <View style={styles.movesBox}>
            <Text style={styles.movesTitle}>COUPS</Text>
            <ScrollView style={styles.movesScroll} showsVerticalScrollIndicator={false}>
              {formattedMoves.map((line, i) => (
                <Text key={i} style={styles.moveLine}>{line}</Text>
              ))}
              {formattedMoves.length === 0 && (
                <Text style={styles.moveEmpty}>En attente...</Text>
              )}
            </ScrollView>
          </View>

          {/* Player timer */}
          <View style={[styles.timerBox, playerTimerActive && styles.timerBoxActive]}>
            <Ionicons name="time-outline" size={14} color={playerTimerActive ? G.bg : G.textMuted} />
            <Text style={[styles.timerText, playerTimerActive && styles.timerTextActive]}>
              [{formatTimer(whiteTime)}]
            </Text>
          </View>

          {/* Player card */}
          <View style={styles.playerCard}>
            <View style={styles.playerCardRow}>
              <View style={[styles.avatarCircle, { backgroundColor: player.avatarColor }]}>
                <Text style={styles.avatarText}>{player.avatar}</Text>
              </View>
              <View style={styles.playerInfo}>
                <Text style={styles.playerName}>{player.name}</Text>
                <Text style={styles.playerLevel}>{player.level}</Text>
                <Text style={styles.playerElo}>Elo {player.elo}</Text>
              </View>
            </View>
          </View>

          {/* Action buttons */}
          {gameActive && (
            <View style={styles.actionButtons}>
              <TouchableOpacity style={styles.drawBtn} onPress={onDrawOffer}>
                <Text style={styles.drawBtnText}>PROPOSER NUL</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.resignBtn} onPress={onResign}>
                <Text style={styles.resignBtnText}>ABANDONNER</Text>
              </TouchableOpacity>
            </View>
          )}

          {bottomExtra}
        </View>

        {/* ═══ CENTER COLUMN — Board ═══ */}
        <View style={styles.centerCol}>
          <ChessBoard
            game={game}
            onMove={onMove}
            onGameEnd={onGameEnd}
            locked={locked}
            playerColor={playerColor}
            lastMove={lastMove}
          />
        </View>

        {/* ═══ RIGHT COLUMN — Chat ═══ */}
        <View style={styles.rightCol}>
          <View style={styles.chatHeader}>
            <Ionicons name="chatbubbles-outline" size={14} color={G.gold} />
            <Text style={styles.chatHeaderText}>CHAT DE PARTIE</Text>
          </View>

          <ScrollView
            ref={chatScrollRef}
            style={styles.chatMessages}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.chatMessagesContent}
          >
            {messages.map(msg => {
              const isPlayer = msg.sender === 'player';
              const isSystem = msg.sender === 'system';
              return (
                <View key={msg.id} style={[
                  styles.chatBubbleWrap,
                  isPlayer && styles.chatBubbleWrapRight,
                ]}>
                  {isSystem ? (
                    <View style={styles.systemMsg}>
                      <Text style={styles.systemMsgText}>{msg.text}</Text>
                    </View>
                  ) : (
                    <View style={[styles.chatBubble, isPlayer ? styles.chatBubblePlayer : styles.chatBubbleOpponent]}>
                      <Text style={[styles.chatSender, isPlayer && styles.chatSenderPlayer]}>
                        {msg.name}
                      </Text>
                      <Text style={[styles.chatText, isPlayer && styles.chatTextPlayer]}>
                        {msg.text}
                      </Text>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>

          {/* Quick messages */}
          <View style={styles.quickMsgs}>
            {QUICK_MESSAGES.map((qm, i) => (
              <TouchableOpacity key={i} style={styles.quickMsgBtn} onPress={() => sendMessage(qm)}>
                <Text style={styles.quickMsgText}>{qm}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Input */}
          <View style={styles.chatInputRow}>
            <TextInput
              style={styles.chatInput}
              placeholder="DITES QUELQUE CHOSE..."
              placeholderTextColor={G.textMuted}
              value={chatInput}
              onChangeText={setChatInput}
              onSubmitEditing={() => sendMessage(chatInput)}
              returnKeyType="send"
            />
            <TouchableOpacity style={styles.sendBtn} onPress={() => sendMessage(chatInput)}>
              <Ionicons name="send" size={16} color={G.gold} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Bottom nav bar */}
      <View style={styles.bottomNav}>
        {([
          { icon: 'play-circle', label: 'JOUER', active: true },
          { icon: 'cart', label: 'BOUTIQUE', active: false },
          { icon: 'calendar', label: 'ÉVÉNEMENTS', active: false },
          { icon: 'people', label: 'AMIS', active: false },
        ] as const).map((item, i) => (
          <TouchableOpacity key={i} style={styles.navItem}>
            <Ionicons
              name={item.icon as any}
              size={20}
              color={item.active ? G.gold : G.textMuted}
            />
            <Text style={[styles.navLabel, item.active && styles.navLabelActive]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: G.bg,
  },
  bgPieceLeft: {
    position: 'absolute', left: 20, top: '20%', fontSize: 160,
    color: G.gold, opacity: 0.02, zIndex: 0,
  },
  bgPieceRight: {
    position: 'absolute', right: 20, bottom: '15%', fontSize: 160,
    color: G.gold, opacity: 0.02, zIndex: 0,
  },

  // ── STAKE CHESS Header ──
  gameHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.85)',
    borderBottomWidth: 1,
    borderBottomColor: G.borderGold,
    zIndex: 2,
  },
  gameHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gameHeaderIcon: {
    fontSize: 22,
    color: G.gold,
  },
  gameHeaderTitle: {
    color: G.textPrimary,
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 2,
  },
  gameHeaderTitleGold: {
    color: G.gold,
  },
  gameHeaderCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  gameHeaderDiamond: {
    width: 6,
    height: 6,
    backgroundColor: G.gold,
    transform: [{ rotate: '45deg' }],
  },
  gameHeaderSubtitle: {
    color: G.goldMuted,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 2,
  },
  gameHeaderRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },

  // ── 3-column layout ──
  threeColumns: {
    flex: 1,
    flexDirection: 'row',
    zIndex: 1,
  },
  leftCol: {
    width: '25%',
    padding: 10,
    justifyContent: 'center',
    gap: 6,
  },
  centerCol: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rightCol: {
    width: '25%',
    borderLeftWidth: 1,
    borderLeftColor: G.borderLight,
  },

  // ── Player cards ──
  playerCard: {
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  playerCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  avatarCircle: {
    width: 36, height: 36, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1.5, borderColor: G.borderGold,
  },
  avatarText: {
    color: '#FFF', fontSize: 13, fontWeight: '700',
  },
  playerInfo: { flex: 1 },
  playerName: { color: G.textPrimary, fontSize: 13, fontWeight: '700' },
  playerLevel: { color: G.goldMuted, fontSize: 9, fontWeight: '600', letterSpacing: 1, textTransform: 'uppercase' },
  playerElo: { color: G.gold, fontSize: 10, fontWeight: '600' },

  // ── Timers ──
  timerBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: G.bgTertiary,
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: G.borderLight,
  },
  timerBoxActive: {
    backgroundColor: G.gold,
    borderColor: G.gold,
  },
  timerText: {
    color: G.gold,
    fontSize: 18,
    fontWeight: '800',
    fontVariant: ['tabular-nums'],
    letterSpacing: 1,
  },
  timerTextActive: {
    color: G.bg,
  },

  // ── Move history ──
  movesBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 8,
    padding: 8,
    minHeight: 60,
  },
  movesTitle: {
    color: G.gold,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  movesScroll: { flex: 1 },
  moveLine: {
    color: G.textSecondary,
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 18,
    fontVariant: ['tabular-nums'],
  },
  moveEmpty: {
    color: G.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
  },

  // ── Action buttons ──
  actionButtons: {
    gap: 6,
  },
  drawBtn: {
    borderWidth: 1.5,
    borderColor: G.gold,
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  drawBtnText: {
    color: G.gold,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  resignBtn: {
    borderWidth: 1.5,
    borderColor: '#FF6B4A',
    borderRadius: 20,
    paddingVertical: 8,
    alignItems: 'center',
  },
  resignBtnText: {
    color: '#FF6B4A',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },

  // ── Chat ──
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: G.borderGold,
  },
  chatHeaderText: {
    color: G.gold,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  chatMessages: {
    flex: 1,
  },
  chatMessagesContent: {
    padding: 8,
    gap: 8,
  },
  chatBubbleWrap: {
    alignItems: 'flex-start',
  },
  chatBubbleWrapRight: {
    alignItems: 'flex-end',
  },
  chatBubble: {
    maxWidth: '85%',
    borderRadius: 10,
    padding: 8,
  },
  chatBubbleOpponent: {
    backgroundColor: G.bgTertiary,
    borderTopLeftRadius: 2,
  },
  chatBubblePlayer: {
    backgroundColor: 'rgba(212,175,55,0.15)',
    borderTopRightRadius: 2,
    borderWidth: 1,
    borderColor: G.borderGold,
  },
  chatSender: {
    color: G.textMuted,
    fontSize: 9,
    fontWeight: '700',
    marginBottom: 2,
    letterSpacing: 0.5,
  },
  chatSenderPlayer: {
    color: G.goldMuted,
  },
  chatText: {
    color: G.textPrimary,
    fontSize: 12,
  },
  chatTextPlayer: {
    color: G.goldLight,
  },
  systemMsg: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  systemMsgText: {
    color: G.textMuted,
    fontSize: 10,
    fontStyle: 'italic',
  },
  quickMsgs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderTopWidth: 1,
    borderTopColor: G.borderLight,
  },
  quickMsgBtn: {
    borderWidth: 1,
    borderColor: G.borderGold,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  quickMsgText: {
    color: G.gold,
    fontSize: 9,
    fontWeight: '600',
  },
  chatInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    gap: 6,
    borderTopWidth: 1,
    borderTopColor: G.borderLight,
  },
  chatInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: G.borderGold,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    color: G.textPrimary,
    fontSize: 11,
  },
  sendBtn: {
    width: 32, height: 32, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(212,175,55,0.1)',
  },

  // ── Bottom nav ──
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(0,0,0,0.95)',
    borderTopWidth: 1,
    borderTopColor: G.borderLight,
    paddingVertical: 6,
    zIndex: 1,
  },
  navItem: {
    alignItems: 'center',
    gap: 2,
  },
  navLabel: {
    color: G.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  navLabelActive: {
    color: G.gold,
  },
});
