import prisma from "@/config/prisma";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const author = await prisma.author.findUnique({
      where: { id: Number(id) },
      include: {
        books: {
          select: {
            id: true,
            title: true,
            coverUrl: true,
          },
        },
      },
    });

    if (!author) {
      return new Response(JSON.stringify({ error: "Автор не найден" }), {
        status: 404,
      });
    }

    return new Response(JSON.stringify(author), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Ошибка при получении данных" }),
      { status: 500 }
    );
  }
}
