import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { title, author, genre, year, coverUrl } = await req.json();

  try {
    const book = await prisma.book.create({
      data: {
        title,
        year,
        coverUrl,
        authors: {
          connectOrCreate: {
            where: { fullName: author },
            create: { fullName: author },
          },
        },
        genres: {
          connectOrCreate: {
            where: { name: genre },
            create: { name: genre },
          },
        },
      },
    });

    return NextResponse.json(book, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Ошибка при добавлении книги" },
      { status: 500 }
    );
  }
}
