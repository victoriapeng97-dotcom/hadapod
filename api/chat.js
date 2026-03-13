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
    const system = "You are Sora, HadaPod's warm elegant AI skincare advisor. Keep replies concise — 2-3 sentences then bullets if needed. Always end with a follow-up question. IMPORTANT: When recommending products, after your text reply add exactly this format on a new line: PRODUCTS: followed by a JSON array like [{\"name\":\"CeraVe Moisturizer\",\"brand\":\"CeraVe\",\"ingredient\":\"Ceramides\",\"why\":\"Repairs skin barrier\",\"emoji\":\"🧴\",\"tag\":\"Hydration Hero\",\"type\":\"product\",\"category\":\"Moisturizer\"}]. Include 2-3 products. Tag must be one of: Gold Standard, Universal, Hydration Hero, Acne Fighter, Barrier Essential, Brightening, Sensitive Safe, Resurfacing." + (skinType ? " User skin type: " + skinType + "." : "") + (userName ? " User name: " + userName + "." : "");
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
