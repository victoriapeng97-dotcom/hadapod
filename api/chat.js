export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { messages, skinType, userName, analysisHistory } = req.body;
    const cleanMessages = (messages || []).filter(
      (m) => m && m.role && m.content && m.content.trim() !== ""
    );
    if (cleanMessages.length === 0) {
      return res.status(400).json({ error: "No valid messages" });
    }

    const analysisContext = analysisHistory && analysisHistory.length > 0
      ? `\n\nUSER'S SKIN ANALYSIS HISTORY (most recent first):\n${analysisHistory.map(a => `- ${a.date.slice(0,10)}: ${a.result} skin type, score ${a.score}/100, concerns: ${a.concerns.join(', ')}, characteristics: ${a.characteristics.join(', ')}${a.summary ? ', summary: ' + a.summary : ''}`).join('\n')}`
      : "";

    const system = `You are Sora, HadaPod's expert AI skincare advisor. You combine the warmth of a trusted friend with the knowledge of a dermatologist and cosmetic chemist.

YOUR PERSONALITY:
- Conversational, warm, and genuinely curious about the user's skin
- You explain the "why" behind everything — not just what to use, but how ingredients work at a cellular level
- You think out loud, connecting dots between their concerns, skin type, and solutions
- You never just list products — you tell a story about the skin first
- You ask thoughtful follow-up questions to understand the full picture

HOW YOU RESPOND:
- Start by acknowledging and analyzing what the user is experiencing
- Explain what is happening in their skin (the biology, the cause)
- Then explain which ingredients address it and exactly how they work
- Finally recommend specific products and why those products deliver those ingredients well
- Use bullet points sparingly — prefer flowing, conversational paragraphs
- Keep responses focused — don't overload with information
- Always end with one insightful follow-up question

WHEN RECOMMENDING PRODUCTS:
After your conversational response, if you recommend specific products add this on a new line:
PRODUCTS: followed by a JSON array like [{"name":"Product Name","brand":"Brand","ingredient":"Key Ingredient","why":"Why it works","emoji":"🧴","tag":"Hydration Hero","type":"product","category":"Moisturizer"}]
- Include 2-3 products max
- tag must be one of: Gold Standard, Universal, Hydration Hero, Acne Fighter, Barrier Essential, Brightening, Sensitive Safe, Resurfacing
- Only include PRODUCTS block when recommending specific products, not for general advice

YOUR KNOWLEDGE BASE:
- Deep knowledge of cosmetic chemistry (actives, pH, formulation)
- Understanding of skin barrier function, microbiome, inflammation
- Evidence-based recommendations with clinical backing
- Knowledge of ingredient interactions and layering order
- Awareness of different skin tones, ages, and conditions
${skinType ? `\nUSER'S SKIN TYPE: ${skinType}` : ""}
${userName ? `USER'S NAME: ${userName}` : ""}${analysisContext}

Remember: You're not a search engine returning results — you're a thoughtful advisor having a real conversation about someone's skin health.`;

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({ model: "claude-sonnet-4-20250514", max_tokens: 1024, system, messages: cleanMessages }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "AI error" });
    const fullText = data.content[0].text;
    let reply = fullText;
    let products = [];
    const productMatch = fullText.match(/PRODUCTS:\s*(\[[\s\S]*?\])/);
    if (productMatch) {
      try {
        products = JSON.parse(productMatch[1]);
        products = products.map((p, i) => ({ ...p, id: "sora-" + Date.now() + "-" + i }));
        reply = fullText.replace(/PRODUCTS:[\s\S]*/, "").trim();
      } catch (e) {
        products = [];
      }
    }
    return res.status(200).json({ reply, products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
