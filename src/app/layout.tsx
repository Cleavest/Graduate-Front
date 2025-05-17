import AuthProvider from './context/AuthProvider';
import Navigation from './components/Navigation';
import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';

const inter = Inter({ subsets: ['latin'] });

import Favicon from './favicon.svg';

export const metadata: Metadata = {
    title: 'BlockWise',
    description: 'graduate project',
    icons: [{ rel: 'icon', url: Favicon.src }],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <AuthProvider>
                    <Navigation />
                    <main className="min-h-screen">{children}</main>
                </AuthProvider>
            </body>
        </html>
    );
}
