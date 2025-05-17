'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Chapter {
    id: number;
    title: string;
    description: string;
}

export default function ChaptersPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
        const fetchChapters = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/chapter/test`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.user?.accessToken}`,
                        },
                    }
                );
                console.log(response.data);
                setChapters(response.data);
            } catch (err) {
                setError('Σφάλμα κατά τη φόρτωση των κεφαλαίων');
                console.error('Error fetching chapters:', err);
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchChapters();
        }
    }, [session]);

    const handleViewDetails = (chapterId: number) => {
        router.push(`/chapters/${chapterId}`);
    };

    let prog = 2 / 4;

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error)
        return <div className="text-center text-red-500 p-8">{error}</div>;

    return (
        <div className="container mx-auto p-8 pr-40 pl-40">
            <h1 className="text-3xl font-bold mb-8 text-center">Chapters</h1>
            {chapters.map((chapter) => (
                <div
                    key={chapter.id}
                    className="bg-[#252526] p-6 rounded-lg shadow-2xl m-6 hover:bg-[#2d2d2d] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-blue-500/20"
                >
                    <h2 className="text-xl font-semibold text-gray-100 mb-4 transition-colors duration-300">
                        {chapter.title}
                    </h2>
                    <div className="mb-4">
                        <div className="text-right text-gray-400 mb-2">
                            100% completed
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                            <div className="bg-blue-600 h-3 rounded-full transition-all duration-1000 ease-out animate-pulse"></div>
                        </div>
                    </div>

                    <p className="text-gray-300 p-3 mb-4 transition-colors duration-300">
                        {chapter.description}
                    </p>
                    <button
                        onClick={() => handleViewDetails(chapter.id)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-lg hover:shadow-blue-500/30"
                    >
                        Προβολή Λεπτομερειών
                    </button>
                </div>
            ))}
        </div>
    );
}
