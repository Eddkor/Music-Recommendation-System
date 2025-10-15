import { GoogleGenAI, Type } from "@google/genai";
import { Playlist, RefineCategory } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MOCK_USER_PROFILE = `
  - Primarily listens to Indie Pop, Synth-pop, and Alternative R&B.
  - Favorite artists include The 1975, LANY, Glass Animals, Frank Ocean, and Tame Impala.
  - Often listens to upbeat music (110-130 BPM) during weekday afternoons.
  - Prefers chill, atmospheric music (80-100 BPM) in the evenings.
  - Recently has been listening to trending tracks on TikTok.
  - Values melodic complexity and unique instrumental textures.
`;

const RESPONSE_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    playlistName: {
      type: Type.STRING,
      description: "A creative and fitting name for the playlist."
    },
    description: {
      type: Type.STRING,
      description: "A brief, one-sentence description of the playlist's vibe."
    },
    songs: {
      type: Type.ARRAY,
      description: "A list of 10 songs for the playlist.",
      items: {
        type: Type.OBJECT,
        properties: {
          songTitle: { type: Type.STRING },
          artist: { type: Type.STRING },
          year: {
            type: Type.INTEGER,
            description: "The year the song was released."
          },
        },
        required: ["songTitle", "artist", "year"],
      },
    },
  },
  required: ["playlistName", "description", "songs"],
};

const generatePrompt = (category?: RefineCategory): string => {
  const basePrompt = `
    You are a highly sophisticated music recommendation AI, similar to Spotify's discovery engine.
    Your task is to create a personalized playlist of 10 songs based on a user's listening profile.
    All recommended songs MUST have been released in the last 10 years (from ${new Date().getFullYear() - 10} to ${new Date().getFullYear()}).
    Do not include songs older than that.
    
    USER PROFILE:
    ${MOCK_USER_PROFILE}
  `;

  switch (category) {
    case RefineCategory.Genre:
      return `${basePrompt}\nINSTRUCTION: Create a playlist that dives deep into a specific genre the user might like, such as 'Dream Pop' or 'Neo-Psychedelia', based on their profile. Name it something creative related to the genre.`;
    case RefineCategory.Mood:
      const now = new Date();
      const hour = now.getHours();
      const mood = (hour > 8 && hour < 18) ? 'Uplifting Afternoon' : 'Late Night Drive';
      return `${basePrompt}\nINSTRUCTION: Create a playlist that perfectly matches a '${mood}' mood. The vibe should be cohesive.`;
    case RefineCategory.Artist:
      return `${basePrompt}\nINSTRUCTION: Create a playlist of songs by artists similar to the user's favorites. The playlist should be titled something like 'If You Like [Artist], You'll Love This'.`;
    case RefineCategory.Trend:
      return `${basePrompt}\nINSTRUCTION: Create a playlist based on current viral music trends that align with the user's taste. Call it 'Viral Hits: Tuned For You'.`;
    default:
      // Main "For You" playlist
      const day = new Date().toLocaleString('en-us', { weekday: 'long' });
      return `${basePrompt}\nINSTRUCTION: Create a primary, personalized 'Daily Mix' playlist for the user for a ${day} afternoon. It should be a balanced mix reflecting their core tastes.`;
  }
};

const getAIPlaylist = async (category?: RefineCategory): Promise<Playlist> => {
    try {
        const prompt = generatePrompt(category);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: RESPONSE_SCHEMA,
                temperature: 0.8,
            },
        });
        
        const jsonText = response.text.trim();
        const playlistData = JSON.parse(jsonText);

        // Basic validation
        if (!playlistData.playlistName || !playlistData.songs || !Array.isArray(playlistData.songs)) {
            throw new Error("Invalid playlist data structure from API.");
        }

        return playlistData as Playlist;

    } catch (error) {
        console.error("Error fetching AI playlist:", error);
        // Fallback playlist in case of API error
        return {
            playlistName: "Error: Could Not Generate",
            description: "There was an issue contacting the AI. Please check your API key and try again.",
            songs: [
                { songTitle: "API Connection Failed", artist: "System", year: 2024 },
            ],
        };
    }
};

export const getForYouPlaylist = (): Promise<Playlist> => {
    return getAIPlaylist();
};

export const getRefinedPlaylist = (category: RefineCategory): Promise<Playlist> => {
    return getAIPlaylist(category);
};