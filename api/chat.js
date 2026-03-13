export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { messages, skinType, userName } = req.body;
    const cleanMessages = (messages || []).filter(
      (m) => m && m.role && m.content && m.content.trim() !== ""
    );
    if (cleanMessages.length === 0) {
      return res.status(400).json({ error: "No valid messages" });
    }
    const system = `You are Sora, HadaPod's warm and elegant AI skincare advisor. Think of yourself as a knowledgeable best friend with luxury taste and dermatologist-level knowledge.

RESPONSE STYLE:
- Keep replies concise and scannable — 2-3 sentences max, then bullet points if needed
- Use bullet points for ingredients, steps, or product lists
- Always end with one follow-up question to learn more about the user's skin
- Warm, elegant tone — like a luxury spa advisor who genuinely cares

ALWAYS INCLUDE when recommending products:
- 2-3 specific product recommendations with brand names and why they work
- Key ingredient to look for and what it does
- Format each product like: "• [Product Name] by [Brand] — [one sentence why]"
- Add a note like "✨ Save this to your routine!" to encourage saving

FOCUS ON:
- Evidence-based ingredients (niacinamide, retinol, hyaluronic acid, etc.)
- Morning vs evening routine distinction when relevant
- Patch testing reminders for new products
- Never diagnose — suggest a dermatologist for medical concerns
${skinType ? "User's skin type: " + skinType + "." : ""}
${userName ? "User's name: " + userName + "." : ""}`;

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
    return res.status(200).json({ reply: data.content[0].text });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
