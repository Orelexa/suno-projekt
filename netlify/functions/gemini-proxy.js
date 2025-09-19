const { GoogleGenAI, Type } = require("@google/genai");

// A sémák biztonságosan a szerveren vannak definiálva.
const SCHEMAS = {
    moodAndTheme: {
        type: Type.OBJECT,
        properties: {
            mood: { type: Type.STRING, description: "A few keywords for the mood." },
            theme: { type: Type.STRING, description: "A short sentence for the theme." },
        },
        required: ["mood", "theme"],
    }
};

const handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
    }

    const apiKey = process.env.API_KEY;
    if (!apiKey) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "API kulcs nincs beállítva a szerveroldali környezetben. Ellenőrizd a Netlify 'Environment variables' beállításait." }),
        };
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = "gemini-2.5-flash";

    try {
        const body = JSON.parse(event.body || '{}');
        const { prompt, action, expectsJson } = body;

        if (!action || !prompt) {
            return { statusCode: 400, body: JSON.stringify({ error: "Missing 'action' or 'prompt' in request body" }) };
        }
        
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: (expectsJson && action === 'suggestMoodAndTheme') ? {
                responseMimeType: "application/json",
                responseSchema: SCHEMAS.moodAndTheme,
            } : {},
        });

        let result;
        if (expectsJson) {
            result = JSON.parse(response.text);
        } else {
            result = response.text?.trim();
        }
        
        if (result === undefined || result === null) {
             return { statusCode: 500, body: JSON.stringify({ error: "API returned an empty response. The prompt may have been blocked." }) };
        }

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ result }),
        };

    } catch (error) {
        console.error("Error in Netlify function:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: `Gemini API hiba: ${(error).message}` }),
        };
    }
};

module.exports = { handler };
