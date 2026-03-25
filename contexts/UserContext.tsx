import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { UserProfile, TournamentHistoryEntry } from '@/types';

interface UserContextType {
  user: UserProfile;
  addBalance: (amount: number) => void;
  deductBalance: (amount: number) => boolean;
  registerForTournament: (tournamentId: string, buyIn: number) => boolean;
  unregisterFromTournament: (tournamentId: string, refund: number) => void;
  isRegistered: (tournamentId: string) => boolean;
  addTournamentHistory: (entry: TournamentHistoryEntry) => void;
  addEarnings: (amount: number) => void;
}

const defaultUser: UserProfile = {
  id: 'user1',
  pseudo: 'Vous',
  elo: 1850,
  balance: 100,
  avatar: 'VS',
  avatarColor: '#2C5F7C',
  tournamentsPlayed: 12,
  wins: 7,
  draws: 3,
  losses: 2,
  totalEarnings: 450,
  registeredTournaments: [],
  tournamentHistory: [
    {
      tournamentId: 't3',
      tournamentName: 'Blitz Masters 25€',
      date: new Date(Date.now() - 24 * 3600000).toISOString(),
      rank: 5,
      totalPlayers: 20,
      earnings: 0,
      type: 'blitz',
    },
    {
      tournamentId: 't7',
      tournamentName: 'Rapide Elite 100€',
      date: new Date(Date.now() - 48 * 3600000).toISOString(),
      rank: 2,
      totalPlayers: 16,
      earnings: 480,
      type: 'rapide',
    },
    {
      tournamentId: 't10',
      tournamentName: 'Classique Legends 100€',
      date: new Date(Date.now() - 72 * 3600000).toISOString(),
      rank: 8,
      totalPlayers: 12,
      earnings: 0,
      type: 'classique',
    },
  ],
};

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile>(defaultUser);

  const addBalance = useCallback((amount: number) => {
    setUser(prev => ({ ...prev, balance: prev.balance + amount }));
  }, []);

  const deductBalance = useCallback((amount: number): boolean => {
    let success = false;
    setUser(prev => {
      if (prev.balance >= amount) {
        success = true;
        return { ...prev, balance: prev.balance - amount };
      }
      return prev;
    });
    return success;
  }, []);

  const registerForTournament = useCallback((tournamentId: string, buyIn: number): boolean => {
    let success = false;
    setUser(prev => {
      if (prev.balance >= buyIn && !prev.registeredTournaments.includes(tournamentId)) {
        success = true;
        return {
          ...prev,
          balance: prev.balance - buyIn,
          registeredTournaments: [...prev.registeredTournaments, tournamentId],
        };
      }
      return prev;
    });
    return success;
  }, []);

  const unregisterFromTournament = useCallback((tournamentId: string, refund: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + refund,
      registeredTournaments: prev.registeredTournaments.filter(id => id !== tournamentId),
    }));
  }, []);

  const isRegistered = useCallback((tournamentId: string): boolean => {
    return user.registeredTournaments.includes(tournamentId);
  }, [user.registeredTournaments]);

  const addTournamentHistory = useCallback((entry: TournamentHistoryEntry) => {
    setUser(prev => ({
      ...prev,
      tournamentsPlayed: prev.tournamentsPlayed + 1,
      tournamentHistory: [entry, ...prev.tournamentHistory],
    }));
  }, []);

  const addEarnings = useCallback((amount: number) => {
    setUser(prev => ({
      ...prev,
      balance: prev.balance + amount,
      totalEarnings: prev.totalEarnings + amount,
    }));
  }, []);

  return (
    <UserContext.Provider value={{
      user,
      addBalance,
      deductBalance,
      registerForTournament,
      unregisterFromTournament,
      isRegistered,
      addTournamentHistory,
      addEarnings,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
