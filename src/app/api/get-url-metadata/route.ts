import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing URL parameter" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "AlignBot/1.0",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch URL" },
        { status: response.status },
      );
    }

    const html = await response.text();

    const getMetaTag = (name: string) => {
      const regex = new RegExp(
        `<meta[^>]*property=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`,
        "i",
      );
      const match = html.match(regex);
      if (match) return match[1];
      const regexReverse = new RegExp(
        `<meta[^>]*content=["']([^"']+)["'][^>]*property=["']${name}["'][^>]*>`,
        "i",
      );
      const matchReverse = html.match(regexReverse);
      return matchReverse ? matchReverse[1] : null;
    };

    const getMetaName = (name: string) => {
      const regex = new RegExp(
        `<meta[^>]*name=["']${name}["'][^>]*content=["']([^"']+)["'][^>]*>`,
        "i",
      );
      const match = html.match(regex);
      if (match) return match[1];
      const regexReverse = new RegExp(
        `<meta[^>]*content=["']([^"']+)["'][^>]*name=["']${name}["'][^>]*>`,
        "i",
      );
      const matchReverse = html.match(regexReverse);
      return matchReverse ? matchReverse[1] : null;
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);

    const ogTitle = getMetaTag("og:title");
    const ogDescription = getMetaTag("og:description");
    const ogImage = getMetaTag("og:image");

    const description = getMetaName("description");

    const title = ogTitle || (titleMatch ? titleMatch[1] : "");
    const finalDescription = ogDescription || description || "";
    const image = ogImage || "";

    return NextResponse.json({
      title,
      description: finalDescription,
      image,
      url,
    });
  } catch (error) {
    console.error("Error fetching URL metadata:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
