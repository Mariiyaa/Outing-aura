require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { getJson } = require("serpapi");
const { GoogleGenAI } = require("@google/genai");
const VibeCache = require("./models/VibeCache");

const app = express();
app.use(cors());
app.use(express.json());
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

mongoose
  .connect(process.env.MONGO_URI, { serverSelectionTimeoutMS: 5000 })
  .then(() => console.log(" MongoDB Connected Successfully!"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));


  function parseSafeJSON(rawText) {
  try {
    let clean = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
    const start = clean.indexOf("{");
    const end = clean.lastIndexOf("}");
    if (start !== -1 && end !== -1) {
      clean = clean.substring(start, end + 1);
    }
    return JSON.parse(clean);
  } catch (err) {
    console.error(" Raw AI text that failed parsing:\n", rawText);
    throw new Error("AI returned malformed JSON structure.");
  }
}

app.post("/api/vibe-search", async (req, res) => {
  try {
    const { userPrompt, location, forceRefresh = false } = req.body;
    const cacheKey = `${userPrompt}_${location}`
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "_");

    if (!forceRefresh) {
      const cached = await VibeCache.findOne({ queryKey: cacheKey });
      if (cached) {
        console.log("Serving from MongoDB Cache...");
        return res.json({
          success: true,
          source: "cache",
          places: cached.placesData,
          vibeAnalysis: cached.aiVibeSummary,
        });
      }
    }

    console.log("Fetching fresh data from SerpApi Dual-Engines & Gemini...");

    const [mapsResult, imagesResult] = await Promise.all([
      getJson({
        engine: "google_maps",
        q: `${userPrompt} in ${location}`,
        api_key: process.env.SERPAPI_API_KEY,
      }),
      getJson({
        engine: "google_images",
        q: `${userPrompt} ${location} aesthetic interior lighting vibe`,
        api_key: process.env.SERPAPI_API_KEY,
      }),
    ]);

    const rawPlaces = mapsResult.local_results || [];
    const topPlaces = rawPlaces.slice(0, 4).map((p) => ({
      title: p.title,
      rating: p.rating,
      reviews: p.reviews,
      type: p.type,
      address: p.address,
      thumbnail: p.thumbnail,
      link:
        p.links?.website ||
        (p.gps_coordinates
          ? `https://www.google.com/maps/place/?q=place_id:${p.place_id}`
          : null),
    }));

    const visualSnippets =
      imagesResult?.images_results?.slice(0, 4).map((img) => ({
        title: img.title,
        source: img.source,
      })) || [];

    const prompt = `
      User Query: "${userPrompt}" in "${location}".
      Live Places Found (via SerpApi Maps): ${JSON.stringify(topPlaces)}.
      Visual Aesthetic Context (via SerpApi Images Engine): ${JSON.stringify(visualSnippets)}.
      ${forceRefresh ? "NOTE: User requested a FRESH RE-ANALYSIS. Provide a slightly fresh perspective/itinerary angle." : ""}

      CRITICAL LANGUAGE RULE: 
      - Automatically detect the primary language/script/dialect of the User Query (e.g. Hinglish, Hindi, English, Gujarati, Spanish, etc.).
      - Write ALL output text ("vibeTagline", "vibeReason", "outfitRecommendation", and "itinerary" steps) STRICTLY in that SAME language and tone!

      Tasks:
      1. Rate overall Vibe Match Score (1 to 10).
      2. Write a 2-sentence vibe description for each place explaining why it fits the request.
      3. Provide an "outfitRecommendation" (e.g. style, color palette, or vibe matching clothing tip like 'Pastel linens or cozy oversized sweaters') based directly on the SerpApi visual aesthetic context.
      4. Suggest a 3-step timeline itinerary.
      
      Respond STRICTLY in JSON format:
      {
        "vibeScore": 9,
        "vibeTagline": "...",
        "placeVibes": [{"title": "...", "vibeReason": "...", "outfitRecommendation": "..."}],
        "itinerary": ["4:00 PM - ...", "6:00 PM - ...", "8:00 PM - ..."]
      }
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });

    const vibeAnalysis = parseSafeJSON(aiResponse.text);

    await VibeCache.findOneAndUpdate(
      { queryKey: cacheKey },
      {
        queryKey: cacheKey,
        placesData: topPlaces,
        aiVibeSummary: vibeAnalysis,
        createdAt: new Date(),
      },
      { upsert: true, returnDocument: "after" },
    );

    res.json({
      success: true,
      source: "live_serpapi_dual_engines",
      places: topPlaces,
      vibeAnalysis: vibeAnalysis,
    });
  } catch (error) {
    console.error("ERROR IN SEARCH ROUTE:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/place-specialty", async (req, res) => {
  try {
    const { placeTitle, location } = req.body;

    console.log(`🔍 Decoding Specialty & Community Photos for: ${placeTitle}`);

    const [searchResult, imagesResult] = await Promise.all([
      getJson({
        engine: "google",
        q: `${placeTitle} ${location} why famous specialty highlights reviews`,
        api_key: process.env.SERPAPI_API_KEY,
      }),
      // ✨ FIX: Simplified query for guaranteed image results
      getJson({
        engine: "google_images",
        q: `${placeTitle} ${location} food vibe aesthetic`,
        api_key: process.env.SERPAPI_API_KEY,
      }),
    ]);

    const organicSnippets =
      searchResult?.organic_results?.slice(0, 4).map((r) => r.snippet) || [];

    // Fallback protection for communityImages
    const rawImages = imagesResult?.images_results || [];
    const communityImages = rawImages.slice(0, 6).map((img) => ({
      thumbnail: img.thumbnail || img.original,
      original: img.original,
      title: img.title,
      source: img.source,
      link: img.link || img.original,
    }));

    console.log(
      `✅ Fetched ${organicSnippets.length} snippets & ${communityImages.length} community images.`,
    );

    const prompt = `
      Place: "${placeTitle}" in "${location}".
      Search Context Snippets: ${JSON.stringify(organicSnippets)}.

      CRITICAL LANGUAGE RULE: 
      - Automatically detect the primary language/script/dialect of the User Query (e.g. Hinglish, Hindi, English, Gujarati, Spanish, etc.).
      - Write ALL output text ("vibeTagline", "vibeReason", "outfitRecommendation", and "itinerary" steps) STRICTLY in that SAME language and tone!

      Task:
      1. Explain in 2 catchy bullet points why this place is famous (specialty dish, architecture, view, or vibe highlight).
      2. Provide a 1-sentence "Pro-Tip for Visitors".

      Respond STRICTLY in valid JSON format:
      {
        "specialtyTitle": "Why People Love This Spot",
        "highlights": ["...", "..."],
        "proTip": "..."
      }
    `;

    const aiResponse = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: prompt,
    });
    const specialtyAnalysis = parseSafeJSON(aiResponse.text);

    res.json({
      success: true,
      placeTitle,
      analysis: specialtyAnalysis,
      communityImages,
    });
  } catch (error) {
    console.error("ERROR IN SPECIALTY ROUTE:", error);
    res.status(500).json({ success: false, error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`server running on ${PORT}`);
});
