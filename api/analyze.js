export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { imageBase64, mediaType } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });
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
        messages: [{
          role: "user",
          content: [
            { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } },
            { type: "text", text: "You are an expert dermatologist AI analyzing a skin photo. Respond ONLY with a valid JSON object in this exact format, no other text: {\"skinType\": \"Normal|Dry|Oily|Combination|Sensitive\", \"score\": <number 0-100>, \"concerns\": [\"concern1\", \"concern2\", \"concern3\"], \"characteristics\": [\"characteristic1\", \"characteristic2\", \"characteristic3\"], \"recommendations\": [\"recommendation1\", \"recommendation2\", \"recommendation3\"], \"summary\": \"2-3 sentence friendly summary\"}. Only return the JSON, nothing else." }
          ]
        }]
      }),
    });
    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "AI error" });
    const text = data.content[0].text.trim().replace(/```json|```/g, "").trim();
    const result = JSON.parse(text);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
