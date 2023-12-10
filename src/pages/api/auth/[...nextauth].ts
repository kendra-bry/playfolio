import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { PrismaClient, User } from '@prisma/client';
import { serverApi } from '@/lib/api';

const prisma = new PrismaClient();

enum SessionStrategy {
  JWT = 'jwt',
  Database = 'database',
}

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: SessionStrategy.JWT,
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: {
          label: 'Email',
          type: 'text',
          placeholder: 'Enter email',
        },
        password: {
          label: 'Password',
          type: 'password',
          placeholder: 'Enter Password',
        },
      },

      async authorize(credentials, req) {
        try {
          const { email, password } = credentials as {
            email: string;
            password: string;
          };

          const user = (await serverApi.post('/api/auth/login', {
            email,
            password,
          })) as User;

          if (!user) {
            return null;
          }

          return user;
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: { token: any; user: any }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = `${user.firstName} ${user.lastName}`;
        token.role = user.role;
      }
      return token;
    },
    async session({
      session,
      token,
      user,
    }: {
      session: any;
      token: any;
      user: any;
    }) {
      session.user = token;
      return session;
    },
  },
  pages: {
    signIn: '/auth/signIn',
  },
};

export default NextAuth(authOptions);
