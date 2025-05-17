'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Task {
    id: number;
    title: string;
    description: string;
}

interface CustomSession {
    user?: {
        id: string;
        email?: string | null;
        name?: string | null;
        accessToken?: string;
    };
}

export default function TasksPage() {
    const { data: session } = useSession() as { data: CustomSession };
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const response = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session?.user?.accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    console.log(response);
                    throw new Error('Failed to fetch tasks');
                }

                const data = await response.json();
                setTasks(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            console.log(session);
            fetchTasks();
        }
    }, [session]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Tasks</h1>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task) => (
                    <div
                        key={task.id}
                        className="p-4 border rounded-lg shadow hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-semibold">{task.title}</h2>
                        <p className="text-gray-600 mt-2">{task.description}</p>
                        <button
                            onClick={() => router.push(`/task/${task.id}`)}
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
