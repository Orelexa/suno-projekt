import React from 'react';
import { Copy } from 'lucide-react';
import Card from './Card.tsx';

interface LyricsOutputCardProps {
    lyrics: string;
    onCopy: () => void;
}

const LyricsOutputCard: React.FC<LyricsOutputCardProps> = ({ lyrics, onCopy }) => {
    return (
        <Card title="Dalszöveg Kimenet (Lyrics Output)">
             <div className="flex items-center mb-3">
                 <button
                    onClick={onCopy}
                    className="flex items-center gap-2 text-sm bg-panel hover:bg-slate-700 border border-line text-slate-300 px-3 py-2 rounded-lg transition-colors"
                >
                    <Copy size={16} />
                    Szöveg másolása / Copy Lyrics
                </button>
             </div>
             <textarea
                readOnly
                value={lyrics}
                className="w-full bg-bg-dark/50 border border-line rounded-lg p-4 text-sm whitespace-pre-wrap min-h-[140px] font-sans text-slate-300 resize-y"
             />
             <p className="text-xs text-muted mt-2">Lyrics are formatted for Suno AI. Paste this into the lyrics section.</p>
        </Card>
    );
};

export default LyricsOutputCard;