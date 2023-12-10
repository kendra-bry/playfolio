import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, title, userId } = req.body;

  if (req.method === 'POST') {
    try {
      const game = await prisma.game.create({
        data: {
          title,
          apiId: id,
          playerId: userId,
          backlog: true,
        },
      });

      res.status(201).json({ status: 'Success' });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to add to backlog' });
    } finally {
        prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
