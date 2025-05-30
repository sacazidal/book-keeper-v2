import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const book = await prisma.book.delete({
      where: { id: Number(id) },
      include: {
        authors: true,
        genres: true,
      },
    });

    if (!book) {
      return NextResponse.json({ error: "Книга не найдена" }, { status: 400 });
    }

    return NextResponse.json({ message: "Книга удалена" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при удалении книги" },
      { status: 500 }
    );
  }
}
