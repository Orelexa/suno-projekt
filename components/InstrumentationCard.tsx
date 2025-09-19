
import React from 'react';
import type { PromptSettings, InstrumentGroup } from '../types.ts';
import Card from './Card.tsx';
import FormLabel from './FormLabel.tsx';
import Chip from './Chip.tsx';
import GeminiButton from './GeminiButton.tsx';

interface InstrumentationCardProps {
    settings: PromptSettings;
    instrumentGroups: InstrumentGroup[];
    toggleInstrument: (value: string) => void;
    updateSetting: <K extends keyof PromptSettings>(key: K, value: PromptSettings[K]) => void;
    isLoading: Record<string, boolean>;
    onSuggestInstruments: () => void;
}

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} className={`w-full bg-bg-dark/50 color-text-main border border-line rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition ${props.className}`} />
);

const InstrumentationCard: React.FC<InstrumentationCardProps> = ({ settings, instrumentGroups, toggleInstrument, updateSetting, isLoading, onSuggestInstruments }) => {
    return (
        <Card title="Hangszerelés (Instrumentation)">
            <div className="space-y-3">
                {instrumentGroups.map(group => (
                    <details key={group.name} className="bg-slate-800/50 rounded-lg border border-line" open>
                        <summary className="font-semibold text-indigo-dark cursor-pointer p-2 list-none">{group.name}</summary>
                        <div className="p-2 border-t border-line flex flex-wrap gap-2">
                             {group.items.map(instrument => (
                                <Chip key={instrument} label={instrument} isActive={settings.instruments.includes(instrument)} onClick={() => toggleInstrument(instrument)} />
                            ))}
                        </div>
                    </details>
                ))}
            </div>
            
            <div className="mt-4">
                <GeminiButton onClick={onSuggestInstruments} isLoading={isLoading.instruments} className="w-full">
                    Hangszerek javaslása / Suggest Instruments
                </GeminiButton>
            </div>
            
            <FormLabel htmlFor="instExtra">Extra hangszerelés / Extra Instrumentation</FormLabel>
            <Input id="instExtra" type="text" placeholder="e.g., muted trumpets, pizzicato cellos" value={settings.instExtra} onChange={e => updateSetting('instExtra', e.target.value)} />
        </Card>
    );
};

export default InstrumentationCard;