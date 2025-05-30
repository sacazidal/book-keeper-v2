import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const books = await prisma.book.findMany({
      include: {
        authors: true,
        genres: true,
      },
      where: {
        isAvailable: true,
      },
    });
    return NextResponse.json(books, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при получении кинг" },
      { status: 500 }
    );
  }
}
