import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany();

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return NextResponse.json(
      { error: "Не удалось загрузить список читателей" },
      { status: 500 }
    );
  }
}
