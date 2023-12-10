import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/helpers/server-helpers';
import prisma from '@/lib/prisma';
import bcrypt from 'bcryptjs';

const POST = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(422).json({ message: 'Invalid data' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await connectToDatabase();
    const user = await prisma.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    return res.status(201).send({ status: 'success' });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: 'Server Error' });
  } finally {
    await prisma.$disconnect();
  }
};

export default POST;
