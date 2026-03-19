export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  try {
    const { query } = req.body;
    const SERP_KEY = process.env.SERP_KEY;
    
    const url = `https://serpapi.com/search.json?api_key=${SERP_KEY}&engine=google&q=${encodeURIComponent(query + ' supplier Europe')}&num=10&gl=de&hl=en`;
    
    const r = await fetch(url);
    const d = await r.json();
    
    const results = (d.organic_results || []).slice(0, 10).map(r => ({
      title: r.title,
      link: r.link,
      snippet: r.snippet || ''
    }));
    
    res.status(200).json({ results });
  } catch (e) {
    res.status(500).json({ error: e.message, results: [] });
  }
}
