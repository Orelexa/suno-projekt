// No more imports from @google/genai needed here.

async function callProxy<T>(payload: { action: string; prompt: string; expectsJson?: boolean }): Promise<T> {
  try {
    const response = await fetch('/api/gemini-proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP hiba! Státusz: ${response.status}`);
    }

    const data = await response.json();
    return data.result as T;
  } catch (error) {
    console.error(`Hiba a proxy hívásakor (${payload.action}):`, error);
    throw new Error((error as Error).message || 'Ismeretlen hiba történt a szerverrel való kommunikáció során.');
  }
}


export const generateTitle = (style: string, mood: string, theme: string): Promise<string> => {
    const prompt = `Suggest one creative, short song title in English. Return only the title itself, no quotes. Style: ${style}. Mood: ${mood}. Theme: ${theme}.`;
    return callProxy<string>({ action: 'generateTitle', prompt });
};

export const suggestMoodAndTheme = async (styles: string[]): Promise<{ mood: string; theme: string }> => {
    const prompt = `Suggest a creative mood (2-4 keywords) and a short theme description for a song. Respond in JSON with "mood" and "theme" keys. The song style is: ${styles.join(', ')}.`;
    return callProxy<{ mood: string; theme: string }>({ action: 'suggestMoodAndTheme', prompt, expectsJson: true });
};

export const translateToEnglish = (text: string): Promise<string> => {
    const prompt = `Translate the following text to English. Return only the translated text. Text: "${text}"`;
    return callProxy<string>({ action: 'translateToEnglish', prompt });
};

export const generateLyrics = (theme: string, language: string): Promise<string> => {
    const langMap: { [key: string]: string } = { en: 'English', hu: 'Hungarian', it: 'Italian' };
    const languageName = langMap[language] || 'English';
    const prompt = `Write song lyrics about "${theme}". The language must be ${languageName}. Structure with tags like [Verse] and [Chorus]. Return only the lyrics.`;
    return callProxy<string>({ action: 'generateLyrics', prompt });
};

export const suggestInstruments = async (styles: string[], allInstruments: string[]): Promise<string[]> => {
    const prompt = `Based on the music style(s) '${styles.join(', ')}', suggest a list of 5 to 8 appropriate musical instruments. Return only a comma-separated list of instruments from these available options: ${allInstruments.join(', ')}.`;
    const result = await callProxy<string>({ action: 'suggestInstruments', prompt });
    // Handle cases where the API might return an empty string or other non-array results
    if (typeof result === 'string' && result.length > 0) {
        return result.split(',').map(inst => inst.trim());
    }
    return [];
};

export const shortenPrompt = (currentPrompt: string): Promise<string> => {
    const prompt = `Shorten this music prompt to its essential keywords, keeping the original structure (e.g., 'Style: ...'). Be concise. Prompt: "${currentPrompt}"`;
    return callProxy<string>({ action: 'shortenPrompt', prompt });
};

export const expandPrompt = (currentPrompt: string): Promise<string> => {
    const prompt = `Expand this music prompt with more creative details and descriptions, keeping the original structure (e.g., 'Style: ...'). Prompt: "${currentPrompt}"`;
    return callProxy<string>({ action: 'expandPrompt', prompt });
};