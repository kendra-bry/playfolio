import { connectToDatabase } from '@/helpers/server-helpers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' });
      return;
    }
    const { email, password } = req.body;

    await connectToDatabase();
    const user = await prisma.user.findFirst({ where: { email } });

    if (!user) {
      return res
        .status(404)
        .send({ message: 'Username or password is incorrect.' });
    }

    const correctPassword = await bcrypt.compare(password, user.password);

    if (!correctPassword) {
      return res
        .status(404)
        .send({ message: 'Username or password is incorrect.' });
    }

    const cleanUser = JSON.parse(JSON.stringify(user));
    delete cleanUser.password;

    res.status(200).json(cleanUser);
  } catch (error: any) {
    console.log(error);
    return res.status(405).send({ message: `${error.message}` });
  } finally {
    await prisma.$disconnect();
  }
};

export default POST;
