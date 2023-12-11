import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { playerId } = req.query;
  if (!playerId) res.status(405).json({ error: 'Missing query parameters' });

  const parsedUserId = Array.isArray(playerId) ? playerId[0] : playerId;

  if (req.method === 'GET') {
    try {
      const games = await prisma.game.findMany({
        where: {
          playerId: parsedUserId,
          backlog: true,
        }
      });

      res.status(200).json(games);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to get backlog' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
