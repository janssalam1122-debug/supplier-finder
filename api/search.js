export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).end();

  const { query, imageBase64, imageType } = req.body;
  const SERP_KEY = process.env.SERP_KEY;

  const searches = [
    `${query} supplier site:europages.com OR site:europages.de`,
    `${query} manufacturer site:kompass.com OR site:de.kompass.com`,
    `${query} wholesale supplier Europe B2B`
  ];

  let allItems = [];
  for (const q of searches) {
    const url = `https://serpapi.com/search?api_key=${SERP_KEY}&engine=google&q=${encodeURIComponent(q)}&num=5&gl=de&hl=en`;
    const r = await fetch(url);
    const d = await r.json();
    if (d.organic_results) allItems = [...allItems, ...d.organic_results];
  }

  const seen = new Set();
  const results = allItems.filter(i => {
    if (seen.has(i.link)) return false;
    seen.add(i.link); return true;
  }).slice(0, 12);

  res.status(200).json({ results });
}
