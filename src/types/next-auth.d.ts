import 'next-auth';

declare module 'next-auth' {
    interface User {
        accessToken?: string;
    }

    interface Session {
        user?: User;
    }

    interface JWT {
        accessToken?: string;
    }
}
