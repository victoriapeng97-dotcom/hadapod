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
    const zoneNames = ["forehead", "nose & T-zone", "left cheek", "right cheek", "chin"].slice(0, zoneCount);

    imageContent.push({
      type: "text",
      text: `You are an expert dermatologist and cosmetic scientist with 20 years of clinical experience. You are performing a detailed multi-zone facial skin analysis.

I am providing ${zoneCount} photo(s) of facial zones: ${zoneNames.join(", ")}.

Analyze each zone carefully and look for ALL of the following:

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
- Melasma patterns
- Overall skin tone evenness

SENSITIVITY & INFLAMMATION:
- Redness or flushing
- Visible capillaries or rosacea signs
- Irritation or reactive skin patterns
- Acne lesions (comedones, papules, pustules, cysts)
- Inflammatory response patterns

BARRIER HEALTH:
- Signs of compromised skin barrier
- Sensitivity indicators
- Eczema or dermatitis signs

Based on your thorough analysis, determine:
1. Primary skin type (Normal/Dry/Oily/Combination/Sensitive)
2. An accurate health score (0-100) where:
   - 85-100: Excellent skin health, minimal concerns
   - 70-84: Good skin health, minor concerns
   - 55-69: Moderate concerns needing attention
   - 40-54: Multiple concerns, needs targeted care
   - Below 40: Significant concerns, recommend dermatologist

Respond ONLY with a valid JSON object, no other text:
{
  "skinType": "Normal|Dry|Oily|Combination|Sensitive",
  "score": <number 0-100>,
  "concerns": ["specific visible concern 1", "specific visible concern 2", "specific visible concern 3"],
  "characteristics": ["specific characteristic 1", "specific characteristic 2", "specific characteristic 3"],
  "zoneAnalysis": {
    "forehead": "brief analysis of forehead zone",
    "tzone": "brief analysis of nose/T-zone",
    "cheeks": "brief analysis of cheek zones",
    "chin": "brief analysis of chin zone"
  },
  "recommendations": [
    "specific evidence-based recommendation 1",
    "specific evidence-based recommendation 2", 
    "specific evidence-based recommendation 3"
  ],
  "keyIngredients": ["ingredient 1 and why", "ingredient 2 and why", "ingredient 3 and why"],
  "summary": "2-3 sentence warm, specific, clinical summary of findings and overall skin health"
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
