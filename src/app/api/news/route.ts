import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch all news
export async function GET() {
  try {
    const news = await db.news.findMany({
      where: { published: true },
      orderBy: { date: "desc" },
    });
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// POST - Create new news
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titleAr, titleFr, contentAr, contentFr, date, image, featured, published } = body;
    
    const news = await db.news.create({
      data: {
        titleAr,
        titleFr,
        contentAr,
        contentFr,
        date: date ? new Date(date) : new Date(),
        image,
        featured: featured || false,
        published: published !== false,
      },
    });
    
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error creating news:", error);
    return NextResponse.json({ error: "Failed to create news" }, { status: 500 });
  }
}
