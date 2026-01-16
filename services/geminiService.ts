
import { GoogleGenAI, Type, HarmCategory, HarmBlockThreshold } from "@google/genai";

const getAIClient = () => {
  return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// Global state for rate limiting
let globalCooldownUntil = 0;
const imageCache: Record<string, string> = {};

export const isGlobalRateLimited = () => Date.now() < globalCooldownUntil;

const retryWrapper = async <T>(fn: () => Promise<T>, maxRetries = 3): Promise<T | null> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      if (isGlobalRateLimited()) return null;
      return await fn();
    } catch (error: any) {
      const status = error?.status || error?.error?.code;
      if (status === 429) {
        console.warn("[Neon AI] Quota exceeded.");
        globalCooldownUntil = Date.now() + 60000;
        return null;
      }
      attempt++;
      await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
    }
  }
  return null;
};

const summaryCache: Record<string, string> = {};

export const getShortAiSummary = async (title: string, id: string) => {
  if (summaryCache[id]) return summaryCache[id];
  if (isGlobalRateLimited()) return null;

  return await retryWrapper(async () => {
    const ai = getAIClient();
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a 1-sentence, high-energy mystery hook for the anime: ${title}. Keep it under 15 words.`,
      config: { temperature: 0.8 }
    });
    
    const summary = response.text?.trim() || null;
    if (summary) summaryCache[id] = summary;
    return summary;
  });
};

/**
 * Fetches accurate anime details including SEQUELS, PREQUELS, and PARTS using AniList GraphQL API.
 * Uses nested queries to discover the entire franchise timeline.
 */
export const fetchAnimeDetails = async (title: string) => {
  const ANILIST_API_URL = 'https://graphql.anilist.co';

  // Nested GraphQL Query to get Franchise Depth (Main -> Relations -> Relations -> Relations)
  const query = `
  query ($search: String) {
    Media (search: $search, type: ANIME, sort: SEARCH_MATCH) {
      id
      title {
        english
        romaji
      }
      description
      coverImage {
        extraLarge
        large
      }
      averageScore
      studios(isMain: true) {
        nodes {
          name
        }
      }
      startDate {
        year
        month
        day
      }
      episodes
      format
      relations {
        edges {
          relationType
          node {
            id
            title { english romaji }
            format
            startDate { year month day }
            episodes
            relations {
                edges {
                    relationType
                    node {
                        id
                        title { english romaji }
                        format
                        startDate { year month day }
                        episodes
                        relations {
                             edges {
                                relationType
                                node {
                                    id
                                    title { english romaji }
                                    format
                                    startDate { year month day }
                                    episodes
                                }
                             }
                        }
                    }
                }
            }
          }
        }
      }
    }
  }
  `;

  const variables = { search: title };

  try {
      if (isGlobalRateLimited()) return null;

      const response = await fetch(ANILIST_API_URL, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
          },
          body: JSON.stringify({ query, variables })
      });

      if (response.status === 429) {
          console.warn("AniList Rate Limit Hit - Cooling down.");
          globalCooldownUntil = Date.now() + 60000;
          return null;
      }

      const json = await response.json();
      const media = json.data?.Media;

      if (!media) return null;

      // --- 1. Flatten the Nested Relations Tree ---
      const seasonMap = new Map<number, any>();
      
      const processNode = (node: any) => {
          if (!node) return;
          if (seasonMap.has(node.id)) return;
          
          // Only include TV, MOVIE, OVA, ONA (Ignore Manga/Music)
          if (!['TV', 'MOVIE', 'OVA', 'ONA', 'TV_SHORT'].includes(node.format)) return;

          const dateStr = node.startDate?.year ? 
              `${node.startDate.year}-${String(node.startDate.month || 1).padStart(2, '0')}-${String(node.startDate.day || 1).padStart(2, '0')}` 
              : '9999-99-99'; // Sort unknowns to end

          seasonMap.set(node.id, {
              id: node.id,
              title: node.title.english || node.title.romaji,
              dateObj: new Date(dateStr === '9999-99-99' ? '9999-01-01' : dateStr),
              releaseDate: dateStr === '9999-99-99' ? 'TBA' : dateStr,
              episodes: node.episodes || 0
          });

          // Recurse into relations
          if (node.relations?.edges) {
              node.relations.edges.forEach((edge: any) => {
                  // Follow the timeline: Sequels, Prequels, Side Stories (for movies/OVAs), Parents
                  if (['SEQUEL', 'PREQUEL', 'PARENT', 'SIDE_STORY', 'ALTERNATIVE'].includes(edge.relationType)) {
                      processNode(edge.node);
                  }
              });
          }
      };

      // Start processing from the main search result
      processNode(media);

      // --- 2. Convert Map to Array & Sort ---
      let allSeasons = Array.from(seasonMap.values());
      
      // Strict sorting by Release Date
      allSeasons.sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

      // --- 3. Filter for Relevance & Sum Episodes ---
      
      // Calculate Total Franchise Episodes
      const totalEpisodesSum = allSeasons.reduce((sum, s) => sum + (s.episodes || 0), 0);

      // Map to UI Structure
      const seasonsDetails = allSeasons.map((s, index) => ({
          title: s.title,
          releaseDate: s.releaseDate,
          episodes: s.episodes,
          seasonNumber: index + 1 // Simply ordered 1..N based on release date
      }));

      // --- 4. Prepare Main Data ---
      const cleanSynopsis = media.description ? media.description.replace(/<[^>]*>?/gm, '') : "No synopsis available.";
      const studio = media.studios?.nodes?.[0]?.name || "Unknown Studio";
      const releaseDate = media.startDate?.year ? `${media.startDate.year}-${media.startDate.month || '01'}-${media.startDate.day || '01'}` : 'Unknown';
      const rating = media.averageScore ? (media.averageScore / 10).toFixed(2) : 0;

      return {
          synopsis: cleanSynopsis,
          studio: studio,
          releaseDate: releaseDate,
          malRating: Number(rating),
          posterUrl: media.coverImage.extraLarge || media.coverImage.large,
          totalSeasons: seasonsDetails.length,
          seasonsDetails: seasonsDetails, 
          totalEpisodes: totalEpisodesSum, // Sum of ALL seasons
          insight: `Ranked Top ${rating}/10 on AniList database.`,
          storyReview: `Epic saga spanning ${seasonsDetails.length} parts and ${totalEpisodesSum} episodes.`
      };

  } catch (error: any) {
      if (error.name === 'TypeError' && error.message === 'Failed to fetch') {
          // Silent warning for network block (common with AdBlockers blocking graphql)
          console.warn("[AniList API] Network blocked (AdBlocker/Offline) - skipping enrichment.");
          return null;
      }
      console.error("[AniList API] Error:", error);
      return null;
  }
};

const SAFE_GENRE_MAPPING: Record<string, string> = {
  'Ecchi': 'Glamorous Anime Fashion',
  'Military': 'Futuristic Strategist',
  'Horror': 'Dark Fantasy Atmosphere',
  'Thriller': 'Noir Mystery',
  'Harem': 'Anime Group Cast',
  'Seinen': 'Cinematic City Life',
  'Psychological': 'Abstract Anime Art'
};

export const generateGenreImage = async (genre: string, prompt: string) => {
  if (imageCache[genre]) return imageCache[genre];
  if (isGlobalRateLimited()) return null;

  const ai = getAIClient();
  const config = {
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ]
  };

  try {
      return await retryWrapper(async () => {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: { parts: [{ text: `Generate a high quality, anime-style image: ${prompt}` }] },
            config: config
        });
        const part = response.candidates?.[0]?.content?.parts?.[0];
        if (part?.inlineData) {
            const url = `data:image/png;base64,${part.inlineData.data}`;
            imageCache[genre] = url;
            return url;
        }
        return null;
      });
  } catch (error) {
      return null;
  }
};

export const chatWithCharacter = async (
  systemInstruction: string,
  history: { role: 'user' | 'model', text: string }[],
  message: string
) => {
  if (isGlobalRateLimited()) return "System cooldown active.";

  const ai = getAIClient();
  try {
     const formattedHistory = history.map(h => ({
         role: h.role,
         parts: [{ text: h.text }]
     }));
     const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: { systemInstruction, maxOutputTokens: 150 },
        history: formattedHistory
     });
     const result = await chat.sendMessage({ message });
     return result.text;
  } catch (e: any) {
     return "Connection interrupted.";
  }
};
