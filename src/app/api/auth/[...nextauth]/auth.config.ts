import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

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
                        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signin`,
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
                            role: data.role, // Ενημερωμένο
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
                token.role = user.role; // Ενημερωμένο
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.accessToken = token.accessToken;
                session.user.role = token.role; // Ενημερωμένο
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
        maxAge: 60 * 60 * 24, // 24 hours
    },
};