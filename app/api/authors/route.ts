import prisma from "@/config/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const authors = await prisma.author.findMany({
      select: {
        id: true,
        fullName: true,
        bio: true,
        avatarUrl: true,
      },
    });

    return NextResponse.json(authors, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Не удалось загрузить авторов" },
      { status: 500 }
    );
  }
}
