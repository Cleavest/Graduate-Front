'use client';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { ToastContainer, toast } from 'react-toastify';

interface Task {
    id: number;
    title: string;
    description: string;
}

const AdminPage = () => {
    const { data: session } = useSession();
    const [activeTab, setActiveTab] = useState<'create' | 'assign' | 'create2'>(
        'create'
    );
    // Δυναμικά tabs για SUI και Solidity
    const [suiTabs, setSuiTabs] = useState([{ tabName: '', tabContent: '' }]);
    const [solidityTabs, setSolidityTabs] = useState([
        { tabName: '', tabContent: '' },
    ]);

    const [chapterId, setChapterId] = useState<String>();
    const [title, setTitle] = useState<String>();
    const [desc, setDesc] = useState<String>();

    const [chapters, setChapters] = useState<Chapter[]>([
        { id: 23, title: '213', description: '123123' },
    ]);
    const [tasks, setTasks] = useState<Task[]>([
        { id: 2, title: '23', description: '23' },
    ]);
    const [selectedTask, setSelectedTask] = useState(tasks[0]);
    const [selectedChapter, setSelectedChapter] = useState(chapters[0]);

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

                setChapters(response.data);
            } catch (err) {
                console.log('Σφάλμα κατά τη φόρτωση των κεφαλαίων');
                console.error('Error fetching chapters:', err);
            }
        };

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
                console.log(
                    err instanceof Error ? err.message : 'An error occurred'
                );
            }
        };

        if (session) {
            fetchChapters();
            fetchTasks();
        }
    }, [session]);

    const handleSuiTabChange = (
        idx: number,
        field: 'tabName' | 'tabContent',
        value: string
    ) => {
        setSuiTabs((tabs) =>
            tabs.map((tab, i) => (i === idx ? { ...tab, [field]: value } : tab))
        );
    };
    const handleSolidityTabChange = (
        idx: number,
        field: 'tabName' | 'tabContent',
        value: string
    ) => {
        setSolidityTabs((tabs) =>
            tabs.map((tab, i) => (i === idx ? { ...tab, [field]: value } : tab))
        );
    };
    const addSuiTab = () =>
        setSuiTabs((tabs) => [...tabs, { tabName: '', tabContent: '' }]);
    const removeSuiTab = (idx: number) =>
        setSuiTabs((tabs) => tabs.filter((_, i) => i !== idx));
    const addSolidityTab = () =>
        setSolidityTabs((tabs) => [...tabs, { tabName: '', tabContent: '' }]);
    const removeSolidityTab = (idx: number) =>
        setSolidityTabs((tabs) => tabs.filter((_, i) => i !== idx));

    const test = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);
        // GroupTab SUI
        const sui = {
            currentTab: {
                tabName: formData.get('sui_currentTabName') as string,
                tabContent: formData.get('sui_currentTabContent') as string,
            },
            test: {
                tabName: formData.get('sui_testTabName') as string,
                tabContent: formData.get('sui_testTabContent') as string,
            },
            tabs: suiTabs.map((tab) => ({
                tabName: tab.tabName,
                tabContent: tab.tabContent,
            })),
        };
        // GroupTab SOLIDITY
        const solidity = {
            currentTab: {
                tabName: formData.get('solidity_currentTabName') as string,
                tabContent: formData.get(
                    'solidity_currentTabContent'
                ) as string,
            },
            test: {
                tabName: formData.get('solidity_testTabName') as string,
                tabContent: formData.get('solidity_testTabContent') as string,
            },
            tabs: solidityTabs.map((tab) => ({
                tabName: tab.tabName,
                tabContent: tab.tabContent,
            })),
        };
        const payload = {
            id: formData.get('id') ? Number(formData.get('id')) : undefined,
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            text: formData.get('text') as string,
            sui,
            solidity,
        };
        try {
            console.log();
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/api/create`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                    },
                }
            );
            toast.success('Το task δημιουργήθηκε!');

            form.reset();
        } catch (err) {
            toast.error('Σφάλμα κατά τη δημιουργία task');
            console.log(err);
        }
    };
    const handleChangeTask = (option: Task) => {
        setSelectedTask(option);
    };

    const handleChangeChapter = (option: Chapter) => {
        setSelectedChapter(option);
    };

    const handleTaskAndChapter = async (typeCh: number) => {
        if (!session?.user?.accessToken) {
            toast.error('Πρέπει να είστε συνδεδεμένοι');
            return;
        }
        try {
            const payload = {
                chapterId: selectedChapter.id,
                taskId: selectedTask.id,
                type: typeCh,
            };
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chapter/change`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                    },
                }
            );

            toast.success(
                typeCh === 0
                    ? 'Το task προστέθηκε στο κεφάλαιο!'
                    : 'Το task αφαιρέθηκε από το κεφάλαιο!'
            );
            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleCreateChapter = async () => {
        if (!session?.user?.accessToken) {
            toast.error('Πρέπει να είστε συνδεδεμένοι');
            return;
        }
        try {
            const payload = {
                id: chapterId,
                title: title,
                description: desc,
            };
            const response = await axios.post(
                `${process.env.NEXT_PUBLIC_API_URL}/chapter/create`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${session?.user?.accessToken}`,
                    },
                }
            );

            toast.success('Το chapter δημιουργήθηκε!');

            console.log(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    console.log(session?.user?.role);

    if (session?.user?.role === 'USER') {
        return <p>Welcome, User!</p>;
      }

    return (
        <div className="container mx-auto p-8 pr-40 pl-40">
            <div className=" mx-auto mt-10 bg-zinc-800 rounded-xl shadow-md p-8">
                <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">
                    Admin Panel
                </h1>
                <div className="flex gap-2 mb-6">
                    <button
                        className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors ${
                            activeTab === 'create'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('create')}
                    >
                        Δημιουργία Task
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors ${
                            activeTab === 'create2'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('create2')}
                    >
                        Δημιουργία Chapters
                    </button>
                    <button
                        className={`flex-1 py-2 rounded-t-lg font-semibold transition-colors ${
                            activeTab === 'assign'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700'
                        }`}
                        onClick={() => setActiveTab('assign')}
                    >
                        Προσθήκη Task σε Chapters
                    </button>
                </div>
                <div className="pt-4">
                    {activeTab === 'create' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                Δημιουργία Task
                            </h2>
                            <form
                                className="space-y-4 divide-y divide-zinc-600"
                                onSubmit={handleSubmit}
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pb-3">
                                    <div>
                                        <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                            ID:
                                        </label>
                                        <input
                                            type="number"
                                            name="id"
                                            className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                            Τίτλος:
                                        </label>
                                        <input
                                            type="text"
                                            name="title"
                                            className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                            Περιγραφή:
                                        </label>
                                        <textarea
                                            name="description"
                                            rows={2}
                                            className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                            Κείμενο:
                                        </label>
                                        <textarea
                                            name="text"
                                            rows={2}
                                            className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                        />
                                    </div>
                                </div>
                                {/* GroupTab SUI */}
                                <div className="pt-3">
                                    <div className="bg-zinc-700 rounded-lg p-2 mb-1.5">
                                        <h3 className="text-base font-semibold text-blue-400 mb-2 border-b border-zinc-600 pb-1">
                                            SUI Tabs
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Current Tab Όνομα:
                                                </label>
                                                <input
                                                    type="text"
                                                    name="sui_currentTabName"
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Current Tab Περιεχόμενο:
                                                </label>
                                                <textarea
                                                    name="sui_currentTabContent"
                                                    rows={1}
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Test Tab Όνομα:
                                                </label>
                                                <input
                                                    type="text"
                                                    name="sui_testTabName"
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Test Tab Περιεχόμενο:
                                                </label>
                                                <textarea
                                                    name="sui_testTabContent"
                                                    rows={1}
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                        </div>
                                        {/* Δυναμικά Tabs */}
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-gray-200 text-sm">
                                                    Tabs
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={addSuiTab}
                                                    className="bg-green-600 text-white px-2 py-0.5 rounded hover:bg-green-700 transition text-xs"
                                                >
                                                    + Προσθήκη Tab
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                {suiTabs.map((tab, idx) => (
                                                    <div
                                                        key={idx}
                                                        className="flex flex-col md:flex-row gap-1 mb-1"
                                                    >
                                                        <input
                                                            type="text"
                                                            placeholder="Όνομα Tab"
                                                            value={tab.tabName}
                                                            onChange={(e) =>
                                                                handleSuiTabChange(
                                                                    idx,
                                                                    'tabName',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="flex-1 pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="Περιεχόμενο Tab"
                                                            value={
                                                                tab.tabContent
                                                            }
                                                            onChange={(e) =>
                                                                handleSuiTabChange(
                                                                    idx,
                                                                    'tabContent',
                                                                    e.target
                                                                        .value
                                                                )
                                                            }
                                                            className="flex-1 pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                removeSuiTab(
                                                                    idx
                                                                )
                                                            }
                                                            className="bg-red-600 text-white px-1.5 py-0.5 rounded hover:bg-red-700 transition text-xs self-center"
                                                        >
                                                            ✕
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* GroupTab SOLIDITY */}
                                <div className="pt-3">
                                    <div className="bg-zinc-700 rounded-lg p-2 mb-1.5">
                                        <h3 className="text-base font-semibold text-blue-400 mb-2 border-b border-zinc-600 pb-1">
                                            Solidity Tabs
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mb-2">
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Current Tab Όνομα:
                                                </label>
                                                <input
                                                    type="text"
                                                    name="solidity_currentTabName"
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Current Tab Περιεχόμενο:
                                                </label>
                                                <textarea
                                                    name="solidity_currentTabContent"
                                                    rows={1}
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Test Tab Όνομα:
                                                </label>
                                                <input
                                                    type="text"
                                                    name="solidity_testTabName"
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                            <div>
                                                <label className="block mb-0.5 text-gray-200 text-sm">
                                                    Test Tab Περιεχόμενο:
                                                </label>
                                                <textarea
                                                    name="solidity_testTabContent"
                                                    rows={1}
                                                    className="w-full pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                />
                                            </div>
                                        </div>
                                        {/* Δυναμικά Tabs */}
                                        <div className="mt-2">
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="font-semibold text-gray-200 text-sm">
                                                    Tabs
                                                </span>
                                                <button
                                                    type="button"
                                                    onClick={addSolidityTab}
                                                    className="bg-green-600 text-white px-2 py-0.5 rounded hover:bg-green-700 transition text-xs"
                                                >
                                                    + Προσθήκη Tab
                                                </button>
                                            </div>
                                            <div className="space-y-1">
                                                {solidityTabs.map(
                                                    (tab, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="flex flex-col md:flex-row gap-1 mb-1"
                                                        >
                                                            <input
                                                                type="text"
                                                                placeholder="Όνομα Tab"
                                                                value={
                                                                    tab.tabName
                                                                }
                                                                onChange={(e) =>
                                                                    handleSolidityTabChange(
                                                                        idx,
                                                                        'tabName',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="flex-1 pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                            />
                                                            <input
                                                                type="text"
                                                                placeholder="Περιεχόμενο Tab"
                                                                value={
                                                                    tab.tabContent
                                                                }
                                                                onChange={(e) =>
                                                                    handleSolidityTabChange(
                                                                        idx,
                                                                        'tabContent',
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                className="flex-1 pl-2 pr-2 py-1.5 bg-zinc-800 border border-zinc-600 text-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    removeSolidityTab(
                                                                        idx
                                                                    )
                                                                }
                                                                className="bg-red-600 text-white px-1.5 py-0.5 rounded hover:bg-red-700 transition text-xs self-center"
                                                            >
                                                                ✕
                                                            </button>
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="pt-3 flex justify-end">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-6 py-1.5 rounded-md font-bold hover:bg-blue-700 transition shadow text-sm"
                                    >
                                        Δημιουργία
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'assign' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                Προσθήκη Task σε Chapters
                            </h2>
                            <form className="space-y-4" onSubmit={test}>
                                <div>
                                    <label className="block mb-2 font-medium text-gray-900 dark:text-white">
                                        Επιλογή Task:
                                    </label>
                                    <select
                                        id="task"
                                        value={selectedTask.id}
                                        onChange={(e) =>
                                            handleChangeTask(
                                                tasks.find(
                                                    (task) =>
                                                        task.id ===
                                                        Number(e.target.value)
                                                )!
                                            )
                                        }
                                        className="w-full pl-10 pr-3 py-2 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                    >
                                        {tasks.map((task) => (
                                            <option
                                                key={task.id}
                                                value={task.id}
                                            >
                                                {task.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block mb-1 font-medium">
                                        Επιλογή Chapter:
                                    </label>

                                    <select
                                        id="chapter"
                                        value={selectedChapter.id}
                                        onChange={(e) =>
                                            handleChangeChapter(
                                                chapters.find(
                                                    (chapter) =>
                                                        chapter.id ===
                                                        Number(e.target.value)
                                                )!
                                            )
                                        }
                                        className="w-full pl-10 pr-3 py-2 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                    >
                                        {chapters.map((chapter) => (
                                            <option
                                                key={chapter.id}
                                                value={chapter.id}
                                            >
                                                {chapter.title}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition"
                                        onClick={() => handleTaskAndChapter(0)}
                                    >
                                        Προσθήκη
                                    </button>
                                    <button
                                        className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold hover:bg-blue-700 transition"
                                        onClick={() => handleTaskAndChapter(1)}
                                    >
                                        Αφαιρέσει
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                    {activeTab === 'create2' && (
                        <div>
                            <h2 className="text-xl font-semibold mb-4 text-blue-600">
                                Δημιουργία Chapters
                            </h2>
                            <form className="space-y-4" onSubmit={test}>
                                <div>
                                    <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                        ID:
                                    </label>
                                    <input
                                        type="number"
                                        name="id"
                                        onChange={(e) =>
                                            setChapterId(e.target.value)
                                        }
                                        className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div>
                                    <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                        Τίτλος:
                                    </label>
                                    <input
                                        type="text"
                                        name="title"
                                        onChange={(e) =>
                                            setTitle(e.target.value)
                                        }
                                        className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block mb-0.5 font-semibold text-gray-200 text-sm">
                                        Περιγραφή:
                                    </label>
                                    <textarea
                                        name="description"
                                        rows={2}
                                        onChange={(e) =>
                                            setDesc(e.target.value)
                                        }
                                        className="w-full pl-2 pr-2 py-1.5 bg-zinc-700 border border-zinc-600 text-gray-100 placeholder-gray-400 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-zinc-500 focus:border-transparent transition-all duration-200"
                                    />
                                </div>
                                <div className="pt-3 flex justify-end">
                                    <button
                                        className="bg-blue-600 text-white px-6 py-1.5 rounded-md font-bold hover:bg-blue-700 transition shadow text-sm"
                                        onClick={() => handleCreateChapter()}
                                    >
                                        Δημιουργία
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;
