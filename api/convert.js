export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { text } = req.body;

  const SYSTEM_PROMPT = `Tugas kau hanya satu: tukar senarai nama player yang ada singkatan kategori kepada senarai penuh kategori.
Jangan buat ayat lain. Jangan tambah info lain. Jangan ubah susunan. Hanya output list sahaja, tiada preamble, tiada explanation.

Kategori:
S = SHWTIME
NE = NEW EPIC
E = EPIC
B = BIGTIME
M = MANAGER
N = NOSTALGIA
OE = OLD EPIC
BL = BLUELOCK
TS = TSUBASA
P = PACK

Format Wajib:
KATEGORI_PENUH + SPACE + NAMA_PLAYER (uppercase)

Penting:
- Ignore semua benda lain dalam input (email, nombor telefon, rm, silog, nama buyer dll)
- Hanya extract nama player dengan kategori je
- Output satu player satu baris
- Semua uppercase`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 2000,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: text }]
      })
    });

    const data = await response.json();
    res.status(200).json({ result: data.content[0].text.trim() });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
