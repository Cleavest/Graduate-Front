'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import ChapterCard from '../components/ChapterCard';
import { Chapter } from '../types/chapter';

export default function ChaptersPage() {
    const [chapters, setChapters] = useState<Chapter[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    if (loading) return <div className="text-center p-8">Loading...</div>;
    if (error)
        return <div className="text-center text-red-500 p-8">{error}</div>;

    return (
        <div className="container mx-auto p-8 pr-40 pl-40">
            <h1 className="text-3xl font-bold mb-8 text-center">Chapters</h1>
            {[...chapters]
                .sort((a, b) => a.id - b.id)
                .map((chapter) => (
                    <ChapterCard
                        key={chapter.id}
                        id={chapter.id}
                        title={chapter.title}
                        description={chapter.description}
                    />
                ))}
        </div>
    );
}
