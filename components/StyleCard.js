
import React from 'react';
import type { PromptSettings, QuickPreset } from '../types.js';
import { STYLE_PRESETS } from '../constants.js';
import Card from './Card.js';
import FormLabel from './FormLabel.js';
import Chip from './Chip.js';

interface StyleCardProps {
    settings: PromptSettings;
    updateSetting: <K extends keyof PromptSettings>(key: K, value: PromptSettings[K]) => void;
    toggleStyle: (value: string) => void;
    quickPresets: QuickPreset[];
    onPresetChange: (name: string) => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`w-full bg-bg-dark/50 color-text-main border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${props.className}`} />
);
const Select = (props: React.SelectHTMLAttributes<HTMLSelectElement>) => (
    <select {...props} className={`w-full bg-bg-dark/50 color-text-main border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${props.className}`} />
);

const StyleCard: React.FC<StyleCardProps> = ({ settings, updateSetting, toggleStyle, quickPresets, onPresetChange }) => {
    return (
        <Card title="Formátum & Stílus (Format & Style)">
            <FormLabel htmlFor="quickPresetsDropdown">Gyors sablonok / Quick Presets</FormLabel>
            <Select id="quickPresetsDropdown" value="" onChange={e => onPresetChange(e.target.value)}>
                <option value="">Choose a preset...</option>
                {quickPresets.map(p => <option key={p.name} value={p.name}>{p.name}</option>)}
            </Select>

            <FormLabel htmlFor="mood">Hangulat (vesszővel elválasztva) / Mood (comma-separated)</FormLabel>
            <Input id="mood" type="text" placeholder="romantic, cinematic, dramatic" value={settings.mood} onChange={e => updateSetting('mood', e.target.value)} />

            <FormLabel>Zenei stílus (több is lehet) / Musical Style (multi-select)</FormLabel>
            <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto p-1 bg-black/20 rounded-lg">
                {STYLE_PRESETS.map(style => (
                    <Chip key={style} label={style} isActive={settings.styles.includes(style)} onClick={() => toggleStyle(style)} />
                ))}
            </div>

            <FormLabel htmlFor="styleExtra">Extra stílus-megjegyzés / Extra Style Notes</FormLabel>
            <Input id="styleExtra" type="text" placeholder="e.g., 1930s radio texture" value={settings.styleExtra} onChange={e => updateSetting('styleExtra', e.target.value)} />
            
            <FormLabel htmlFor="negative">Negatív / kerülendő elemek / Negative Keywords</FormLabel>
            <Input id="negative" type="text" placeholder="no distortion, avoid EDM" value={settings.negative} onChange={e => updateSetting('negative', e.target.value)} />
        </Card>
    );
};

export default StyleCard;