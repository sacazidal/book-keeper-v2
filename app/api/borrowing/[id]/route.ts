import prisma from "@/config/prisma";
import dayjs from "dayjs";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const borrowingRecord = await prisma.borrowing.findUnique({
      where: { id: Number(id) },
      select: { bookId: true },
    });

    if (!borrowingRecord) {
      return NextResponse.json({ error: "Запись не найдена" }, { status: 404 });
    }

    const updated = await prisma.borrowing.update({
      where: { id: Number(id) },
      data: {
        returnDate: dayjs().toDate(),
      },
    });

    await prisma.book.update({
      where: { id: borrowingRecord.bookId },
      data: { isAvailable: true },
    });

    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не удалось обновить запись" },
      { status: 500 }
    );
  }
}
