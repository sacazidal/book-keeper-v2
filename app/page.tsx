"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { authorSkeleton } from "@/const/authorSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

interface Book {
  id: number;
  title: string;
  year: number;
  coverUrl?: string;
  isAvailable: boolean;
  authors: {
    fullName: string;
  }[];
}

export default function Home() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const fetchBooks = async () => {
      try {
        const res = await fetch("/api/books/get-available");
        const data = await res.json();
        setBooks(data);
      } catch (error) {
        console.error("Ошибка при загрузке книг:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">📚 Доступные книги</h1>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-6 space-y-12">
          {authorSkeleton.map((item) => (
            <div className="space-y-3 relative h-85" key={item.id}>
              <Skeleton className="w-full h-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <p className="text-gray-500">Нет доступных книг.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {books.map((book) => (
                <Link
                  href={`/book/${book.id}`}
                  key={book.id}
                  className="block group"
                >
                  <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow h-full flex flex-col">
                    <div className="relative w-full h-62 bg-gray-200 flex items-center justify-center">
                      {book.coverUrl ? (
                        <Image
                          src={book.coverUrl}
                          alt={`Обложка ${book.title}`}
                          width={300}
                          height={340}
                          className="object-cover w-full h-full"
                        />
                      ) : (
                        <span className="text-gray-400 text-3xl">📘</span>
                      )}
                    </div>
                    <div className="p-4 flex flex-col flex-1">
                      <h2 className="font-semibold text-lg line-clamp-1 group-hover:text-blue-600 transition-colors">
                        {book.title}
                      </h2>
                      <p className="text-sm text-gray-600 mt-1">
                        Автор:{" "}
                        {book.authors[0]?.fullName || "Неизвестный автор"}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Год: {book.year}
                      </p>
                      <div className="mt-auto pt-4">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                            book.isAvailable
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {book.isAvailable ? "Доступна" : "Взята"}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </>
      )}
    </main>
  );
}
