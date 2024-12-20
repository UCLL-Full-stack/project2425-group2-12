import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function seedDatabase() {
  try {
    // Clear existing data
    await prisma.participation.deleteMany({});
    await prisma.reservation.deleteMany({});
    await prisma.joinRequest.deleteMany({});
    await prisma.game.deleteMany({});
    await prisma.player.deleteMany({});
    await prisma.team.deleteMany({});
    await prisma.user.deleteMany({}); // Clear users

    console.log('Cleared existing data.');

    // Create Admins
    const admins = await Promise.all([
      prisma.user.create({
        data: {
          email: 'admin1@example.com',
          password: await bcrypt.hash('admin_password', 10),
          role: 'admin',
        },
      }),
      prisma.user.create({
        data: {
          email: 'admin2@example.com',
          password: await bcrypt.hash('admin_password', 10),
          role: 'admin',
        },
      }),
    ]);

    console.log('Admins created:', admins);

    // Create Teams
    const team1 = await prisma.team.create({ data: { name: 'Team A' } });
    const team2 = await prisma.team.create({ data: { name: 'Team B' } });


console.log("Team 1 ID:", team1.id);

console.log("Team 2 ID:", team2.id);


    console.log('Teams created:', [team1, team2]);

    // Create Players
    const player1 = await prisma.player.create({
      data: {
        name: 'John Doe',
        role: 'Batsman',
        teamId: team1.id,
      },
    });
    const player2 = await prisma.player.create({
      data: {
        name: 'Jane Smith',
        role: 'Bowler',
        teamId: team1.id,
      },
    });
    const player3 = await prisma.player.create({
      data: {
        name: 'Alex Brown',
        role: 'All-rounder',
        teamId: team2.id,
      },
    });

    console.log('Players created:', [player1, player2, player3]);

    // Assign Captain Role
    const captain = await prisma.user.create({
      data: {
        email: 'captain1@example.com',
        password: await bcrypt.hash('captain_password', 10),
        role: 'captain',
      },
    });
    await prisma.player.update({
      where: { id: player1.id },
      data: { userId: captain.id },
    });

    console.log('Captain assigned to player:', player1.name);

    // Create Spectators
    const spectator1 = await prisma.spectator.create({
      data: {
        name: 'Chris Wilson',
        email: 'chris@example.com',
      },
    });
    const spectator2 = await prisma.spectator.create({
      data: {
        name: 'Patricia Green',
        email: 'patricia@example.com',
      },
    });

    console.log('Spectators created:', [spectator1, spectator2]);

    // Create Games
    const game1 = await prisma.game.create({
      data: {
        team1Id: team1.id,
        team2Id: team2.id,
        date: new Date('2025-1-22'),
        time: '15:30',
        venue: 'Stadium 1',
      },
    });

    console.log('Game created:', game1);

    // Add Participations
    await prisma.participation.create({
      data: {
        playerId: player1.id,
        gameId: game1.id,
        status: 'confirmed',
      },
    });
    await prisma.participation.create({
      data: {
        playerId: player3.id,
        gameId: game1.id,
        status: 'not confirmed',
      },
    });

    console.log('Participations added.');

    // Add Reservations
    await prisma.reservation.create({
      data: {
        spectatorId: spectator1.id,
        gameId: game1.id,
        status: 'reserved',
      },
    });
    await prisma.reservation.create({
      data: {
        spectatorId: spectator2.id,
        gameId: game1.id,
        status: 'cancelled',
      },
    });

    console.log('Reservations added.');

    // Add Join Requests
    await prisma.joinRequest.create({
      data: {
        playerId: player2.id,
        teamId: team2.id,
        status: 'pending',
        playerName: player2.name,
      },
    });

    console.log('Join requests added.');

    // Backfill Users for Players and Spectators
    await backfillUserIds();

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error during database seeding:', error);
  } finally {
    await prisma.$disconnect();
  }
}

async function backfillUserIds() {
  try {
    const players = await prisma.player.findMany();
    for (const player of players) {
      const email = `${player.name.toLowerCase().replace(/\s+/g, '')}@example.com`;
      const hashedPassword = await bcrypt.hash('default_password', 10);

      // Check if the email already exists in the User table
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`User with email ${email} already exists. Skipping creation.`);
        continue; // Skip to the next iteration if the user exists
      }

      // Log player data
      console.log(`Processing player: ${player.name}, email: ${email}`);

      // Create the User
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'player',
        },
      });

      // Log created user
      console.log(`Created user for player: ${user.id}`);

      // Update the Player with the created User's ID
      await prisma.player.update({
        where: { id: player.id },
        data: { userId: user.id },
      });

      // Log successful update
      console.log(`Updated player ${player.name} with userId: ${user.id}`);
    }

    const spectators = await prisma.spectator.findMany();
    for (const spectator of spectators) {
      const email = spectator.email || `${spectator.name.toLowerCase().replace(/\s+/g, '')}@example.com`;
      const hashedPassword = await bcrypt.hash('default_password', 10);

      // Check if the email already exists in the User table
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        console.log(`User with email ${email} already exists. Skipping creation.`);
        continue; // Skip to the next iteration if the user exists
      }

      // Log spectator data
      console.log(`Seeding user with email: ${email}, password: default_password, hash: ${hashedPassword}`);

      // Create the User
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          role: 'spectator',
        },
      });

      // Log created user
      console.log(`Created user for spectator: ${user.id}`);

      // Update the Spectator with the created User's ID
      await prisma.spectator.update({
        where: { id: spectator.id },
        data: { userId: user.id },
      });

      // Log successful update
      console.log(`Updated spectator ${spectator.name} with userId: ${user.id}`);
    }

    console.log('Backfill for users completed.');
  } catch (error) {
    console.error('Error during backfill:', error);
  }
}


if (require.main === module) {
  seedDatabase();
}
