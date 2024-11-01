// back-end/test/model/Team.test.ts

import { Team } from '../../model/Team';
import { User } from '../../model/User';

describe('Team Model', () => {
  it('should create a new Team', () => {
    const team = new Team('1', 'Team A', '1');
    expect(team).toBeInstanceOf(Team);
    expect(team.name).toBe('Team A');
    expect(team.players).toHaveLength(0);
  });

  it('should add a player to the team', () => {
    const team = new Team('1', 'Team A', '1');
    const player = new User('2', 'Jane Doe', 'jane@example.com', 'password123', 'player');
    team.addPlayer(player);
    expect(team.players).toContain(player);
  });

  it('should remove a player from the team', () => {
    const team = new Team('1', 'Team A', '1');
    const player = new User('2', 'Jane Doe', 'jane@example.com', 'password123', 'player');
    team.addPlayer(player);
    team.removePlayer(player.user_id);
    expect(team.players).not.toContain(player);
  });
});
