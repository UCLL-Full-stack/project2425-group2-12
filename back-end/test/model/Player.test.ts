// // src/model/Player.test.ts

// import { PlayerEntity } from "../../model/Player";

// describe('PlayerEntity', () => {
//   it('should create a valid player', () => {
//     const player = new PlayerEntity('123', 'MS Dhoni', 'Batsman', 'abc');
//     expect(player.id).toBe('123');
//     expect(player.name).toBe('MS Dhoni');
//     expect(player.role).toBe('Batsman');
//     expect(player.teamId).toBe('abc');
//   });

//   it('should throw an error for missing name', () => {
//     expect(() => new PlayerEntity('123', '', 'Batsman', 'abc')).toThrow('Player name is required');
//   });

//   it('should throw an error for invalid role', () => {
//     expect(() => new PlayerEntity('123', 'MS Dhoni', 'Coach' as any, 'abc')).toThrow('Invalid role');
//   });
// });
