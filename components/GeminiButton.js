
import React from 'react';
import { Sparkles, LoaderCircle } from 'lucide-react';

interface GeminiButtonProps {
    onClick: () => void;
    isLoading: boolean;
    children: React.ReactNode;
    title?: string;
    className?: string;
}

const GeminiButton: React.FC<GeminiButtonProps> = ({ onClick, isLoading, children, title, className }) => {
    return (
        <button
            onClick={onClick}
            disabled={isLoading}
            title={title}
            className={`flex items-center justify-center gap-2 text-sm bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-wait ${className}`}
        >
            {isLoading ? (
                <>
                    <LoaderCircle size={16} className="animate-spin" />
                    <span>Processing...</span>
                </>
            ) : (
                <>
                    <Sparkles size={16} />
                    {children}
                </>
            )}
        </button>
    );
};

export default GeminiButton;