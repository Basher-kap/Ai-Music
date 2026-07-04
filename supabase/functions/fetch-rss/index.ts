// supabase/functions/fetch-rss/index.ts

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { urls } = await req.json();

    if (!Array.isArray(urls) || urls.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Please provide a list of feed URLs.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch every source in parallel; individual failures don't take down
    // the whole batch — each result reports its own success/failure so the
    // client can still show articles from whichever sources did succeed.
    const results = await Promise.all(
      urls.map(async (url: string) => {
        try {
          const res = await fetch(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (compatible; AiMusicBot/1.0)' },
          });
          if (!res.ok) throw new Error(`HTTP ${res.status}`);
          const xmlData = await res.text();
          return { url, xmlData, error: null };
        } catch (err) {
          console.error(`[fetch-rss] Failed to fetch ${url}:`, err instanceof Error ? err.message : err);
          return { url, xmlData: '', error: err instanceof Error ? err.message : 'Fetch failed' };
        }
      })
    );

    return new Response(
      JSON.stringify({ results }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    console.error('[fetch-rss] Error:', err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : 'Something went wrong.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});