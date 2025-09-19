import React, { useState, useEffect, useCallback } from 'react';
import type { PromptSettings, VocalType, VocalStyle } from './types.ts';
import { initialSettings, INSTRUMENT_GROUPS, ALL_AVAILABLE_INSTRUMENTS, STYLE_PRESETS, QUICK_PRESETS } from './constants.ts';
import * as geminiService from './services/geminiService.ts';

import Header from './components/Header.tsx';
import BasicInfoCard from './components/BasicInfoCard.tsx';
import StyleCard from './components/StyleCard.tsx';
import InstrumentationCard from './components/InstrumentationCard.tsx';
import StructureCard from './components/StructureCard.tsx';
import OutputCard from './components/OutputCard.tsx';
import LyricsOutputCard from './components/LyricsOutputCard.tsx';
import Toast from './components/Toast.tsx';

const App: React.FC = () => {
    const [settings, setSettings] = useState<PromptSettings>(initialSettings);
    const [generatedPrompt, setGeneratedPrompt] = useState('');
    const [generatedLyrics, setGeneratedLyrics] = useState('');
    const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
    const [toastMessage, setToastMessage] = useState<string | null>(null);

    const showToast = (message: string) => {
        setToastMessage(message);
        setTimeout(() => setToastMessage(null), 3000);
    };

    const handleLoading = (key: string, value: boolean) => {
        setIsLoading(prev => ({ ...prev, [key]: value }));
    };

    const updateSetting = <K extends keyof PromptSettings>(key: K, value: PromptSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };
    
    const toggleArraySetting = (key: keyof PromptSettings, value: string) => {
        setSettings(prev => {
            const currentValues = (prev[key] as string[]) || [];
            if (currentValues.includes(value)) {
                return { ...prev, [key]: currentValues.filter(item => item !== value) };
            } else {
                return { ...prev, [key]: [...currentValues, value] };
            }
        });
    };
    
    const buildPromptText = useCallback((): string => {
        let prompt = '';
        const {
            title, tempoMode, tempo, tempoOriginalTag, key, vocalStyle, vocalTypes,
            mood, styles, styleExtra, instruments, instExtra, negative,
            structure, ending, mix, theme, promptMode
        } = settings;

        if (vocalStyle === 'instrumental') {
            prompt += 'Instrumental\n';
        } else {
             if (vocalTypes.length > 0) {
                 const types = vocalTypes.map(vt => `${vt} vocal`).join(', ');
                 prompt += `${types}\n`;
             }
        }

        let styleString = [...styles, ...mood.split(',').map(s=>s.trim()).filter(Boolean), styleExtra].filter(Boolean).join(', ');
        if (styleString) prompt += `Style: ${styleString}\n`;

        let instString = [...instruments, instExtra].filter(Boolean).join(', ');
        if (instString) prompt += `Instruments: ${instString}\n`;

        if (tempoMode === 'bpm' && tempo) {
            prompt += `Tempo: ${tempo} BPM\n`;
        } else if (tempoOriginalTag) {
            prompt += `Tempo: original BPM\n`;
        }

        if (key) prompt += `Key: ${key}\n`;
        if (structure) prompt += `Structure: ${structure}\n`;
        if (ending) prompt += `Ending: ${ending}\n`;
        if (mix) prompt += `Mix: ${mix}\n`;
        if (negative) prompt += `Negative Keywords: ${negative}\n`;
        if (title) prompt += `Title: ${title}\n`;
        if (theme && promptMode === 'verbose') {
            prompt += `Theme: ${theme}\n`;
        }

        return prompt.trim();
    }, [settings]);


    const buildLyricsOutput = (lyrics: string): string => {
        const stanzas = lyrics.split(/\n\s*\n/);
        const tags = ['[Verse]', '[Chorus]', '[Verse]', '[Chorus]', '[Bridge]', '[Chorus]', '[Outro]'];
        const taggedStanzas = stanzas.map((stanza, index) => {
            const hasTag = /\[(verse|chorus|bridge|intro|outro|pre-chorus|hook)\]/i.test(stanza.trim().split('\n')[0]);
            if (hasTag) return stanza.trim();
            
            const tag = tags[index] || '[Verse]';
            return `${tag}\n${stanza.trim()}`;
        });
        return taggedStanzas.join('\n\n').trim();
    };


    const handleGeneratePrompt = () => {
        const prompt = buildPromptText();
        setGeneratedPrompt(prompt);
        if (settings.lyrics.trim()) {
            setGeneratedLyrics(buildLyricsOutput(settings.lyrics));
        } else {
            setGeneratedLyrics('');
        }
        showToast('Prompt generated!');
    };
    
    useEffect(() => {
        handleGeneratePrompt();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [settings]);

    // --- Actions ---
    const handleReset = () => {
        setSettings(initialSettings);
        setGeneratedPrompt('');
        setGeneratedLyrics('');
        showToast('Form has been reset.');
    };

    const handleSave = () => {
        localStorage.setItem('sunoPromptGeneratorSettings', JSON.stringify(settings));
        showToast('Settings saved to browser!');
    };

    const handleLoad = () => {
        const saved = localStorage.getItem('sunoPromptGeneratorSettings');
        if (saved) {
            setSettings(JSON.parse(saved));
            showToast('Settings loaded from browser!');
        } else {
            showToast('No saved settings found.');
        }
    };
    
    const handleExport = () => {
        const jsonString = JSON.stringify(settings, null, 2);
        const blob = new Blob([jsonString], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'suno_prompt_settings.json';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        showToast('Settings exported as JSON file.');
    };

    const handleImport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';
        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        const newSettings = JSON.parse(event.target?.result as string);
                        setSettings({ ...initialSettings, ...newSettings });
                        showToast('Settings imported successfully!');
                    } catch (error) {
                        showToast('Error: Invalid JSON file.');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    };

    const handlePresetChange = (presetName: string) => {
        const preset = QUICK_PRESETS.find(p => p.name === presetName);
        if (preset) {
            setSettings(prev => ({
                ...prev,
                styles: preset.set.style || [],
                instruments: preset.set.inst || [],
                tempo: preset.set.tempo ? String(preset.set.tempo) : prev.tempo,
                mood: preset.set.mood || prev.mood,
                key: preset.set.key || prev.key,
                mix: preset.set.mix || prev.mix,
                structure: preset.set.structure || prev.structure,
                negative: preset.set.negative || prev.negative,
            }));
            showToast(`Preset "${presetName}" applied.`);
        }
    };

    // --- Gemini API Calls ---
    const runGeminiAction = async (actionKey: string, serviceCall: () => Promise<any>, onSuccess: (result: any) => void) => {
        handleLoading(actionKey, true);
        try {
            const result = await serviceCall();
            if (result) {
                onSuccess(result);
            } else {
                showToast(`Gemini call for ${actionKey} returned no result.`);
            }
        } catch (error) {
            console.error(`Error in ${actionKey}:`, error);
            showToast(`Error: ${(error as Error).message}`);
        } finally {
            handleLoading(actionKey, false);
        }
    };

    const generateTitle = () => runGeminiAction('title',
        () => geminiService.generateTitle(settings.styles.join(', '), settings.mood, settings.theme),
        (result) => updateSetting('title', result)
    );

    const suggestMoodTheme = () => runGeminiAction('moodTheme',
        () => geminiService.suggestMoodAndTheme(settings.styles),
        (result) => {
            updateSetting('mood', result.mood);
            updateSetting('theme', result.theme);
        }
    );
    
    const translateTheme = () => runGeminiAction('translate',
        () => geminiService.translateToEnglish(settings.theme),
        (result) => updateSetting('theme', result)
    );

    const regenerateLyrics = () => runGeminiAction('lyrics',
        () => geminiService.generateLyrics(settings.theme, settings.lyricsLang),
        (result) => updateSetting('lyrics', result)
    );
    
    const suggestInstruments = () => runGeminiAction('instruments',
        () => geminiService.suggestInstruments(settings.styles, ALL_AVAILABLE_INSTRUMENTS),
        (result) => updateSetting('instruments', result)
    );
    
    const shortenPrompt = () => runGeminiAction('shorten',
        () => geminiService.shortenPrompt(generatedPrompt),
        (result) => setGeneratedPrompt(result)
    );
    
    const expandPrompt = () => runGeminiAction('expand',
        () => geminiService.expandPrompt(generatedPrompt),
        (result) => setGeneratedPrompt(result)
    );

    return (
        <div className="max-w-7xl mx-auto p-3 sm:p-5">
            <Header
                onSave={handleSave}
                onLoad={handleLoad}
                onExport={handleExport}
                onImport={handleImport}
                onReset={handleReset}
            />

            <div className="grid grid-cols-12 gap-4 auto-rows-fr">
                <div className="col-span-12 lg:col-span-7">
                    <BasicInfoCard
                        settings={settings}
                        updateSetting={updateSetting}
                        isLoading={isLoading}
                        onGenerateTitle={generateTitle}
                        onSuggestMoodTheme={suggestMoodTheme}
                        onTranslateTheme={translateTheme}
                        onRegenerateLyrics={regenerateLyrics}
                    />
                </div>
                <div className="col-span-12 lg:col-span-5">
                    <StyleCard
                        settings={settings}
                        updateSetting={updateSetting}
                        toggleStyle={value => toggleArraySetting('styles', value)}
                        quickPresets={QUICK_PRESETS}
                        onPresetChange={handlePresetChange}
                    />
                </div>
                <div className="col-span-12 lg:col-span-8">
                     <InstrumentationCard
                        settings={settings}
                        instrumentGroups={INSTRUMENT_GROUPS}
                        toggleInstrument={value => toggleArraySetting('instruments', value)}
                        updateSetting={updateSetting}
                        isLoading={isLoading}
                        onSuggestInstruments={suggestInstruments}
                    />
                </div>
                <div className="col-span-12 lg:col-span-4">
                     <StructureCard
                        settings={settings}
                        updateSetting={updateSetting}
                    />
                </div>

                <div className="col-span-12">
                    <OutputCard
                        generatedPrompt={generatedPrompt}
                        isLoading={isLoading}
                        onCopy={() => {
                            navigator.clipboard.writeText(generatedPrompt);
                            showToast('Prompt copied to clipboard!');
                        }}
                        onShorten={shortenPrompt}
                        onExpand={expandPrompt}
                    />
                </div>

                {generatedLyrics && (
                    <div className="col-span-12">
                        <LyricsOutputCard
                            lyrics={generatedLyrics}
                            onCopy={() => {
                                navigator.clipboard.writeText(generatedLyrics);
                                showToast('Lyrics copied to clipboard!');
                            }}
                        />
                    </div>
                )}
            </div>
            <Toast message={toastMessage} />
        </div>
    );
};

export default App;