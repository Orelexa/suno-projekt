
import React from 'react';
import type { PromptSettings, VocalStyle, VocalType } from '../types.ts';
import Card from './Card.tsx';
import FormLabel from './FormLabel.tsx';
import Chip from './Chip.tsx';
import GeminiButton from './GeminiButton.tsx';

interface BasicInfoCardProps {
    settings: PromptSettings;
    updateSetting: <K extends keyof PromptSettings>(key: K, value: PromptSettings[K]) => void;
    isLoading: Record<string, boolean>;
    onGenerateTitle: () => void;
    onSuggestMoodTheme: () => void;
    onTranslateTheme: () => void;
    onRegenerateLyrics: () => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`w-full bg-bg-dark/50 color-text-main border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${props.className}`} />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={`w-full bg-bg-dark/50 color-text-main border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${props.className}`} />
);
const Textarea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea {...props} className={`w-full bg-bg-dark/50 color-text-main border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition resize-y min-h-[80px] ${props.className}`} />
);

const BasicInfoCard: React.FC<BasicInfoCardProps> = ({ settings, updateSetting, isLoading, onGenerateTitle, onSuggestMoodTheme, onTranslateTheme, onRegenerateLyrics }) => {
    
    const toggleVocalType = (v: VocalType) => {
        const current = settings.vocalTypes;
        if(current.includes(v)) {
            updateSetting('vocalTypes', current.filter(vt => vt !== v));
        } else {
            updateSetting('vocalTypes', [...current, v]);
        }
    };
    
    return (
        <Card title="Alapok (Basics)">
            <FormLabel htmlFor="title">Munkacím (nem kötelező) / Working Title (optional)</FormLabel>
            <div className="flex gap-2">
                <Input id="title" type="text" placeholder="e.g., Midnight Swing" value={settings.title} onChange={e => updateSetting('title', e.target.value)} />
                <GeminiButton onClick={onGenerateTitle} isLoading={isLoading.title} title="Generate title based on theme" className="px-3">✨</GeminiButton>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                 <div>
                    <FormLabel>Vokál / Vocal</FormLabel>
                    <div className="flex gap-2 flex-wrap">
                        <Chip label="Include Vocal" isActive={settings.vocalStyle === 'vocal'} onClick={() => updateSetting('vocalStyle', 'vocal')} />
                        <Chip label="Instrumental" isActive={settings.vocalStyle === 'instrumental'} onClick={() => updateSetting('vocalStyle', 'instrumental')} />
                        <Chip label="Choir Only" isActive={settings.vocalStyle === 'choir'} onClick={() => updateSetting('vocalStyle', 'choir')} />
                    </div>
                </div>
                <div>
                     <FormLabel>Vokál Típus / Vocal Type</FormLabel>
                    <div className="flex gap-2 flex-wrap">
                        {(['male', 'female', 'child'] as VocalType[]).map(v => <Chip key={v} label={v.charAt(0).toUpperCase() + v.slice(1)} isActive={settings.vocalTypes.includes(v)} onClick={() => toggleVocalType(v)} />)}
                    </div>
                </div>
            </div>

            {settings.vocalStyle === 'vocal' && (
                 <div className="bg-slate-800/50 border border-line p-3 rounded-lg mt-4">
                    <FormLabel>Dalszöveg (beilleszthető) / Lyrics (paste here)</FormLabel>
                    <Textarea placeholder="[verse]...&#10;[chorus]..." value={settings.lyrics} onChange={e => updateSetting('lyrics', e.target.value)} />
                    <div className="flex gap-2 mt-2 items-center">
                         <GeminiButton onClick={onRegenerateLyrics} isLoading={isLoading.lyrics} className="flex-grow">
                            Dalszöveg generálása / Generate Lyrics
                        </GeminiButton>
                        <Select value={settings.lyricsLang} onChange={e => updateSetting('lyricsLang', e.target.value)} className="w-auto">
                            <option value="en">English</option>
                            <option value="hu">Magyar</option>
                            <option value="it">Italiano</option>
                        </Select>
                    </div>
                </div>
            )}
            
            <FormLabel htmlFor="theme">Téma / rövid leírás (HU vagy EN) / Theme / short description</FormLabel>
            <Textarea id="theme" placeholder="e.g., A lively vintage feel with modern punch." value={settings.theme} onChange={e => updateSetting('theme', e.target.value)} />
            <div className="flex gap-2 flex-wrap mt-2">
                <GeminiButton onClick={onTranslateTheme} isLoading={isLoading.translate}>HU → EN fordítás / Translate</GeminiButton>
                <GeminiButton onClick={onSuggestMoodTheme} isLoading={isLoading.moodTheme}>Hangulat & Téma javaslat / Suggest Mood & Theme</GeminiButton>
            </div>
        </Card>
    );
};

export default BasicInfoCard;