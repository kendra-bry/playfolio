import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { reviewId, gameId, title, startDate, endDate, rating, comment } =
    req.body;

  if (!reviewId || !gameId || !title) {
    res.status(405).json({ error: 'Missing required values' });
  }

  if (req.method === 'POST') {
    try {
      const game = await prisma.game.update({
        where: { id: gameId },
        data: {
          title,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
          reviews: {
            update: {
              where: { id: reviewId },
              data: {
                rating,
                comment,
              },
            },
          },
        },
        include: {
          reviews: true,
        },
      });

      res.status(200).json(game);
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to update review.' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
