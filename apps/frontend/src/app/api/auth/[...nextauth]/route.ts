import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import axios from 'axios';

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          const response = await axios.post(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/auth/login`,
            {
              email: credentials?.email,
              password: credentials?.password,
            }
          );

          if (response.data.user && response.data.token) {
            return {
              ...response.data.user,
              accessToken: response.data.token,
            };
          }

          return null;
        } catch (error) {
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.role = (user as any).role;
        token.name = (user as any).name;
        token.email = (user as any).email;
      }
      return token;
    },
    async session({ session, token }) {
      (session as any).accessToken = token.accessToken;
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).name = token.name;
        session.user.email = token.email as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
});

export { handler as GET, handler as POST };
