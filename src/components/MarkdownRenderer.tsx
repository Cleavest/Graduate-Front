import React from 'react';
import ReactMarkdown from 'react-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { javascript } from '@codemirror/lang-javascript';

const MarkdownComponents = {
    code({ node, inline, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        const language = match ? match[1] : '';

        if (!inline && language) {
            return (
                <div className="my-4">
                    <CodeMirror
                        value={String(children).replace(/\n$/, '')}
                        height="auto"
                        theme={vscodeDark}
                        extensions={[javascript()]}
                        readOnly={true}
                        className="rounded-md overflow-hidden"
                    />
                </div>
            );
        }
        return (
            <code
                className={`bg-[#1e1e1e] px-1 rounded ${className}`}
                {...props}
            >
                {children}
            </code>
        );
    },
    p({ children }: any) {
        return <p className="mb-4 leading-relaxed text-gray-300">{children}</p>;
    },
    h1({ children }: any) {
        return (
            <h1 className="text-2xl font-bold mb-6 text-[#007acc]">
                {children}
            </h1>
        );
    },
    h2({ children }: any) {
        return (
            <h2 className="text-xl font-bold mb-4 text-[#007acc]">
                {children}
            </h2>
        );
    },
    h3({ children }: any) {
        return (
            <h3 className="text-lg font-bold mb-3 text-[#007acc]">
                {children}
            </h3>
        );
    },
    ul({ children }: any) {
        return (
            <ul className="list-disc list-inside mb-4 space-y-2">{children}</ul>
        );
    },
    ol({ children }: any) {
        return (
            <ol className="list-decimal list-inside mb-4 space-y-2">
                {children}
            </ol>
        );
    },
    li({ children }: any) {
        return <li className="text-gray-300">{children}</li>;
    },
    blockquote({ children }: any) {
        return (
            <blockquote className="border-l-4 border-[#007acc] pl-4 my-4 text-gray-400">
                {children}
            </blockquote>
        );
    },
};

interface MarkdownRendererProps {
    content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
    return (
        <div className="prose prose-invert max-w-none">
            <ReactMarkdown components={MarkdownComponents}>
                {content}
            </ReactMarkdown>
        </div>
    );
};

export default MarkdownRenderer;
