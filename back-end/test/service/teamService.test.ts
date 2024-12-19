// import {
//     createTeam,
//     addPlayerToTeam,
//     removePlayerFromTeam,
//     getTeamPlayers,
//     updatePlayerRole,
//   } from '../../service/teamService';
//   import prismaMock from '../../_mocks_/prismaClient';
  
//   describe('teamService', () => {
//     afterEach(() => {
//       jest.clearAllMocks();
//     });
  
//     test('should create a new team successfully', async () => {
//       const mockTeam = {
//         id: 'team-id',
//         name: 'Team A',
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
  
//       prismaMock.team.create.mockResolvedValue(mockTeam);
  
//       const result = await createTeam('Team A');
  
//       expect(prismaMock.team.create).toHaveBeenCalledWith({
//         data: { name: 'Team A' },
//       });
//       expect(result).toEqual(mockTeam);
//     });
  
//     test('should not create a duplicate team', async () => {
//       prismaMock.team.create.mockRejectedValue(new Error('Unique constraint failed'));
  
//       await expect(createTeam('Team A')).rejects.toThrow('Unique constraint failed');
//       expect(prismaMock.team.create).toHaveBeenCalledWith({
//         data: { name: 'Team A' },
//       });
//     });
  
//     test('should add a player to an existing team', async () => {
//       const mockTeam = {
//         id: 'team-id',
//         players: [],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
//       const mockPlayer = {
//         id: 'player-id',
//         name: 'MS Dhoni',
//         role: 'Batsman',
//         teamId: 'team-id',
//       };
  
//       prismaMock.team.findUnique.mockResolvedValue(mockTeam);
//       prismaMock.player.create.mockResolvedValue(mockPlayer);
  
//       const result = await addPlayerToTeam('team-id', 'MS Dhoni', 'Batsman');
  
//       expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
//         where: { id: 'team-id' },
//         include: { players: true },
//       });
//       expect(prismaMock.player.create).toHaveBeenCalledWith({
//         data: {
//           name: 'MS Dhoni',
//           role: 'Batsman',
//           teamId: 'team-id',
//         },
//       });
//       expect(result).toEqual(mockPlayer);
//     });
  
//     test('should not add a 12th player to a team', async () => {
//       const mockTeam = {
//         id: 'team-id',
//         players: Array(11).fill({ id: 'player-id' }), // Mock a full team
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
  
//       prismaMock.team.findUnique.mockResolvedValue(mockTeam);
  
//       await expect(addPlayerToTeam('team-id', 'New Player', 'Bowler')).rejects.toThrow(
//         'A team cannot have more than 11 players.'
//       );
  
//       expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
//         where: { id: 'team-id' },
//         include: { players: true },
//       });
//       expect(prismaMock.player.create).not.toHaveBeenCalled();
//     });
  
//     test('should remove a player from a team', async () => {
//       const mockTeam = {
//         id: 'team-id',
//         players: [{ id: 'player-id', name: 'John Doe', role: 'Batsman' }],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
  
//       prismaMock.team.findUnique.mockResolvedValue(mockTeam);
//       prismaMock.player.delete.mockResolvedValue({} as any);
  
//       const result = await removePlayerFromTeam('team-id', 'player-id');
  
//       expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
//         where: { id: 'team-id' },
//         include: { players: true },
//       });
//       expect(prismaMock.player.delete).toHaveBeenCalledWith({
//         where: { id: 'player-id' },
//       });
//       expect(result).toBe(true);
//     });
  
//     test('should retrieve all players in a team', async () => {
//       const mockTeam = {
//         id: 'team-id',
//         players: [
//           { id: 'player-1', name: 'Player 1', role: 'Batsman' },
//           { id: 'player-2', name: 'Player 2', role: 'Bowler' },
//         ],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       };
  
//       prismaMock.team.findUnique.mockResolvedValue(mockTeam);
  
//       const result = await getTeamPlayers('team-id');
  
//       expect(prismaMock.team.findUnique).toHaveBeenCalledWith({
//         where: { id: 'team-id' },
//         include: { players: true },
//       });
//       expect(result).toEqual(mockTeam.players);
//     });
  
//     test('should update a player role successfully', async () => {
//       const mockPlayer = {
//         id: 'player-id',
//         name: 'John Doe',
//         role: 'Batsman',
//         teamId: 'team-id',
//       };
  
//       prismaMock.team.findUnique.mockResolvedValue({
//         id: 'team-id',
//         players: [mockPlayer],
//         createdAt: new Date(),
//         updatedAt: new Date(),
//       });
//       prismaMock.player.update.mockResolvedValue({
//         ...mockPlayer,
//         role: 'Bowler',
//       });
  
//       const result = await updatePlayerRole('team-id', 'player-id', 'Bowler');
  
//       expect(prismaMock.player.update).toHaveBeenCalledWith({
//         where: { id: 'player-id' },
//         data: { role: 'Bowler' },
//       });
//       expect(result).toEqual({ ...mockPlayer, role: 'Bowler' });
//     });
//   });
  