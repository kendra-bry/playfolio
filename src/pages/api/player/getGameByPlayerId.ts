import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { playerId, apiId } = req.query;
  if (!playerId || !apiId)
    res.status(405).json({ error: 'Missing query parameters' });

  const parsedUserId = Array.isArray(playerId) ? playerId[0] : playerId;
  const parsedApiId = Array.isArray(apiId) ? apiId[0] : apiId;

  if (req.method === 'GET' && parsedUserId && parsedApiId) {
    try {
      const games = await prisma.game.findFirst({
        where: { playerId: parsedUserId, apiId: +parsedApiId },
        include: { reviews: true },
      });

      if (!!games) {
        res.status(200).json(games);
      }
      res.status(200).json([]);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to get game details' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
