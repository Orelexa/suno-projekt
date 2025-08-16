// ——— TELJES ADATKÉSZLETEK ———
const STYLE_PRESETS = [
  "electro swing","blues","slowfox","samba","mambo","cha-cha-cha","bossa nova","tango","waltz",
  "soul","rap","EDM","pop","pop rock","rock ballad","indie","metal","rock & roll","reggae",
  "electro-classic","techno","rave","techno dance","disco","R&B","electronic dance","gospel","classical",
  "folk","ska","jazz","hip-hop","ambient","trance","house","trap","synth-pop","synthwave",
  "cinematic orchestral","baroque","renaissance","opera","swing","big band","big band swing","romantic piano",
  "baroque pop","romantic classical","latin","latin pop","salsa","flamenco","chillwave","electro",
  "lofi hip hop","jazz ballad","folk acoustic","drum and bass","indie rock","grand orchestral"
];

const INSTRUMENT_GROUPS = [
  { name: 'Vonósok', items: [
    'string ensemble','violin section','viola section','cello section','double basses','solo violin','solo cello','harp'
  ]},
  { name: 'Fafúvósok', items: [
    'flute','oboe','clarinet','bassoon','piccolo','alto saxophone','tenor saxophone','woodwind ensemble'
  ]},
  { name: 'Rézfúvósok', items: [
    'trumpet section','horns in F','trombone section','tuba','brass ensemble'
  ]},
  { name: 'Billentyűsök', items: [
    'piano','electric piano','harpsichord','organ','synthesizer','synth pads','analog arpeggios'
  ]},
  { name: 'Ütősök / Dob', items: [
    'timpani','snare drum (orchestral)','cymbals','modern drum kit','electronic drums','shaker','congas','bongas'
  ]},
  { name: 'Pop / Band', items: [
    'electric guitar','acoustic guitar','bass guitar','upright bass','saxophone (alto)','saxophone (tenor)','trumpet section','trombone section','modern drum kit'
  ]},
  { name: 'Kórus / Vokál', items: [
    'choir (oohs)','female choir','male choir','mixed choir','solo vocal (female)','solo vocal (male)'
  ]}
];

const ALL_AVAILABLE_INSTRUMENTS = INSTRUMENT_GROUPS.flatMap(group => group.items);

const QUICK_PRESETS = [
  {name:'Cinematic Ballad', set:{style:['cinematic orchestral','romantic piano'], inst:['string ensemble','solo cello','piano'], tempo:72, mood:'emotional, warm, expansive', key:'A minor'}},
  {name:'EDM Drop', set:{style:['EDM','trance'], inst:['synthesizer','synth pads','modern drum kit'], tempo:128, mood:'energetic, euphoric', key:'E minor'}},
  {name:'Jazz Ballad', set:{style:['jazz ballad'], inst:['piano','upright bass','saxophone (tenor)'], tempo:70, mood:'smooth, romantic', key:'Bb major'}},
  {name:'Rock Anthem', set:{style:['rock','pop rock'], inst:['electric guitar','bass guitar','modern drum kit'], tempo:120, mood:'energetic, bold', key:'A major'}},
  {name:'Retro Swing', set:{style:['swing','big band'], inst:['trumpet section','trombone section','saxophone (alto)','upright bass'], tempo:110, mood:'playful, vintage', key:'C major'}},
  {name:'Folk Acoustic', set:{style:['folk acoustic'], inst:['acoustic guitar','violin section'], tempo:88, mood:'warm, organic', key:'G major'}}
];

