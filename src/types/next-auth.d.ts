import 'next-auth';

declare module 'next-auth' {
    interface Session {
        user: {
            id: string;
            role: string;
            accessToken: string;
        } & DefaultSession['user'];
    }

    interface User extends DefaultUser {
        role: string;
        accessToken: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT extends DefaultJWT {
        role: string;
        accessToken: string;
    }
}
