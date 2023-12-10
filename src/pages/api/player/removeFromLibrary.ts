import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { gameId } = req.body;
    try {
      await prisma.review.deleteMany({
        where: { gameId },
      });

      await prisma.game.delete({
        where: { id: gameId },
      });

      res.status(200).json({ message: 'Game removed from library' });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to remove from library' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
