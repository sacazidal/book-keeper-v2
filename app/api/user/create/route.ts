import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { fullName, email, phone } = await request.json();

  try {
    const user = await prisma.user.create({
      data: {
        fullName,
        email,
        phone,
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    return NextResponse.json(
      { error: "Не удалось создать пользователя" },
      { status: 500 }
    );
  }
}
