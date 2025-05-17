'use client';
import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useParams } from 'next/navigation';
import Split from 'react-split';
import CodeEditor from '@/components/CodeEditor';
import ReactMarkdown from 'react-markdown';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';
import './style.css';
import MarkdownRenderer from '@/components/MarkdownRenderer';

interface TabData {
    tabName: string;
    tabContent: string;
}

interface CodeSection {
    currentTab: TabData;
    tabs: TabData[];
    test: TabData;
}

interface Task {
    id: number;
    title: string;
    description: string;
    text: string;
    solidity: CodeSection;
    sui: CodeSection;
}

interface CustomSession {
    user?: {
        id: string;
        email?: string | null;
        name?: string | null;
        accessToken?: string;
    };
}

interface ITab {
    tabContent: string;
    tabName: string;
}

type CompilerType = 'solidity' | 'sui';

export default function TaskPage() {
    const params = useParams();
    const taskId = Array.isArray(params.id) ? params.id[0] : params.id;
    const { data: session } = useSession() as { data: CustomSession };
    const [task, setTask] = useState<Task | null>(null);
    const [textOnly, setTextOnly] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [compilingStates, setCompilingStates] = useState<
        Record<CompilerType, boolean>
    >({
        solidity: false,
        sui: false,
    });

    const handleRun = async (
        editorContent: string,
        currentTabName: string,
        language: CompilerType
    ) => {
        setCompilingStates((prev) => ({ ...prev, [language]: true }));

        try {
            const response = await axios.post(
                `http://128.140.98.82:8084/compile/${language}`,
                {
                    id: taskId,
                    code: {
                        tabContent: editorContent,
                        tabName: currentTabName,
                    },
                }
            );

            if (response.data === 'yes') {
                toast.success('Compilation successful! 🎉');
            } else {
                toast.error('Compilation failed! 😕');
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                toast.error('Compilation failed! 😕');
                console.error('Axios error:', error.response?.data);
            }
        } finally {
            setCompilingStates((prev) => ({ ...prev, [language]: false }));
        }
    };

    useEffect(() => {
        const fetchTask = async () => {
            try {
                const response = await fetch(
                    `http://128.140.98.82:8084/api/tasks/${taskId}`,
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${session?.user?.accessToken}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error('Failed to fetch task');
                }

                const data = await response.json();
                if (data.sui.currentTab.tabName == '') {
                    setTextOnly(true);
                }

                setTask(data);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'An error occurred'
                );
            } finally {
                setLoading(false);
            }
        };

        if (session) {
            fetchTask();
        }
    }, [session, taskId]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!task) return <div>Task not found</div>;
    if (textOnly) {
        return (
            <div className="container mx-auto p-4 max-h-[calc(100vh-64px)] overflow-hidden">
                <div className="bg-[#252526] p-8 text-gray-100 rounded-lg m-4 shadow-xl h-[calc(100vh-120px)] overflow-hidden">
                    <div
                        className="prose prose-invert max-w-none h-full overflow-y-auto pr-4"
                        style={{ maxHeight: 'calc(100vh - 170px)' }}
                    >
                        <MarkdownRenderer content={task?.text || ''} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] overflow-hidden">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="dark"
            />
            <Split
                sizes={[40, 60]}
                minSize={300}
                gutterSize={8}
                className="split"
            >
                <div className="bg-[#252526] p-8 text-gray-100 rounded-lg m-4 shadow-xl">
                    <div className="prose prose-invert max-w-none">
                        <MarkdownRenderer content={task?.text || ''} />
                    </div>
                </div>

                <div className="overflow-hidden flex flex-col m-4">
                    <Split
                        direction="vertical"
                        sizes={[50, 50]}
                        minSize={100}
                        gutterSize={8}
                        className="split-vertical"
                    >
                        <div className="editor-wrapper">
                            <CodeEditor
                                tabs={task?.solidity.tabs || []}
                                currentTab={task?.solidity.currentTab!}
                                title="Solidity"
                                onRun={(content) =>
                                    handleRun(
                                        content,
                                        task?.solidity.currentTab!.tabName,
                                        'solidity'
                                    )
                                }
                                isCompiling={compilingStates.solidity}
                            />
                        </div>

                        <div className="editor-wrapper">
                            <CodeEditor
                                tabs={task?.sui.tabs || []}
                                currentTab={task?.sui.currentTab!}
                                title="Sui Move"
                                onRun={(content) =>
                                    handleRun(
                                        content,
                                        task?.sui.currentTab!.tabName,
                                        'sui'
                                    )
                                }
                                isCompiling={compilingStates.sui}
                            />
                        </div>
                    </Split>
                </div>
            </Split>
        </div>
    );
}
