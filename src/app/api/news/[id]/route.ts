import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET - Fetch single news
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const news = await db.news.findUnique({
      where: { id },
    });
    
    if (!news) {
      return NextResponse.json({ error: "News not found" }, { status: 404 });
    }
    
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}

// PUT - Update news
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { titleAr, titleFr, contentAr, contentFr, date, image, featured, published } = body;
    
    const news = await db.news.update({
      where: { id },
      data: {
        titleAr,
        titleFr,
        contentAr,
        contentFr,
        date: date ? new Date(date) : undefined,
        image,
        featured,
        published,
      },
    });
    
    return NextResponse.json(news);
  } catch (error) {
    console.error("Error updating news:", error);
    return NextResponse.json({ error: "Failed to update news" }, { status: 500 });
  }
}

// DELETE - Delete news
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await db.news.delete({
      where: { id },
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting news:", error);
    return NextResponse.json({ error: "Failed to delete news" }, { status: 500 });
  }
}
