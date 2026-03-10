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
    const system = "You are Sora, a warm skincare advisor for HadaPod. Give evidence-based skincare advice in a friendly luxury tone." + (skinType ? " User skin type: " + skinType + "." : "") + (userName ? " User name: " + userName + "." : "");
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
