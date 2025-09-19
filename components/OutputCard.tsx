
import React from 'react';
import { Copy, PlusCircle, MinusCircle } from 'lucide-react';
import GeminiButton from './GeminiButton';
import Card from './Card';

interface OutputCardProps {
    generatedPrompt: string;
    isLoading: Record<string, boolean>;
    onCopy: () => void;
    onShorten: () => void;
    onExpand: () => void;
}

const LengthIndicator: React.FC<{ length: number }> = ({ length }) => {
    let dotClass = 'bg-good';
    let hintText = 'Ideal';
    if (length > 1800) {
        dotClass = 'bg-bad';
        hintText = 'Too long';
    } else if (length > 1000) {
        dotClass = 'bg-warn';
        hintText = 'A bit long';
    }

    return (
        <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${dotClass}`}></span>
            <span className="text-xs text-muted">{hintText}</span>
        </div>
    );
};

const OutputCard: React.FC<OutputCardProps> = ({ generatedPrompt, isLoading, onCopy, onShorten, onExpand }) => {
    return (
        <Card title="Prompt Kimenet (Prompt Output)">
            <div className="flex flex-col sm:flex-row gap-2 items-center mb-3">
                <button
                    onClick={onCopy}
                    className="w-full sm:w-auto flex-shrink-0 flex items-center justify-center gap-2 text-sm bg-btn-grad-from hover:bg-btn-grad-to text-white px-4 py-2 rounded-lg font-semibold transition-all"
                >
                    <Copy size={16} />
                    Másolás / Copy
                </button>
                <div className="flex-grow flex gap-2 w-full sm:w-auto">
                    <GeminiButton onClick={onShorten} isLoading={isLoading.shorten} className="w-full">
                       Rövidítés / Shorten
                    </GeminiButton>
                    <GeminiButton onClick={onExpand} isLoading={isLoading.expand} className="w-full">
                       Bővítés / Expand
                    </GeminiButton>
                </div>
                <div className="ml-auto flex items-center gap-4 flex-shrink-0">
                    <span className="text-sm font-mono bg-slate-800 px-3 py-1 rounded-md text-slate-400">{generatedPrompt.length} ch</span>
                    <LengthIndicator length={generatedPrompt.length} />
                </div>
            </div>
            <pre className="w-full bg-bg-dark/50 border border-line rounded-lg p-4 text-sm whitespace-pre-wrap min-h-[140px] font-sans text-slate-300">
                {generatedPrompt || 'Your generated prompt will appear here...'}
            </pre>
            <p className="text-xs text-muted mt-2">The Prompt field contains the musical description. The lyrics are handled separately by Suno.</p>
        </Card>
    );
};

export default OutputCard;