export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { imageBase64, mediaType, additionalImages } = req.body;
    if (!imageBase64) return res.status(400).json({ error: "No image provided" });

    const imageContent = [
      { type: "image", source: { type: "base64", media_type: mediaType || "image/jpeg", data: imageBase64 } }
    ];

    if (additionalImages && additionalImages.length > 0) {
      additionalImages.forEach(img => {
        imageContent.push({ type: "image", source: { type: "base64", media_type: img.mediaType || "image/jpeg", data: img.base64 } });
      });
    }

    const zoneCount = 1 + (additionalImages?.length || 0);
    const zoneNames = ["forehead", "left cheek", "right cheek", "nose", "chin"].slice(0, zoneCount);

    imageContent.push({
      type: "text",
      text: `You are an expert dermatologist AI performing a detailed multi-zone skin analysis. I'm providing ${zoneCount} photo(s) of different facial zones: ${zoneNames.join(", ")}.

Analyze all photos carefully and provide a comprehensive skin assessment. Consider:
- Hydration levels and moisture balance
- Oil production and sebum distribution
- Pore size and visibility
- Skin texture and smoothness
- Any visible concerns (acne, redness, pigmentation, fine lines)
- Overall skin health

Respond ONLY with a valid JSON object in this exact format, no other text:
{
  "skinType": "Normal|Dry|Oily|Combination|Sensitive",
  "score": <number 0-100 reflecting overall skin health>,
  "concerns": ["specific concern 1", "specific concern 2", "specific concern 3"],
  "characteristics": ["characteristic 1", "characteristic 2", "characteristic 3"],
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"],
  "summary": "2-3 sentence warm, friendly summary of the skin analysis results"
}

Be accurate, specific and helpful. Only return the JSON, nothing else.`
    });

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
        messages: [{ role: "user", content: imageContent }]
      }),
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: "AI error", details: data });
    const text = data.content[0].text.trim().replace(/```json|```/g, "").trim();
    const result = JSON.parse(text);
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
