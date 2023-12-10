import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, title, startDate, endDate, rating, comment, userId } = req.body;

  if (req.method === 'POST') {
    try {
      const game = await prisma.game.create({
        data: {
          title,
          startDate: startDate ? new Date(startDate): null,
          endDate: endDate ? new Date(endDate) : null,
          apiId: id,
          playerId: userId,
          library: true,
        },
      });

      const review = await prisma.review.create({
        data: {
          rating,
          comment,
          gameId: game.id,
          playerId: userId,
        },
      });

      res.status(201).json({ status: 'Success' });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to add to library' });
    } finally {
      prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
