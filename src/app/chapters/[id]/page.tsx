'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';

interface Task {
    id: number;
    title: string;
    description: string;
}

interface Chapter {
    id: number;
    title: string;
    description: string;
    tasks: Task[];
}

export default function ChapterDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const chapterId = params.id;
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [tasks, setTasks] = useState<Task[]>([]);

    useEffect(() => {
        const fetchChapterDetails = async () => {
            try {
                const response = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_URL}/chapter/${chapterId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${session?.user?.accessToken}`,
                        },
                    }
                );
                setTasks(response.data);
            } catch (err) {
                setError(
                    'Σφάλμα κατά τη φόρτωση των λεπτομερειών του κεφαλαίου'
                );
                console.error('Error fetching chapter details:', err);
            } finally {
                setLoading(false);
            }
        };

        if (session && chapterId) {
            fetchChapterDetails();
        }
    }, [session, chapterId]);

    const handleTaskClick = (taskId: number) => {
        router.push(`/task/${taskId}`);
    };

    if (loading) return <div className="text-center p-8">Φόρτωση...</div>;
    if (error)
        return <div className="text-center text-red-500 p-8">{error}</div>;

    return (
        <div className="container mx-auto p-8 pr-40 pl-40">
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-gray-100 mb-4">
                    Chapter {chapterId}
                </h2>
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="bg-[#252526] p-6 rounded-lg shadow-2xl cursor-pointer hover:bg-[#2d2d2d] transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-blue-500/20"
                        onClick={() => handleTaskClick(task.id)}
                    >
                        <h3 className="text-xl font-medium text-gray-100 mb-4 transition-colors duration-300">
                            {task.title}
                        </h3>
                        <p className="text-gray-300 transition-colors duration-300">
                            {task.description}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
