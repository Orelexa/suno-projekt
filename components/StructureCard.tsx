
import React from 'react';
import type { PromptSettings } from '../types';
import Card from './Card';
import FormLabel from './FormLabel';

interface StructureCardProps {
    settings: PromptSettings;
    updateSetting: <K extends keyof PromptSettings>(key: K, value: PromptSettings[K]) => void;
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

const structurePresets = [
    "Intro, Verse, Chorus, Verse, Chorus, Bridge, Chorus, Outro",
    "Intro, A, A, B, A, Outro",
    "Intro, Build, Drop, Break, Drop, Outro",
    "Overture, Theme, Development, Recap, Coda",
];

const endingOptions = [
    "clear, resolved ending (no fade-out)",
    "cold stop (sudden end)",
    "long reverb tail",
    "gradual fade-out",
];

const StructureCard: React.FC<StructureCardProps> = ({ settings, updateSetting }) => {
    
    const handleStructurePresetChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        updateSetting('structurePreset', value);
        if (value) {
            updateSetting('structure', value);
        }
    };

    return (
        <Card title="Szerkezet & Mix (Structure & Mix)">
            <FormLabel htmlFor="structurePreset">Szerkezet (preset) / Structure (preset)</FormLabel>
            <Select id="structurePreset" value={settings.structurePreset} onChange={handleStructurePresetChange}>
                <option value="">Custom / None</option>
                {structurePresets.map(p => <option key={p} value={p}>{p}</option>)}
            </Select>

            <FormLabel htmlFor="structure">Saját szerkezet / Custom Structure</FormLabel>
            <Textarea id="structure" placeholder="Describe structure here..." value={settings.structure} onChange={e => updateSetting('structure', e.target.value)} />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3">
                 <div>
                    <FormLabel htmlFor="tempo">Tempo (BPM)</FormLabel>
                    <Input id="tempo" type="number" min="40" max="220" value={settings.tempo} onChange={e => updateSetting('tempo', e.target.value)} />
                 </div>
                 <div>
                    <FormLabel htmlFor="key">Hangnem / Key</FormLabel>
                    <Select id="key" value={settings.key} onChange={e => updateSetting('key', e.target.value)}>
                        <option value="">No specific key</option>
                        <option>C major</option><option>G major</option><option>D major</option><option>A major</option><option>E major</option><option>B major</option><option>F# major</option><option>F major</option>
                        <option>A minor</option><option>E minor</option><option>B minor</option><option>F# minor</option><option>C# minor</option><option>G# minor</option><option>D minor</option>
                    </Select>
                 </div>
            </div>

            <FormLabel htmlFor="ending">Zárás / Ending</FormLabel>
            <Select id="ending" value={settings.ending} onChange={e => updateSetting('ending', e.target.value)}>
                {endingOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </Select>
            
            <FormLabel htmlFor="mix">Mix / Produkció / Mix / Production</FormLabel>
            <Input id="mix" type="text" placeholder="Tight low end, wide strings..." value={settings.mix} onChange={e => updateSetting('mix', e.target.value)} />
        </Card>
    );
};

export default StructureCard;