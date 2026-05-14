import { NextResponse } from "next/server";

// Optional Google Places integration. When GOOGLE_PLACES_API_KEY and
// GOOGLE_PLACE_ID are configured, this endpoint fetches the latest reviews
// from the Places API (Place Details, fields=reviews,rating,userRatingCount)
// and caches them for 24 h via Next's native fetch revalidate.
//
// When the env vars are absent (default state until the client onboards an
// API key), the endpoint returns { configured: false } and the client falls
// back to the minimal version of the Reviews section.
//
// We never invent reviews. Authors must be real people who actually left a
// review — that's what the Google Places API guarantees.

const FIELDS = "reviews,rating,userRatingCount";

type Review = {
  authorName: string;
  rating: number;
  text: string;
  time: number;
  profilePhotoUrl?: string;
  relativeTimeDescription?: string;
  language?: string;
};

export const revalidate = 86400; // 24 h

export async function GET() {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const placeId = process.env.GOOGLE_PLACE_ID;

  if (!apiKey || !placeId) {
    return NextResponse.json({ configured: false, reviews: [] }, { status: 200 });
  }

  try {
    const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
    url.searchParams.set("place_id", placeId);
    url.searchParams.set("fields", FIELDS);
    url.searchParams.set("language", "es");
    url.searchParams.set("key", apiKey);

    const res = await fetch(url, { next: { revalidate: 86400 } });
    if (!res.ok) {
      return NextResponse.json(
        { configured: true, reviews: [], error: `Places API ${res.status}` },
        { status: 200 }
      );
    }
    const json = (await res.json()) as {
      result?: {
        reviews?: Array<{
          author_name: string;
          rating: number;
          text: string;
          time: number;
          profile_photo_url?: string;
          relative_time_description?: string;
          language?: string;
        }>;
        rating?: number;
        user_ratings_total?: number;
      };
      status: string;
    };

    if (json.status !== "OK") {
      return NextResponse.json(
        { configured: true, reviews: [], error: json.status },
        { status: 200 }
      );
    }

    const reviews: Review[] = (json.result?.reviews ?? []).slice(0, 6).map((r) => ({
      authorName: r.author_name,
      rating: r.rating,
      text: r.text,
      time: r.time,
      profilePhotoUrl: r.profile_photo_url,
      relativeTimeDescription: r.relative_time_description,
      language: r.language,
    }));

    return NextResponse.json(
      {
        configured: true,
        reviews,
        rating: json.result?.rating ?? null,
        total: json.result?.user_ratings_total ?? null,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("[google-reviews] fetch failed", err);
    return NextResponse.json(
      { configured: true, reviews: [], error: "fetch-failed" },
      { status: 200 }
    );
  }
}
