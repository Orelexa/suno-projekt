
export type VocalStyle = 'vocal' | 'instrumental' | 'choir';
export type VocalType = 'male' | 'female' | 'child' | 'female choir' | 'male choir' | 'mixed choir';
export type TempoMode = 'bpm' | 'original';
export type PromptMode = 'compact' | 'verbose';

export interface PromptSettings {
  title: string;
  tempoMode: TempoMode;
  tempo: string;
  tempoOriginalTag: boolean;
  key: string;
  vocalStyle: VocalStyle;
  vocalTypes: VocalType[];
  lyrics: string;
  lyricsLang: string;
  mood: string;
  theme: string;
  promptMode: PromptMode;
  styles: string[];
  styleExtra: string;
  negative: string;
  instruments: string[];
  instExtra: string;
  structurePreset: string;
  structure: string;
  ending: string;
  mix: string;
}

export interface InstrumentGroup {
    name: string;
    items: string[];
}

export interface QuickPreset {
    name: string;
    set: Partial<{
        style: string[];
        inst: string[];
        tempo: number;
        mood: string;
        key: string;
        mix: string;
        structure: string;
        negative: string;
    }>;
}