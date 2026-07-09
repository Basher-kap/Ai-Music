// supabase/functions/format-lyrics/index.ts

const GEMINI_API_KEY = Deno.env.get('GEMINI_API_KEY');
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { kanji, romaji, english } = await req.json();

    if (!kanji?.trim() || !romaji?.trim() || !english?.trim()) {
      return new Response(
        JSON.stringify({ error: 'Please provide kanji, romaji, and english lyrics.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const prompt = `
You are a Japanese lyrics formatter and translator verifier.

The user has provided three versions of Japanese song lyrics:
1. Kanji (original Japanese)
2. Romaji (romanized Japanese)
3. English (translation)

Your tasks:
1. Verify that the Romaji correctly matches the Kanji pronunciation line by line. Fix any errors silently.
2. Verify that the English translation correctly matches the Kanji meaning line by line. Fix any errors silently.
3. Format the output by interleaving the lines in this exact pattern per line group:
   - Kanji line
   - English line
   - Romaji line
   - (blank line between groups)

IMPORTANT:
- Match lines by their position — first Kanji line goes with first English line and first Romaji line
- Keep the exact same number of lines as the input
- Do not add any explanation, notes, or extra text — output ONLY the formatted lyrics
- Separate each group of 3 lines with exactly one blank line

Here are the lyrics:

KANJI:
${kanji}

ROMAJI:
${romaji}

ENGLISH:
${english}
    `.trim();

    const response = await fetch(GEMINI_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          maxOutputTokens: 32768,
          responseMimeType: 'application/json',
          responseSchema: {
            type: 'OBJECT',
            properties: {
              lyricGroups: {
                type: 'ARRAY',
                description: 'List of matched lyric rows grouped by timeline order.',
                items: {
                  type: 'OBJECT',
                  properties: {
                    kanji: { type: 'STRING' },
                    english: { type: 'STRING' },
                    romaji: { type: 'STRING' },
                  },
                  required: ['kanji', 'english', 'romaji'],
                },
              },
            },
            required: ['lyricGroups'],
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      const rawMsg = data?.error?.message ?? '';
      console.error('[format-lyrics] Gemini API error:', rawMsg);
      if (/quota|rate limit|resource_exhausted/i.test(rawMsg)) {
        throw new Error('Google servers are busy right now. Please wait a few seconds and try again!');
      }
      throw new Error('The lyrics service ran into a problem on our end. Please try again in a moment.');
    }

    const finishReason = data?.candidates?.[0]?.finishReason;
    if (finishReason === 'MAX_TOKENS') {
      throw new Error('These lyrics are too long to process in one go. Try splitting them into shorter sections.');
    }

    const rawJsonString = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!rawJsonString) {
      console.error('[format-lyrics] No content returned from Gemini response:', JSON.stringify(data));
      throw new Error('Something went wrong generating the lyrics. Please try again.');
    }

    // Gemini 2.5 Flash sometimes wraps JSON in markdown code fences even
    // when responseMimeType is set to application/json
    const cleanedJson = rawJsonString
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/, '')
      .trim();

    if (!cleanedJson) {
      console.error('[format-lyrics] Empty response after markdown-fence cleanup');
      throw new Error('Something went wrong generating the lyrics. Please try again.');
    }

    let parsedData;
    try {
      parsedData = JSON.parse(cleanedJson);
    } catch (parseErr) {
      console.error('[format-lyrics] JSON parse failed:', parseErr, '\nRaw text:', cleanedJson);
      throw new Error('Something went wrong generating the lyrics. Please try again.');
    }
    const groups = parsedData?.lyricGroups ?? [];

    if (groups.length === 0) {
      throw new Error("Couldn't match up the lyrics lines. Double-check each version has a similar number of lines and try again.");
    }

    return new Response(
      JSON.stringify({ groups }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[format-lyrics] Error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Something went wrong.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});