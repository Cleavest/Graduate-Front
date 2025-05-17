import { withAuth } from 'next-auth/middleware';

export default withAuth({
    pages: {
        signIn: '/login',
    },
});

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/profile/:path*',
        '/task/:path*',
        // Προσθέστε εδώ όποια άλλα protected routes θέλετε
    ],
};
