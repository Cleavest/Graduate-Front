'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { usePathname } from 'next/navigation';
import logo from '@/app/enhanced-logo.svg';
import Favicon from './favicon.svg';
import Image from 'next/image';

export default function Navigation() {
    const { data: session, status } = useSession();
    const pathname = usePathname();

    return (
        <nav className="bg-nav-bg shadow-lg">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Image
                            src={logo}
                            width={40}
                            height={40}
                            alt="BlockWise"
                            className="mr-2"
                        />
                        <Link
                            href="/"
                            className="text-xl font-bold text-nav-secondary"
                        >
                            BlockWise
                        </Link>
                    </div>

                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className={`px-3 py-2 rounded-md ${
                                pathname === '/'
                                    ? 'text-nav-secondary'
                                    : 'text-nav-text hover:text-nav-primary'
                            }`}
                        >
                            Home
                        </Link>

                        {status === 'authenticated' ? (
                            <>
                                <Link
                                    href="/dashboard"
                                    className={`px-3 py-2 rounded-md ${
                                        pathname === '/dashboard'
                                            ? 'text-nav-secondary'
                                            : 'text-nav-text hover:text-nav-primary'
                                    }`}
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/task"
                                    className={`px-3 py-2 rounded-md ${
                                        pathname === '/task'
                                            ? 'text-nav-secondary'
                                            : 'text-nav-text hover:text-nav-primary'
                                    }`}
                                >
                                    Tasks
                                </Link>
                                <Link
                                    href="/chapters"
                                    className={`px-3 py-2 rounded-md ${
                                        pathname === '/chapters'
                                            ? 'text-nav-secondary'
                                            : 'text-nav-text hover:text-nav-primary'
                                    }`}
                                >
                                    Chapters
                                </Link>
                                <div className="flex items-center space-x-4">
                                    <span className="text-nav-text">
                                        {session.user?.email}
                                    </span>
                                    <button
                                        onClick={() =>
                                            signOut({ callbackUrl: '/' })
                                        }
                                        className="px-4 py-2 text-sm font-medium text-white bg-nav-primary rounded-md hover:bg-nav-secondary"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex items-center space-x-4">
                                <Link
                                    href="/login"
                                    className={`px-4 py-2 text-sm font-medium ${
                                        pathname === '/login'
                                            ? 'text-white bg-nav-primary'
                                            : 'text-nav-secondary hover:bg-nav-text'
                                    } rounded-md`}
                                >
                                    Login
                                </Link>
                                <Link
                                    href="/register"
                                    className={`px-4 py-2 text-sm font-medium ${
                                        pathname === '/register'
                                            ? 'text-white bg-nav-primary'
                                            : 'text-nav-secondary hover:bg-nav-text'
                                    } rounded-md`}
                                >
                                    Register
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
