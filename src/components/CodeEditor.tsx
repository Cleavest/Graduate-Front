'use client';
import { useState, useEffect } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';

interface ITab {
    tabContent: string;
    tabName: string;
}

interface CodeEditorProps {
    tabs: ITab[];
    currentTab: ITab;
    title?: string;
    onRun: (content: string) => void;
    isCompiling?: boolean;
}

export default function CodeEditor({
    tabs,
    currentTab,
    title,
    onRun,
    isCompiling = false,
}: CodeEditorProps) {
    const [selectedTab, setSelectedTab] = useState(0);
    const [editorContent, setEditorContent] = useState(currentTab.tabContent);

    useEffect(() => {
        const currentTabIndex = tabs.findIndex(
            (tab) => tab.tabName === currentTab.tabName
        );
        if (currentTabIndex !== -1) {
            setSelectedTab(currentTabIndex);
            setEditorContent(currentTab.tabContent);
        }
    }, [currentTab, tabs]);

    const handleChange = (value: string) => {
        if (selectedTab === 0) {
            setEditorContent(value);
        }
    };

    const allTabs = [currentTab, ...tabs];

    return (
        <div className="h-full flex flex-col bg-[#1e1e1e]">
            <div className="flex items-center justify-between bg-[#252526] border-b border-gray-700">
                <div className="flex items-center flex-1">
                    {allTabs.map((tab, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setSelectedTab(index);
                                setEditorContent(allTabs[index].tabContent);
                            }}
                            className={`px-4 py-2 text-sm font-medium transition-colors duration-150 
                                ${
                                    selectedTab === index
                                        ? 'text-white bg-[#1e1e1e] border-t-2 border-[#007acc]'
                                        : 'text-gray-400 hover:text-gray-300 hover:bg-[#2d2d2d]'
                                }`}
                        >
                            {tab.tabName}
                        </button>
                    ))}
                </div>

                <div className="flex items-center px-4">
                    <span className="text-sm text-gray-400 mr-4">{title}</span>
                    <button
                        onClick={() => onRun(editorContent)}
                        disabled={isCompiling}
                        className="run-button"
                    >
                        {isCompiling ? (
                            <div className="loading-spinner">
                                <svg
                                    className="animate-spin h-4 w-4"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                    ></path>
                                </svg>
                                <span>Compiling...</span>
                            </div>
                        ) : (
                            'Run'
                        )}
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-hidden">
                <CodeMirror
                    value={allTabs[selectedTab].tabContent}
                    height="100%"
                    theme={vscodeDark}
                    onChange={handleChange}
                    extensions={[javascript()]}
                    readOnly={selectedTab !== 0}
                />
            </div>
        </div>
    );
}
