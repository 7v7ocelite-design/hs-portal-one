import Anthropic from "@anthropic-ai/sdk";

// Initialize Anthropic client
export const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

// Extract coaching staff from HTML using Claude
export async function extractCoachesFromHTML(
  html: string,
  schoolName: string
): Promise<ExtractedCoach[]> {
  const response = await anthropic.messages.create({
    model: "claude-sonnet-4-20250514",
    max_tokens: 4096,
    messages: [
      {
        role: "user",
        content: `Extract the football coaching staff from this HTML page for ${schoolName}.

Return a JSON array of coaches with this structure:
[
  {
    "first_name": "John",
    "last_name": "Smith",
    "title": "Head Coach",
    "position_group": "head" | "offense" | "defense" | "special_teams" | "support",
    "is_recruiting_coordinator": boolean
  }
]

Only include football coaches. Ignore other sports staff.
If you can't find coaching staff, return an empty array [].

HTML content:
${html.slice(0, 50000)}`,
      },
    ],
  });

  try {
    const text =
      response.content[0].type === "text" ? response.content[0].text : "";
    // Extract JSON from response (handle markdown code blocks)
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return [];
  } catch {
    console.error("Failed to parse Claude response");
    return [];
  }
}

export interface ExtractedCoach {
  first_name: string;
  last_name: string;
  title: string;
  position_group?: "head" | "offense" | "defense" | "special_teams" | "support";
  is_recruiting_coordinator?: boolean;
}
