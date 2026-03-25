# StakeChess - Tournois d'Echecs en Ligne

Plateforme de tournois d'echecs en ligne avec buy-in et cash prizes.

## Fonctionnalites

- Systeme de monnaie virtuelle (wallet) avec rechargement
- Tournois avec buy-in (5, 10, 25, 50, 100 EUR)
- Cash prizes redistribues aux top 3 (50% / 30% / 20%)
- Echiquier interactif integre (chess.js)
- Classement Swiss System en temps reel
- Profil joueur avec statistiques
- 3 cadences : Blitz (3+2), Rapide (15+10), Classique (90+30)

## Stack Technique

- **React Native** avec **Expo** (expo-router)
- **TypeScript** strict
- **chess.js** pour la logique d'echecs
- Deployable sur **Vercel** (web) et mobile (iOS/Android)

## Installation

```bash
npm install
```

## Developpement

```bash
npm start
# Puis appuyer sur 'w' pour web, 'i' pour iOS, 'a' pour Android
```

## Build pour Vercel

```bash
npm run build
```

## Deploiement

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/xhim2000-lgtm/StakeChess
git push -u origin main
```

Lien Vercel : _a completer apres deploiement_

## Structure du projet

```
app/              # Pages et navigation (expo-router)
  (tabs)/         # Navigation par onglets
  online/[id]/    # Detail et classement des tournois
  game/[matchId]  # Interface de jeu
components/       # Composants reutilisables
contexts/         # Context API (etat global)
data/             # Donnees fictives (MVP)
types/            # Types TypeScript
constants/        # Couleurs et constantes
```
