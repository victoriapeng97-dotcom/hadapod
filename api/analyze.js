export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const { imageBase64, mediaType, additionalImages, skinContext } = req.body;
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
    const zoneNames = ["forehead", "nose & T-zone", "left cheek", "right cheek", "chin"].slice(0, zoneCount);

    const contextSection = skinContext ? `
IMPORTANT USER CONTEXT (use this to inform and calibrate your analysis):
- Age range: ${skinContext.age || "not provided"}
- Self-reported concerns: ${skinContext.concerns?.join(", ") || "none specified"}
- Climate/environment: ${skinContext.climate || "not provided"}
- Recent skin changes: ${skinContext.recentChanges || "none reported"}
- Current products: ${skinContext.currentProducts || "none specified"}

Use this context to:
1. Calibrate your visual assessment (e.g. if user reports dryness, look more carefully for dehydration signs)
2. Provide more targeted recommendations
3. Explain how their environment/lifestyle may be contributing to what you see
` : "";

    imageContent.push({
      type: "text",
      text: `You are an expert dermatologist and cosmetic scientist with 20 years of clinical experience performing a detailed multi-zone facial skin analysis.

I am providing ${zoneCount} photo(s) of facial zones: ${zoneNames.join(", ")}.
${contextSection}
Analyze each zone carefully and assess ALL of the following:

HYDRATION & MOISTURE:
- Signs of dehydration (dull, tight, flaky skin)
- Moisture levels (plump vs flat skin texture)
- Trans-epidermal water loss indicators

OIL & SEBUM:
- Shine levels and sebum distribution
- Congested or enlarged pores
- Blackheads or whiteheads
- T-zone vs cheek oil balance

TEXTURE & TONE:
- Skin smoothness or roughness
- Visible pores and their size
- Fine lines or deeper wrinkles
- Skin laxity or firmness
- Uneven texture or bumps

PIGMENTATION:
- Dark spots or hyperpigmentation
- Sun damage or age spots
- Post-inflammatory hyperpigmentation
- Overall skin tone evenness

SENSITIVITY & INFLAMMATION:
- Redness or flushing
- Visible capillaries or rosacea signs
- Acne lesions (comedones, papules, pustules, cysts)
- Inflammatory response patterns

BARRIER HEALTH:
- Signs of compromised skin barrier
- Sensitivity indicators

Based on your thorough analysis, determine:
1. Primary skin type (Normal/Dry/Oily/Combination/Sensitive)
2. An accurate health score (0-100)
3. Be CONSISTENT and SPECIFIC - focus on what you can actually see in the photos

Respond ONLY with a valid JSON object, no other text:
{
  "skinType": "Normal|Dry|Oily|Combination|Sensitive",
  "score": <number 0-100>,
  "concerns": ["specific visible concern 1", "specific visible concern 2", "specific visible concern 3"],
  "characteristics": ["specific characteristic 1", "specific characteristic 2", "specific characteristic 3"],
  "zoneAnalysis": {
    "forehead": "brief analysis",
    "tzone": "brief analysis",
    "cheeks": "brief analysis",
    "chin": "brief analysis"
  },
  "recommendations": ["specific recommendation 1", "specific recommendation 2", "specific recommendation 3"],
  "keyIngredients": ["ingredient and why 1", "ingredient and why 2", "ingredient and why 3"],
  "summary": "2-3 sentence warm, specific summary addressing both what was seen AND the user context"
}`
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
        max_tokens: 2048,
        temperature: 0.2,
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
