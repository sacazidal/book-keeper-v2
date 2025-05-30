import prisma from "@/config/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { userId, bookId } = await request.json();

  try {
  const book = await prisma.book.findUnique({
      where: { id: Number(bookId) },
      select: { isAvailable: true },
    });

    if (!book || !book.isAvailable) {
      return NextResponse.json({ error: "Книга недоступна" }, { status: 400 });
    }
    
    const borrowing = await prisma.borrowing.create({
      data: {
        userId,
        bookId,
        borrowDate: dayjs().toDate(),
      },
    });

    await prisma.book.update({
      where: { id: Number(bookId) },
      data: { isAvailable: false },
    });

    return NextResponse.json(borrowing, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не удалось создать выдачу" },
      { status: 500 }
    );
  }
}
