const LANGFLOW_API_KEY = process.env.LANGFLOW_API_KEY!;

// Flow 1 & 2: Moderation via /api/v1/run/ (synchronous)
// Flow uses Chat Input → Smart Router (Gemini) → Chat Output
// Input: plain text "Judul Tugas: ...\nDeskripsi Tugas: ..."
// Smart Router routes to "Safe" or "Violated" output → Chat Output returns the label
export async function callLangflowModerate(taskData: {
  title: string;
  note: string;
  category: string;
  user_id?: string;
}): Promise<{ safe: boolean; reason?: string }> {
  const url = process.env.LANGFLOW_FLOW_1_2_MODERATE_URL!;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000); // 60s for LLM
  let res: Response;
  try {
    res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': LANGFLOW_API_KEY,
      },
      body: JSON.stringify({
        input_value: `Judul Tugas: ${taskData.title}\nDeskripsi Tugas: ${taskData.note} (Kategori: ${taskData.category})`,
        input_type: 'chat',
        output_type: 'chat',
        tweaks: {},
      }),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeout);
  }

  if (!res.ok) throw new Error(`Langflow moderation error: ${res.statusText}`);
  const data = await res.json();

  console.log('[Langflow] Moderation raw response:', JSON.stringify(data));

  // Extract text from Chat Output via /run/ response shape
  const output: string =
    data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ??
    data?.outputs?.[0]?.outputs?.[0]?.messages?.[0]?.message ??
    data?.result ??
    data?.message ??
    JSON.stringify(data);

  console.log('[Langflow] Moderation output text:', output);

  const lower = output.toLowerCase();
  const safe = !lower.includes('violated') &&
               !lower.includes('violation') &&
               !lower.includes('inappropriate') &&
               !lower.includes('melanggar') &&
               !lower.includes('ditolak') &&
               !lower.includes('tidak aman') &&
               !lower.includes('unsafe');

  return { safe, reason: output };
}

export async function callLangflowRecommend(query: string): Promise<unknown[]> {
  const url = process.env.LANGFLOW_FLOW_3_RECOMMEND_URL!;
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': LANGFLOW_API_KEY,
    },
    body: JSON.stringify({
      input_value: query,
      input_type: 'chat',
      output_type: 'chat',
    }),
  });
  if (!res.ok) throw new Error(`Langflow recommend error: ${res.statusText}`);
  const data = await res.json();
  const output: string =
    data?.outputs?.[0]?.outputs?.[0]?.results?.message?.text ?? '[]';
  try {
    return JSON.parse(output);
  } catch {
    return [];
  }
}
