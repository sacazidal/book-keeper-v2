import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const borrowings = await prisma.borrowing.findMany({
      include: {
        user: true,
        book: true,
      },
    });

    return NextResponse.json(borrowings, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не удалось загрузить историю выдачи" },
      { status: 500 }
    );
  }
}
