"use client";

import { use, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Author {
  id: number;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
  books: {
    id: number;
    title: string;
    coverUrl: string;
  }[];
}

export default function AuthorById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [author, setAuthor] = useState<Author | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await fetch(`/api/author/${id}`);
        if (!res.ok) throw new Error("Автор не найден");
        const data = await res.json();
        setAuthor(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchAuthor();
  }, [id]);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {loading ? (
        <>
          <div className="flex items-center">
            <Skeleton className="w-24 h-24 rounded-full" />
            <div className="flex flex-col w-full max-w-xl gap-3 ml-10">
              <Skeleton className="w-full h-4 rounded-xl" />
              <Skeleton className="w-full h-4 rounded-xl" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <Skeleton className="w-full h-100 rounded-xl mt-6 mb-1" />
            <Skeleton className="w-full h-100 rounded-xl mt-6 mb-1" />
            <Skeleton className="w-full h-100 rounded-xl mt-6 mb-1" />
          </div>
          <Skeleton className="w-40 h-4 rounded-xl mt-6 mb-1" />
          <Skeleton className="w-60 h-4 rounded-xl mt-6 mb-1" />
        </>
      ) : (
        <>
          {!author ? (
            <div>Автор не найден</div>
          ) : (
            <>
              <div className="flex items-center gap-6 mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                  {author.avatarUrl ? (
                    <Image
                      src={author.avatarUrl}
                      alt={author.fullName}
                      width={96}
                      height={96}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-3xl">👤</span>
                  )}
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{author.fullName}</h1>
                  <p className="text-gray-600 mt-2">
                    {author.bio || "Биография отсутствует"}
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold mb-4">Книги автора</h2>
              {author.books.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                  {author.books.map((book) => (
                    <Link
                      href={`/book/${book.id}`}
                      key={book.id}
                      className="block group"
                    >
                      <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                        <div className="relative w-full h-100 bg-gray-200 flex items-center justify-center">
                          {book.coverUrl ? (
                            <Image
                              src={book.coverUrl}
                              alt={book.title}
                              width={300}
                              height={450}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <span className="text-gray-400 text-xl">📘</span>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-medium group-hover:text-blue-600 transition-colors">
                            {book.title}
                          </h3>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">У этого автора пока нет книг.</p>
              )}

              <div className="mt-8">
                <Link
                  href="/admin?tab=authors"
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Назад к списку авторов
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
