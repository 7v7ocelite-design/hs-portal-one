import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => ({}));
  const { url } = body;

  if (!url) {
    return NextResponse.json({ error: "URL required" }, { status: 400 });
  }

  try {
    const result = await validateUrl(url);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { valid: false, error: String(error) },
      { status: 500 }
    );
  }
}

// Validate multiple URLs at once
export async function GET(request: NextRequest) {
  const urls = request.nextUrl.searchParams.get("urls")?.split(",") || [];

  if (urls.length === 0) {
    return NextResponse.json({ error: "No URLs provided" }, { status: 400 });
  }

  const results = await Promise.all(
    urls.map(async (url) => ({
      url: url.trim(),
      ...(await validateUrl(url.trim())),
    }))
  );

  return NextResponse.json({ results });
}

async function validateUrl(url: string): Promise<{
  valid: boolean;
  status?: number;
  title?: string;
  hasCoachContent?: boolean;
  error?: string;
}> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "HSPortalOne/1.0 (URL Validator)",
        Accept: "text/html",
      },
      redirect: "follow",
    });

    if (!response.ok) {
      return {
        valid: false,
        status: response.status,
        error: `HTTP ${response.status}`,
      };
    }

    const html = await response.text();

    // Extract page title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : undefined;

    // Check if page likely contains coaching staff content
    const coachKeywords = [
      "coach",
      "staff",
      "coordinator",
      "head coach",
      "offensive",
      "defensive",
    ];
    const lowerHtml = html.toLowerCase();
    const hasCoachContent = coachKeywords.some((kw) => lowerHtml.includes(kw));

    return {
      valid: true,
      status: response.status,
      title,
      hasCoachContent,
    };
  } catch (error) {
    return {
      valid: false,
      error: String(error),
    };
  }
}
