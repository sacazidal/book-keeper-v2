"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";

interface Author {
  fullName: string;
}

interface Genre {
  name: string;
}

interface Book {
  id: number;
  title: string;
  year: number;
  isAvailable: boolean;
  coverUrl: string;
  authors: Author[];
  genres: Genre[];
}

export default function BookById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchBook = async () => {
      try {
        const res = await fetch(`/api/book/${id}`);
        if (!res.ok) {
          throw new Error("Книга не найдена");
        }
        const data = await res.json();
        setBook(data);
      } catch (error) {
        console.error(error);
        notFound();
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [id]);

  return (
    <div className="max-w-3xl dark:bg-neutral-800 bg-neutral-100 mx-auto p-6 rounded-xl shadow">
      {loading ? (
        <>
          <div>
            <Skeleton className="w-full mb-4 h-8 rounded-xl dark:bg-neutral-900" />
            <div className="flex gap-6">
              <Skeleton className="w-48 h-60 rounded-xl dark:bg-neutral-900" />
              <div className="flex-1 space-y-4">
                <Skeleton className="w-40 h-6 rounded-xl dark:bg-neutral-900" />
                <Skeleton className="w-40 h-6 rounded-xl dark:bg-neutral-900" />
                <Skeleton className="w-40 h-6 rounded-xl dark:bg-neutral-900" />
                <Skeleton className="w-40 h-6 rounded-xl dark:bg-neutral-900" />
              </div>
            </div>
            <Skeleton className="w-60 h-4 rounded-xl dark:bg-neutral-900 mt-6" />
          </div>
        </>
      ) : (
        <>
          {!book ? (
            <div>Книга не найдена</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">{book.title}</h1>

              <div className="flex gap-6">
                <div className="w-48 h-60">
                  <Image
                    src={book.coverUrl}
                    width={200}
                    height={300}
                    priority
                    alt={book.title}
                    className="w-full h-full object-cover rounded"
                  />
                </div>

                <div className="flex-1 space-y-4">
                  <p>
                    <span className="font-medium">Автор(ы):</span>{" "}
                    {book.authors.map((a) => a.fullName).join(", ") ||
                      "Неизвестные"}
                  </p>

                  <p>
                    <span className="font-medium">Год:</span> {book.year}
                  </p>

                  <p>
                    <span className="font-medium">Жанр(ы):</span>{" "}
                    {book.genres.map((g) => g.name).join(", ") || "Не указано"}
                  </p>

                  <p>
                    <span className="font-medium">Доступность:</span>{" "}
                    <span
                      className={
                        book.isAvailable ? "text-green-500" : "text-red-500"
                      }
                    >
                      {book.isAvailable ? "Есть в наличии" : "Нет в наличии"}
                    </span>
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/admin?tab=books"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Назад к списку книг
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
