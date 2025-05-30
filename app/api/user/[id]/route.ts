import prisma from "@/config/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        borrowings: {
          include: {
            book: true,
          },
        },
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "Пользователь не найден" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    console.error("Ошибка при получении пользователя:", error);
    return new Response(
      JSON.stringify({ error: "Не удалось загрузить данные пользователя" }),
      { status: 500 }
    );
  }
}
