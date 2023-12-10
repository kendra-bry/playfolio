import prisma from '@/lib/prisma';

export const connectToDatabase = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.log(error);
    throw new Error('Unable to connect to database.');
  }
};

export const convertDatesToStrings = (obj: any): any => {
  if (obj instanceof Date) {
    return obj.toISOString();
  }

  if (typeof obj === 'object' && obj !== null) {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        obj[key] = convertDatesToStrings(obj[key]);
      }
    }
  }

  return obj;
};
