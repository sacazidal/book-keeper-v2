import prisma from "@/config/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { fullName, bio, avatarUrl } = await request.json();
    if (!fullName || typeof fullName !== "string") {
      return NextResponse.json(
        { error: "Поле 'fullName' обязательно" },
        { status: 400 }
      );
    }

    const author = await prisma.author.create({
      data: {
        fullName,
        bio: bio || null,
        avatarUrl: avatarUrl || null,
      },
    });

    return NextResponse.json(author, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании автора:", error);
    return NextResponse.json(
      { error: "Не удалось создать автора" },
      { status: 500 }
    );
  }
}
