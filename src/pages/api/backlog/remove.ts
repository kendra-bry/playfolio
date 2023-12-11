import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { gameId } = req.body;

  if (!gameId) {
    res.status(405).json({ error: 'Missing required values' });
  }

  if (req.method === 'DELETE') {
    try {
      await prisma.game.delete({
        where: { id: gameId },
      });

      res.status(200).json({ message: 'Game removed from backlog' });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to remove from backlog' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
