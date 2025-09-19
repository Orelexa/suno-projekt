
import type { PromptSettings, InstrumentGroup, QuickPreset } from './types.js';

export const initialSettings: PromptSettings = {
    title: '',
    tempoMode: 'bpm',
    tempo: '100',
    tempoOriginalTag: false,
    key: '',
    vocalStyle: 'vocal',
    vocalTypes: [],
    lyrics: '',
    lyricsLang: 'en',
    mood: 'cinematic, dynamic, warm',
    theme: '',
    promptMode: 'compact',
    styles: [],
    styleExtra: '',
    negative: '',
    instruments: [],
    instExtra: '',
    structurePreset: '',
    structure: '',
    ending: 'clear, resolved ending (no fade-out)',
    mix: ''
};

export const STYLE_PRESETS: string[] = [
    "electro swing", "blues", "slowfox", "samba", "mambo", "cha-cha-cha", "bossa nova", "tango", "waltz",
    "soul", "rap", "EDM", "pop", "pop rock", "rock ballad", "indie", "metal", "rock & roll", "reggae",
    "electro-classic", "techno", "rave", "techno dance", "disco", "R&B", "electronic dance", "gospel", "classical",
    "folk", "ska", "jazz", "hip-hop", "ambient", "trance", "house", "trap", "synth-pop", "synthwave",
    "cinematic orchestral", "baroque", "renaissance", "opera", "swing", "big band", "big band swing", "romantic piano",
    "baroque pop", "romantic classical", "latin", "latin pop", "salsa", "flamenco", "chillwave", "electro",
    "lofi hip hop", "jazz ballad", "folk acoustic", "drum and bass", "indie rock",
    "grand orchestral", "epic orchestral"
];

export const INSTRUMENT_GROUPS: InstrumentGroup[] = [
    { name: 'Strings', items: ['string ensemble', 'violin section', 'viola section', 'cello section', 'double basses', 'solo violin', 'solo cello', 'harp'] },
    { name: 'Woodwinds', items: ['flute', 'oboe', 'clarinet', 'bassoon', 'piccolo', 'alto saxophone', 'tenor saxophone', 'woodwind ensemble'] },
    { name: 'Brass', items: ['trumpet section', 'french horn section', 'trombone section', 'tuba', 'brass ensemble'] },
    { name: 'Keyboards', items: ['piano', 'electric piano', 'harpsichord', 'organ', 'synthesizer', 'synth pads', 'analog arpeggios', 'sub bass', '808 bass'] },
    { name: 'Percussion / Drums', items: ['timpani', 'orchestral snare', 'cymbals', 'modern drum kit', 'electronic drums', 'shaker', 'congas', 'bongos', 'hi-hat', 'snare'] },
    { name: 'Pop / Band', items: ['electric guitar', 'acoustic guitar', 'bass guitar', 'upright bass', 'mandolin', 'fiddle'] },
    { name: 'Choir / Vocal', items: ['choir (oohs)', 'female choir', 'male choir', 'mixed choir', 'solo vocal (female)', 'solo vocal (male)'] }
];

export const ALL_AVAILABLE_INSTRUMENTS: string[] = INSTRUMENT_GROUPS.flatMap(group => group.items);

export const QUICK_PRESETS: QuickPreset[] = [
    { name: 'Cinematic Ballad', set: { style: ['cinematic orchestral', 'romantic piano', 'jazz ballad'], inst: ['string ensemble', 'solo cello', 'piano', 'french horn section', 'timpani', 'modern drum kit'], tempo: 72, mood: 'emotional, warm, expansive', key: 'A minor', mix: 'wide strings, gentle tape sat, clear vocal', structure: 'Intro, Verse, Chorus, Verse, Chorus, Bridge, Chorus, Outro', negative: 'no heavy distortion, no EDM drop' } },
    { name: 'EDM Drop', set: { style: ['EDM', 'trance', 'house'], inst: ['synthesizer', 'synth pads', 'sub bass', 'modern drum kit'], tempo: 128, mood: 'energetic, euphoric, bright', key: 'E minor', mix: 'sidechain pump, tight low end', structure: 'Intro, Build, Drop, Break, Drop, Outro', negative: 'no guitars, no orchestral strings' } },
    { name: 'Retro Swing', set: { style: ['swing', 'big band', 'electro swing'], inst: ['trumpet section', 'trombone section', 'alto saxophone', 'tenor saxophone', 'modern drum kit', 'upright bass'], tempo: 110, mood: 'playful, vintage, lively', key: 'C major', mix: 'tape vibe, crisp brass', structure: 'Intro, A, A, B, A, Outro', negative: 'no modern EDM synths' } },
    { name: 'Epic Orchestral', set: { style: ['epic orchestral', 'cinematic orchestral'], inst: ['string ensemble', 'brass ensemble', 'timpani', 'orchestral snare', 'choir (oohs)'], tempo: 90, mood: 'majestic, powerful, dramatic', key: 'D minor', mix: 'wide dynamic range, reverb on brass', structure: 'Overture, Theme, Development, Recap, Coda', negative: 'no electronic synths' } },
    { name: 'Lo-fi Chillhop', set: { style: ['lofi hip hop'], inst: ['electric piano', 'synth pads', 'upright bass', 'modern drum kit'], tempo: 80, mood: 'relaxed, nostalgic, warm', key: 'F major', mix: 'vinyl crackle, soft compression', structure: 'Intro, Loop A, Loop B, Outro', negative: 'no aggressive drums' } },
    { name: 'Trap 150 BPM', set: { style: ['trap'], inst: ['808 bass', 'hi-hat', 'snare', 'synth pads', 'modern drum kit'], tempo: 150, mood: 'dark, aggressive, confident', key: 'C minor', mix: 'heavy sub bass, crisp hats, stereo wideners', structure: 'Intro, Verse, Hook, Verse, Hook, Outro', negative: 'no orchestral strings' } }
];