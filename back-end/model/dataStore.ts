// src/model/dataStore.ts
import { TeamEntity } from './Team';
import { Player, PlayerEntity } from './Player';
import { JoinRequest } from '../types';
import { GameEntity } from './Game';

// Initialize with dummy data
export const teams: TeamEntity[] = [
  new TeamEntity('1', 'Team A', [
    new PlayerEntity('1', 'Player 1', 'Batsman', '1'),
    new PlayerEntity('2', 'Player 2', 'Bowler', '1'),
  ]),
  new TeamEntity('2', 'Team B', [
    new PlayerEntity('3', 'Player 3', 'All-rounder', '2'),
    new PlayerEntity('4', 'Player 4', 'Wicket Keeper', '2'),
  ]),
];
export const players: Player[] = [];
export const joinRequests: JoinRequest[] = [];

export const games: GameEntity[] = [
  new GameEntity('1', 'Team A', 'Team B', '2024-11-23', '19:30', 'Chepauk, Chennai'),
  new GameEntity('2', 'Team B', 'Team A', '2024-12-01', '18:00', 'Jinnah Stadium, Islamabad'),
]

