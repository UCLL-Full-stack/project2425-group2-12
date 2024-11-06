// src/service/teamService.test.ts

import { teams } from "../../model/dataStore";
import { addPlayerToTeam, createTeam, getTeamPlayers, removePlayerFromTeam } from "../../service/teamService";

describe('teamService', () => {
  beforeEach(() => {
    teams.length = 0; // Clear in-memory store before each test
  });

  it('should create a new team', () => {
    const team = createTeam('Team A');
    expect(team.name).toBe('Team A');
    expect(team.players).toEqual([]);
    expect(teams).toContain(team);
  });

  it('should add a player to an existing team', () => {
    const team = createTeam('Team B');
    const player = addPlayerToTeam(team.id, 'MS Dhoni', 'Batsman');
    expect(player).toBeDefined();
    expect(player?.name).toBe('MS Dhoni');
    expect(team.players).toContain(player);
  });

  it('should not add a player if team does not exist', () => {
    const player = addPlayerToTeam('invalid_team_id', 'MS Dhoni', 'Batsman');
    expect(player).toBeNull();
  });

  it('should remove a player from a team', () => {
    const team = createTeam('Team C');
    const player = addPlayerToTeam(team.id, 'MS Dhoni', 'Batsman');
    const result = removePlayerFromTeam(team.id, player!.id);
    expect(result).toBe(true);
    expect(team.players).not.toContain(player);
  });

  it('should not remove a player if team or player does not exist', () => {
    const team = createTeam('Team D');
    const result = removePlayerFromTeam(team.id, 'invalid_player_id');
    expect(result).toBe(false);
  });

  it('should retrieve all players in a team', () => {
    const team = createTeam('Team E');
    addPlayerToTeam(team.id, 'Player 1', 'Bowler');
    addPlayerToTeam(team.id, 'Player 2', 'All-rounder');
    const players = getTeamPlayers(team.id);
    expect(players?.length).toBe(2);
  });
});
