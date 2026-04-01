import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { credential } from "firebase-admin";

if (!getApps().length) {
  initializeApp({ credential: credential.applicationDefault() });
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { messages, skinType, userName, analysisHistory, userId } = req.body;
    const cleanMessages = (messages || []).filter(
      (m) => m && m.role && m.content && m.content.trim() !== ""
    );
    if (cleanMessages.length === 0) return res.status(400).json({ error: "No valid messages" });

    // Check message limit for free users
    if (userId) {
      const db = getFirestore();
      const today = new Date().toISOString().slice(0, 10);
      const userRef = db.collection("users").doc(userId);
      const userDoc = await userRef.get();
      const userData = userDoc.data() || {};
      const isPro = userData.isPro || false;

      if (!isPro) {
        const dailyCount = userData.dailyMessages?.date === today ? userData.dailyMessages.count : 0;
        if (dailyCount >= 10) {
          return res.status(429).json({ error: "Daily limit reached", limitReached: true });
        }
        await userRef.update({
          dailyMessages: { date: today, count: dailyCount + 1 }
        });
      }
    }

    const analysisContext = analysisHistory && analysisHistory.length > 0
      ? `\n\nUSER'S SKIN ANALYSIS HISTORY:\n${analysisHistory.map(a => `- ${a.date.slice(0,10)}: ${a.result} skin, score ${a.score}/100, concerns: ${a.concerns.join(', ')}`).join('\n')}`
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
${skinType ? `\nUSER'S SKIN TYPE: ${skinType}` : ""}
${userName ? `USER'S NAME: ${userName}` : ""}${analysisContext}`;

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
      } catch (e) { products = []; }
    }
    return res.status(200).json({ reply, products });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
