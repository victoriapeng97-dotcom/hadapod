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
      return res.status(400).json({ error: "No valid messages provided" });
    }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1024,
        system: `You are Sora, a warm and knowledgeable AI skincare advisor for HadaPod. You give evidence-based skincare advice in a friendly, luxury tone — like a knowledgeable friend who happens to be a dermatologist.

Key guidelines:
- Always recommend clinically-backed ingredients and products
- Be concise but thorough — 2-4 sentences per point
- Use a warm, elegant tone (think Aesop or Tatcha brand voice)
- If the user has a known skin type, tailor advice to it
- When recommending products, mention specific brands and why
- Always remind users to patch test new products
- Never diagnose medical conditions — suggest seeing a dermatologist for serious concerns
${skinType ? `\nThe user's skin type is: ${skinType}` : ""}
${userName ? `\nThe user's name is: ${userName}` : ""}`,
        messages: messages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({ error: data });
    }

    return res.status(200).json({
      reply: data.content[0].text,
    });
  } catch (error) {
    return res.status(500).json({ error: "Failed to contact Claude API" });
  }
}