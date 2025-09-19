
import React from 'react';
import { Save, FolderDown, Upload, Download, RotateCcw } from 'lucide-react';

interface HeaderProps {
    onSave: () => void;
    onLoad: () => void;
    onExport: () => void;
    onImport: () => void;
    onReset: () => void;
}

const ActionButton: React.FC<{ onClick: () => void; title: string; children: React.ReactNode }> = ({ onClick, title, children }) => (
    <button
        onClick={onClick}
        title={title}
        className="flex items-center gap-2 bg-panel hover:bg-slate-700 border border-line text-slate-300 px-3 py-2 rounded-lg text-sm transition-colors"
    >
        {children}
    </button>
);

const Header: React.FC<HeaderProps> = ({ onSave, onLoad, onExport, onImport, onReset }) => {
    return (
        <header className="flex flex-col sm:flex-row gap-4 items-center justify-between mb-5">
            <h1 className="text-xl font-bold text-text-main">
                🎛️ Suno Prompt Generator
                <span className="text-muted text-sm ml-2 font-normal">(HU UI → EN prompt, Gemini API)</span>
            </h1>
            <div className="flex gap-2 flex-wrap justify-center">
                <ActionButton onClick={onSave} title="Save settings to browser"><Save size={16} /> Save</ActionButton>
                <ActionButton onClick={onLoad} title="Load settings from browser"><FolderDown size={16} /> Load</ActionButton>
                <ActionButton onClick={onExport} title="Export settings to a file"><Download size={16} /> Export</ActionButton>
                <ActionButton onClick={onImport} title="Import settings from a file"><Upload size={16} /> Import</ActionButton>
                <ActionButton onClick={onReset} title="Reset all fields"><RotateCcw size={16} /> Reset</ActionButton>
            </div>
        </header>
    );
};

export default Header;
