import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const book = await prisma.book.findUnique({
      where: { id: Number(id) },
      include: {
        authors: true,
        genres: true,
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Книга не найдена" }, { status: 400 });
    }

    return NextResponse.json(book, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при получении данных" },
      { status: 500 }
    );
  }
}