// ——— DOM INICIALIZÁLÁS ———
document.addEventListener('DOMContentLoaded', () => {
  const styleChipsContainer = document.getElementById('styleChips');
  const instChipsContainer = document.getElementById('instChips');
  const quickPresetsDropdown = document.getElementById('quickPresetsDropdown');
  const lyricsTextarea = document.getElementById('lyricsText');
  const vocalChips = document.getElementById('vocalChips');
  const generateBtn = document.getElementById('generateBtn');
  const outputDiv = document.getElementById('output');
  const copyBtn = document.getElementById('copyBtn');
  const serverStatus = document.getElementById('serverStatus');
  const serverStatusText = document.getElementById('serverStatusText');

  // Szerver státusz ellenőrzése
  checkServerStatus();

  // STÍLUS CHIPEK LÉTREHOZÁSA
  STYLE_PRESETS.forEach(style => {
    const chip = document.createElement('div');
    chip.classList.add('chip');
    chip.textContent = style;
    chip.dataset.value = style;
    chip.addEventListener('click', () => chip.classList.toggle('active'));
    styleChipsContainer.appendChild(chip);
  });

  // HANGSZER CHIPEK LÉTREHOZÁSA CSOPORTOKBAN
  INSTRUMENT_GROUPS.forEach(group => {
    const details = document.createElement('details');
    details.classList.add('inst-group');
    details.open = true;
    
    const summary = document.createElement('summary');
    summary.classList.add('inst-head');
    summary.textContent = group.name;
    details.appendChild(summary);

    const body = document.createElement('div');
    body.classList.add('inst-body');
    const row = document.createElement('div');
    row.classList.add('row');
    
    group.items.forEach(item => {
      const chip = document.createElement('div');
      chip.classList.add('chip');
      chip.textContent = item;
      chip.dataset.value = item;
      chip.addEventListener('click', () => chip.classList.toggle('active'));
      row.appendChild(chip);
    });
    
    body.appendChild(row);
    details.appendChild(body);
    instChipsContainer.appendChild(details);
  });

  // GYORS SABLONOK FELTÖLTÉSE
  QUICK_PRESETS.forEach(preset => {
    const option = document.createElement('option');
    option.value = preset.name;
    option.textContent = preset.name;
    quickPresetsDropdown.appendChild(option);
  });

  // ——— ESEMÉNYKEZELŐK ———
  quickPresetsDropdown.addEventListener('change', (e) => {
    const presetName = e.target.value;
    const preset = QUICK_PRESETS.find(p => p.name === presetName);
    if (preset) {
      applyPreset(preset.set);
    }
  });

  // Tempo mód kezelése
  const tempoModeSelect = document.getElementById('tempoModeSelect');
  const tempoInput = document.getElementById('tempo');
  
  tempoModeSelect.addEventListener('change', () => {
    if (tempoModeSelect.value === 'original') {
      tempoInput.disabled = true;
      tempoInput.value = '';
    } else {
      tempoInput.disabled = false;
      if (!tempoInput.value) {
        tempoInput.value = '100';
      }
    }
  });
  
  vocalChips.addEventListener('click', (e) => {
    if (e.target.classList.contains('chip')) {
      vocalChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      e.target.classList.add('active');
      const isInstrumental = e.target.dataset.value === 'instrumental';
      lyricsTextarea.disabled = isInstrumental;
      if (isInstrumental) {
        lyricsTextarea.value = '';
      }
    }
  });
  
  document.getElementById('vocalType').addEventListener('click', (e) => {
    if (e.target.classList.contains('chip')) {
      e.target.classList.toggle('active');
    }
  });

  generateBtn.addEventListener('click', async () => {
    const prompt = await buildPrompt();
    if (prompt) {
      outputDiv.value = prompt;
      updateLengthBadge(prompt);
      
      const lyrics = lyricsTextarea.value;
      if (lyrics.trim() !== '') {
        document.getElementById('lyricsOutputSection').style.display = 'block';
        document.getElementById('lyricsOutput').value = buildLyricsOutput(lyrics);
      } else {
        document.getElementById('lyricsOutputSection').style.display = 'none';
      }
    }
  });

  copyBtn.addEventListener('click', () => {
    outputDiv.select();
    document.execCommand('copy');
    showButtonFeedback(copyBtn, 'Másolva!');
  });

  // ——— AI FUNKCIÓK ———
  document.getElementById('generateTitleBtn').addEventListener('click', async () => {
    const styles = getSelectedStyles();
    const mood = document.getElementById('mood').value;
    const theme = document.getElementById('theme').value;
    
    if (!styles.length && !mood && !theme) {
      alert('Válassz stílust, vagy adj meg hangulatot/témát!');
      return;
    }
    
    const prompt = `Suggest a creative, short song title in English. Style: ${styles.join(', ')}. Mood: ${mood}. Theme: ${theme}. Return only the title.`;
    const result = await callGeminiAPI(prompt, document.getElementById('generateTitleBtn'));
    if (result) {
      document.getElementById('title').value = result;
    }
  });

  document.getElementById('regenLyricsBtn').addEventListener('click', async () => {
    const lang = document.getElementById('lyricsLang').value;
    const theme = document.getElementById('theme').value || 'a song about anything';
    
    let prompt;
    if (lang === 'hu') {
      prompt = `Write song lyrics in Hungarian about "${theme}". Use tags like [verse] and [chorus]. Return only the lyrics.`;
    } else {
      const langMap = { en: 'English', it: 'Italian' };
      const languageName = langMap[lang] || 'English';
      prompt = `Write song lyrics in ${languageName} about "${theme}". Use tags like [verse] and [chorus]. Return only the lyrics.`;
    }
    
    const result = await callGeminiAPI(prompt, document.getElementById('regenLyricsBtn'));
    if (result) {
      lyricsTextarea.value = result;
      document.getElementById('lyricsOutputSection').style.display = 'block';
      document.getElementById('lyricsOutput').value = buildLyricsOutput(result);
    }
  });

  document.getElementById('suggestMoodThemeBtn').addEventListener('click', async () => {
    const styles = getSelectedStyles();
    let prompt = 'Suggest a mood (2-4 keywords) and theme (short sentence) for a song. Format: "mood; theme". ';
    if (styles.length > 0) {
      prompt += `Style: ${styles.join(', ')}.`;
    }
    
    const result = await callGeminiAPI(prompt, document.getElementById('suggestMoodThemeBtn'));
    if (result) {
      const [mood, theme] = result.split(';').map(s => s.trim());
      if (mood) document.getElementById('mood').value = mood;
      if (theme) document.getElementById('theme').value = theme;
    }
  });

  document.getElementById('forceHuDetect').addEventListener('click', async () => {
    const originalText = document.getElementById('theme').value;
    if (!originalText) return;
    
    const prompt = `Translate this to English: "${originalText}"`;
    const result = await callGeminiAPI(prompt, document.getElementById('forceHuDetect'));
    if (result) {
      document.getElementById('theme').value = result;
    }
  });

  document.getElementById('suggestInstBtn').addEventListener('click', async () => {
    const styles = getSelectedStyles();
    if (!styles.length) {
      alert('Válassz legalább egy zenei stílust!');
      return;
    }
    
    const prompt = `For music style "${styles.join(', ')}", suggest 5-8 instruments from: ${ALL_AVAILABLE_INSTRUMENTS.join(', ')}. Return comma-separated list.`;
    const result = await callGeminiAPI(prompt, document.getElementById('suggestInstBtn'));
    if (result) {
      // Deselect all
      instChipsContainer.querySelectorAll('.chip.active').forEach(chip => chip.classList.remove('active'));
      
      // Select suggested
      const suggested = result.split(',').map(inst => inst.trim());
      suggested.forEach(instName => {
        const chip = instChipsContainer.querySelector(`[data-value="${instName}"]`);
        if (chip) chip.classList.add('active');
      });
    }
  });

  document.getElementById('suggestMixBtn').addEventListener('click', async () => {
    const styles = getSelectedStyles();
    const mood = document.getElementById('mood').value;
    
    if (!styles.length && !mood) {
      alert('Válassz stílust vagy adj meg hangulatot!');
      return;
    }
    
    const prompt = `Suggest 3-4 music production notes for style: ${styles.join(', ')}, mood: ${mood}. Example: "wide stereo, gentle compression". Return comma-separated list.`;
    const result = await callGeminiAPI(prompt, document.getElementById('suggestMixBtn'));
    if (result) {
      document.getElementById('mix').value = result;
    }
  });

  document.getElementById('suggestNegativeBtn').addEventListener('click', async () => {
    const styles = getSelectedStyles();
    if (!styles.length) {
      alert('Válassz legalább egy stílust!');
      return;
    }
    
    const prompt = `For style "${styles.join(', ')}", suggest 2-3 elements to avoid. Example: "no harsh sibilance, avoid EDM drops". Return comma-separated.`;
    const result = await callGeminiAPI(prompt, document.getElementById('suggestNegativeBtn'));
    if (result) {
      document.getElementById('negative').value = result;
    }
  });

  document.getElementById('optimizePromptBtn').addEventListener('click', async () => {
    const currentPrompt = await buildPrompt();
    if (!currentPrompt) return;
    
    const prompt = `Optimize this Suno AI music prompt for better results. Keep structure but refine keywords and order:\n\n${currentPrompt}`;
    const result = await callGeminiAPI(prompt, document.getElementById('optimizePromptBtn'));
    if (result) {
      outputDiv.value = result;
      updateLengthBadge(result);
    }
  });

  document.getElementById('shortenBtn').addEventListener('click', async () => {
    const currentPrompt = outputDiv.value;
    if (!currentPrompt) return;
    
    const prompt = `Shorten this music prompt to essential keywords: "${currentPrompt}"`;
    const result = await callGeminiAPI(prompt, document.getElementById('shortenBtn'));
    if (result) {
      outputDiv.value = result;
      updateLengthBadge(result);
    }
  });

  document.getElementById('expandBtn').addEventListener('click', async () => {
    const currentPrompt = outputDiv.value;
    if (!currentPrompt) return;
    
    const prompt = `Expand this music prompt with more creative details: "${currentPrompt}"`;
    const result = await callGeminiAPI(prompt, document.getElementById('expandBtn'));
    if (result) {
      outputDiv.value = result;
      updateLengthBadge(result);
    }
  });

  document.getElementById('rhymeAssistBtn').addEventListener('click', async () => {
    const lyrics = lyricsTextarea.value.trim();
    const lastLine = lyrics.split('\n').pop();
    if (!lastLine) {
      alert('Írj be legalább egy sort a dalszövegbe!');
      return;
    }
    const theme = document.getElementById('theme').value || 'a song';
    const prompt = `Suggest 3 rhyming lines for: "${lastLine}". Theme: "${theme}". Return each on new line.`;
    const result = await callGeminiAPI(prompt, document.getElementById('rhymeAssistBtn'));
    if (result) {
      document.getElementById('lyricsSuggestionOutput').innerHTML = `<strong>Rím javaslatok:</strong><br>${result.replace(/\n/g, '<br>')}`;
      document.getElementById('lyricsSuggestionOutput').style.display = 'block';
    }
  });

  document.getElementById('metaphorAssistBtn').addEventListener('click', async () => {
    const theme = document.getElementById('theme').value;
    if (!theme) {
      alert('Adj meg egy témát!');
      return;
    }
    const prompt = `Suggest 3 creative metaphors for theme "${theme}". Return each on new line.`;
    const result = await callGeminiAPI(prompt, document.getElementById('metaphorAssistBtn'));
    if (result) {
      document.getElementById('lyricsSuggestionOutput').innerHTML = `<strong>Metafora javaslatok:</strong><br>${result.replace(/\n/g, '<br>')}`;
      document.getElementById('lyricsSuggestionOutput').style.display = 'block';
    }
  });

  document.getElementById('verseExpanderBtn').addEventListener('click', async () => {
    const lyrics = lyricsTextarea.value;
    const chorusMatch = lyrics.match(/\[chorus\]([\s\S]*?)(\n\[|$)/i);
    if (!chorusMatch || !chorusMatch[1].trim()) {
      alert('Írj egy refrént ([chorus]...) a verze bővítéséhez!');
      return;
    }
    const chorus = chorusMatch[1].trim();
    const theme = document.getElementById('theme').value || 'a song';
    const prompt = `Based on chorus:\n\n${chorus}\n\nAnd theme "${theme}", write a 4-line verse. Return only verse text.`;
    const result = await callGeminiAPI(prompt, document.getElementById('verseExpanderBtn'));
    if (result) {
      document.getElementById('lyricsSuggestionOutput').innerHTML = `<strong>Verze javaslat:</strong><br>${result.replace(/\n/g, '<br>')}`;
      document.getElementById('lyricsSuggestionOutput').style.display = 'block';
    }
  });

  document.getElementById('styleBlenderBtn').addEventListener('click', async () => {
    const styles = getSelectedStyles();
    if (styles.length < 2) {
      alert('Válassz legalább két stílust a keveréshez!');
      return;
    }
    const prompt = `Create a hybrid music genre from: ${styles.join(', ')}. Format: "Genre Name; Description".`;
    const result = await callGeminiAPI(prompt, document.getElementById('styleBlenderBtn'));
    if (result) {
      const [genreName, description] = result.split(';').map(s => s.trim());
      if (genreName) {
        const currentExtra = document.getElementById('styleExtra').value;
        document.getElementById('styleExtra').value = currentExtra ? `${currentExtra}, ${genreName}` : genreName;
      }
      if (description) {
        const currentTheme = document.getElementById('theme').value;
        document.getElementById('theme').value = currentTheme ? `${currentTheme} ${description}` : description;
      }
    }
  });

  document.getElementById('copyThemeBtn').addEventListener('click', () => {
    document.getElementById('theme').select();
    document.execCommand('copy');
    showButtonFeedback(document.getElementById('copyThemeBtn'), 'Másolva!');
  });

  document.getElementById('copyLyricsBtn').addEventListener('click', () => {
    document.getElementById('lyricsOutput').select();
    document.execCommand('copy');
    showButtonFeedback(document.getElementById('copyLyricsBtn'), 'Másolva!');
  });

  // ——— MENTÉS/BETÖLTÉS FUNKCIÓK ———
  document.getElementById('savePresetBtn').addEventListener('click', () => {
    saveCurrentSettings();
  });

  document.getElementById('loadPresetBtn').addEventListener('click', () => {
    loadSavedSettings(true);
  });

  document.getElementById('exportBtn').addEventListener('click', () => {
    exportSettings();
  });

  document.getElementById('importBtn').addEventListener('click', () => {
    importSettings();
  });

  document.getElementById('resetBtn').addEventListener('click', () => {
    resetForm();
  });

  // ——— SEGÉDFUNKCIÓK ———
  function getSelectedStyles() {
    return Array.from(styleChipsContainer.querySelectorAll('.chip.active')).map(c => c.dataset.value);
  }

  function getSelectedInstruments() {
    return Array.from(instChipsContainer.querySelectorAll('.chip.active')).map(c => c.dataset.value);
  }

  function getSelectedVocalTypes() {
    return Array.from(document.querySelectorAll('#vocalType .chip.active')).map(c => c.dataset.voctype);
  }

  function showButtonFeedback(button, text) {
    const originalText = button.textContent;
    button.textContent = text;
    setTimeout(() => {
      button.textContent = originalText;
    }, 2000);
  }

  // ——— SZERVER STÁTUSZ ELLENŐRZÉS ———
  async function checkServerStatus() {
    try {
      const response = await fetch('/.netlify/functions/gemini-proxy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: 'test' })
      });
      
      if (response.ok || response.status === 400) { // 400 is OK too (means server is responding)
        serverStatus.classList.add('online');
        serverStatusText.textContent = 'Online';
      } else {
        throw new Error('Server error');
      }
    } catch (error) {
      serverStatus.classList.add('error');
      serverStatusText.textContent = 'Offline';
      console.warn('Server status check failed:', error.message);
    }
  }

  // ——— GEMINI API HÍVÁS (NETLIFY FUNCTIONS) ———
  async function callGeminiAPI(prompt, button) {
    const originalText = button.textContent;
    button.textContent = '...';
    button.disabled = true;
    
    try {
      const response = await fetch('/.netlify/functions/gemini-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server error: ${response.status}`);
      }

      const result = await response.json();
      return result.text.trim();
    } catch (error) {
      console.error('API call failed:', error);
      alert(`API hiba: ${error.message}`);
      return null;
    } finally {
      button.textContent = originalText;
      button.disabled = false;
    }
  }

  // ——— PROMPT ÉPÍTÉS ———
  async function buildPrompt() {
    let prompt = '';
    const title = document.getElementById('title').value;
    const tempoMode = document.getElementById('tempoModeSelect').value;
    const tempo = document.getElementById('tempo').value;
    const key = document.getElementById('key').value;
    const timeSignature = document.getElementById('timeSignature').value;
    const vocal = vocalChips.querySelector('.chip.active').dataset.value;
    const vocalTypes = getSelectedVocalTypes();
    const mood = document.getElementById('mood').value;
    const selectedStyles = getSelectedStyles();
    const selectedInst = getSelectedInstruments();
    const instExtra = document.getElementById('instExtra').value;
    const styleExtra = document.getElementById('styleExtra').value;
    const negative = document.getElementById('negative').value;
    const structure = document.getElementById('structure').value;
    const ending = document.getElementById('ending').value;
    const mix = document.getElementById('mix').value;

    // Vokál
    if (vocal === 'instrumental') {
      prompt += 'Vocal: instrumental only\n';
    } else if (vocal === 'choir') {
      prompt += 'Vocal: choir / backing only\n';
    } else if (vocalTypes.length > 0) {
      const types = vocalTypes.map(vt => `${vt} vocal`).join(', ');
      prompt += `Vocal: ${types}\n`;
    }

    // Stílus és hangulat
    let styleString = selectedStyles.join(', ');
    if (styleExtra) styleString += styleExtra ? `, ${styleExtra}` : styleExtra;
    if (mood) styleString += mood ? `, ${mood}` : mood;
    if (styleString) {
      prompt += `Style: [${styleString}]\n`;
    }

    // Hangszerek
    let instString = selectedInst.join(', ');
    if (instExtra) instString += instExtra ? `, ${instExtra}` : instExtra;
    if (instString) {
      if (selectedInst.length === 1 && !instExtra) {
        prompt += `Instruments: [only ${instString}]\n`;
      } else {
        prompt += `Instruments: [${instString}]\n`;
      }
    }
    
    // Technikai részletek
    if (tempoMode === 'original') {
      prompt += `Tempo: original BPM\n`;
    } else if (tempo) {
      prompt += `Tempo: ${tempo}\n`;
    }
    
    if (key) prompt += `Key: ${key}\n`;
    if (timeSignature) prompt += `Time Signature: ${timeSignature}\n`;
    if (structure) prompt += `Structure: ${structure}\n`;
    if (ending) prompt += `Ending: ${ending}\n`;
    if (mix) prompt += `Mix: ${mix}\n`;
    if (negative) prompt += `Negative: ${negative}\n`;
    if (title) prompt += `Title: ${title}\n`;

    return prompt.trim();
  }

  function buildLyricsOutput(lyrics) {
    const stanzas = lyrics.split(/\n\s*\n/);
    const tags = ['[Verse]', '[Chorus]', '[Verse]', '[Chorus]', '[Bridge]', '[Chorus]', '[Outro]'];
    const taggedStanzas = stanzas.map((stanza, index) => {
      const hasTag = ['[verse]', '[chorus]', '[bridge]', '[intro]', '[outro]'].some(tag => 
        stanza.toLowerCase().trim().startsWith(tag)
      );

      if (hasTag) {
        return stanza.trim();
      } else {
        const tag = tags[index] || '[Verse]';
        return `${tag}\n${stanza.trim()}`;
      }
    });
    
    return taggedStanzas.join('\n\n').trim();
  }

  function updateLengthBadge(prompt) {
    const length = prompt.length;
    document.getElementById('lengthBadge').textContent = `${length} ch`;
    const lenDot = document.getElementById('lenDot');
    const lenHint = document.getElementById('lenHint');
    
    if (length > 250) {
      lenDot.classList.remove('good', 'warn');
      lenDot.classList.add('bad');
      lenHint.textContent = 'Túl hosszú';
    } else if (length > 150) {
      lenDot.classList.remove('good', 'bad');
      lenDot.classList.add('warn');
      lenHint.textContent = 'Kicsit hosszú';
    } else {
      lenDot.classList.remove('warn', 'bad');
      lenDot.classList.add('good');
      lenHint.textContent = 'Ideális';
    }
  }

  function applyPreset(preset) {
    resetForm(false);
    
    // Stílusok alkalmazása
    if (preset.style) {
      preset.style.forEach(s => {
        const chip = styleChipsContainer.querySelector(`[data-value="${s}"]`);
        if (chip) chip.classList.add('active');
      });
    }
    
    // Hangszerek alkalmazása
    if (preset.inst) {
      preset.inst.forEach(i => {
        const chip = instChipsContainer.querySelector(`[data-value="${i}"]`);
        if (chip) chip.classList.add('active');
      });
    }
    
    // Egyéb beállítások
    if (preset.tempo) document.getElementById('tempo').value = preset.tempo;
    if (preset.mood) document.getElementById('mood').value = preset.mood;
    if (preset.key) document.getElementById('key').value = preset.key;
    if (preset.mix) document.getElementById('mix').value = preset.mix;
    if (preset.structure) document.getElementById('structure').value = preset.structure;
    if (preset.negative) document.getElementById('negative').value = preset.negative;
  }
  
  function resetForm() {
    // Alapértékek visszaállítása
    document.getElementById('title').value = '';
    document.getElementById('tempoModeSelect').value = 'bpm';
    document.getElementById('tempo').value = '100';
    document.getElementById('tempo').disabled = false;
    document.getElementById('key').value = '';
    document.getElementById('timeSignature').value = '4/4';
    document.getElementById('lyricsText').value = '';
    document.getElementById('mood').value = 'cinematic, dynamic, warm';
    document.getElementById('theme').value = '';
    document.getElementById('styleExtra').value = '';
    document.getElementById('negative').value = '';
    document.getElementById('structure').value = '';
    document.getElementById('ending').value = 'clear, resolved ending (no fade-out)';
    document.getElementById('mix').value = '';
    document.getElementById('instExtra').value = '';
    document.getElementById('output').value = '';
    document.getElementById('lyricsOutput').value = '';
    document.getElementById('lyricsOutputSection').style.display = 'none';
    document.getElementById('lyricsSuggestionOutput').style.display = 'none';
    
    // Chipek tisztítása
    document.querySelectorAll('.chip.active').forEach(chip => chip.classList.remove('active'));
    
    // Vokál alapértelmezett beállítása
    vocalChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    document.querySelector('#vocalChips .chip[data-value="vocal"]').classList.add('active');
    
    updateLengthBadge('');
  }

  function saveCurrentSettings() {
    const settings = {
      title: document.getElementById('title').value,
      tempoMode: document.getElementById('tempoModeSelect').value,
      tempo: document.getElementById('tempo').value,
      key: document.getElementById('key').value,
      timeSignature: document.getElementById('timeSignature').value,
      lyrics: document.getElementById('lyricsText').value,
      vocal: document.querySelector('#vocalChips .chip.active').dataset.value,
      vocalTypes: getSelectedVocalTypes(),
      mood: document.getElementById('mood').value,
      theme: document.getElementById('theme').value,
      styles: getSelectedStyles(),
      styleExtra: document.getElementById('styleExtra').value,
      negative: document.getElementById('negative').value,
      instruments: getSelectedInstruments(),
      instExtra: document.getElementById('instExtra').value,
      structure: document.getElementById('structure').value,
      ending: document.getElementById('ending').value,
      mix: document.getElementById('mix').value
    };
    
    localStorage.setItem('sunoPromptGeneratorSettings', JSON.stringify(settings));
    showButtonFeedback(document.getElementById('savePresetBtn'), 'Mentve!');
  }

  function loadSavedSettings(showNotification = false) {
    const savedSettings = localStorage.getItem('sunoPromptGeneratorSettings');
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      applyImportedSettings(settings);
      
      if (showNotification) {
        showButtonFeedback(document.getElementById('loadPresetBtn'), 'Betöltve!');
      }
    } else if (showNotification) {
      alert('Nincs mentett beállítás!');
    }
  }

  function exportSettings() {
    const settings = {
      title: document.getElementById('title').value,
      tempo: document.getElementById('tempo').value,
      key: document.getElementById('key').value,
      lyrics: document.getElementById('lyricsText').value,
      vocal: document.querySelector('#vocalChips .chip.active').dataset.value,
      vocalTypes: getSelectedVocalTypes(),
      mood: document.getElementById('mood').value,
      theme: document.getElementById('theme').value,
      styles: getSelectedStyles(),
      styleExtra: document.getElementById('styleExtra').value,
      negative: document.getElementById('negative').value,
      instruments: getSelectedInstruments(),
      instExtra: document.getElementById('instExtra').value,
      structure: document.getElementById('structure').value,
      ending: document.getElementById('ending').value,
      mix: document.getElementById('mix').value
    };
    
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
  }

  function importSettings() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const settings = JSON.parse(event.target.result);
            applyImportedSettings(settings);
            showButtonFeedback(document.getElementById('importBtn'), 'Importálva!');
          } catch (error) {
            alert('Érvénytelen JSON fájl!');
            console.error(error);
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  }
  
  function applyImportedSettings(settings) {
    resetForm();
    
    // Alapadatok
    document.getElementById('title').value = settings.title || '';
    document.getElementById('tempoModeSelect').value = settings.tempoMode || 'bpm';
    document.getElementById('tempo').value = settings.tempo || '100';
    document.getElementById('tempo').disabled = (settings.tempoMode === 'original');
    document.getElementById('key').value = settings.key || '';
    document.getElementById('timeSignature').value = settings.timeSignature || '4/4';
    document.getElementById('lyricsText').value = settings.lyrics || '';
    document.getElementById('mood').value = settings.mood || '';
    document.getElementById('theme').value = settings.theme || '';
    document.getElementById('styleExtra').value = settings.styleExtra || '';
    document.getElementById('negative').value = settings.negative || '';
    document.getElementById('structure').value = settings.structure || '';
    document.getElementById('ending').value = settings.ending || 'clear, resolved ending (no fade-out)';
    document.getElementById('mix').value = settings.mix || '';
    document.getElementById('instExtra').value = settings.instExtra || '';
    
    // Vokál beállítások
    vocalChips.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
    const vocalChip = document.querySelector(`#vocalChips .chip[data-value="${settings.vocal}"]`);
    if (vocalChip) vocalChip.classList.add('active');
    
    // Vokál típusok
    if (settings.vocalTypes) {
      settings.vocalTypes.forEach(type => {
        const chip = document.querySelector(`#vocalType .chip[data-voctype="${type}"]`);
        if (chip) chip.classList.add('active');
      });
    }
    
    // Stílusok
    if (settings.styles) {
      settings.styles.forEach(style => {
        const chip = document.querySelector(`#styleChips .chip[data-value="${style}"]`);
        if (chip) chip.classList.add('active');
      });
    }
    
    // Hangszerek
    if (settings.instruments) {
      settings.instruments.forEach(inst => {
        const chip = document.querySelector(`#instChips .chip[data-value="${inst}"]`);
        if (chip) chip.classList.add('active');
      });
    }
  }

  // Kezdeti betöltés
  loadSavedSettings();
});