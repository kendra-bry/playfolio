import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const { id, title, userId, imageUrl } = req.body;

  if (!id || !title || !userId) {
    res.status(405).json({ error: 'Missing required values' });
  }

  if (req.method === 'POST') {
    try {
      const existingGame = await prisma.game.findFirst({
        where: { playerId: userId, apiId: +id },
      });

      const data = {
        title,
        imageUrl,
        apiId: id,
        playerId: userId,
        backlog: true,
        library: false,
      };

      let game;

      if (!!existingGame) {
        game = await prisma.game.update({
          where: { id: existingGame.id },
          data,
        });
      } else {
        game = await prisma.game.create({ data });
      }

      res.status(201).json({ status: 'Success' });
    } catch (error) {
      console.log({ error });
      res.status(500).json({ message: 'Unable to add to backlog' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
