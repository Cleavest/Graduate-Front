import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { NextAuthOptions } from 'next-auth';

export const authOptions: NextAuthOptions = {
    providers: [
        CredentialsProvider({
            name: 'Credentials',
            credentials: {
                email: { label: 'Email', type: 'email' },
                password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials) {
                try {
                    const res = await fetch(
                        'http://128.140.98.82:8084/api/auth/signin',
                        {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                email: credentials?.email,
                                password: credentials?.password,
                            }),
                        }
                    );

                    const data = await res.json();

                    if (res.ok && data) {
                        return {
                            id: data.user_id,
                            email: credentials?.email,
                            accessToken: data.token,
                            expiresAt: data.expires_at,
                            issuedAt: data.issued_at,
                        };
                    }
                    return null;
                } catch (error) {
                    throw new Error('Authentication failed');
                }
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken as string;
            }
            return session;
        },
    },
    pages: {
        signIn: '/login',
    },
    session: {
        strategy: 'jwt',
        maxAge: 60 * 60, // 1 hour
    },
    jwt: {
        maxAge: 60 * 60 * 24, // 24 ώρες
    },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
