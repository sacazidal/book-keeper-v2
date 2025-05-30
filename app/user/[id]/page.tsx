"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

interface Book {
  id: number;
  title: string;
}

interface Borrowing {
  id: number;
  book: Book;
  borrowDate: string;
  returnDate: string | null;
}

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
  borrowings: Borrowing[];
}

export default function UserById({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="max-w-3xl mx-auto p-6 rounded shadow">
      {loading ? (
        <>
          <Skeleton className="w-full h-8 rounded-xl mb-4" />
          <Skeleton className="w-full h-6 rounded-xl mb-1" />
          <Skeleton className="w-full h-6 rounded-xl" />
          <Skeleton className="w-full h-7 rounded-xl mt-6 mb-1" />
          <Skeleton className="w-full h-6 rounded-xl" />
          <Skeleton className="w-full h-6 rounded-xl mt-6" />
        </>
      ) : (
        <>
          {!user ? (
            <div>Читатель не найден</div>
          ) : (
            <>
              <h1 className="text-2xl font-bold mb-4">
                Читатель: {user.fullName}
              </h1>
              <p>Email: {user.email}</p>
              <p>Телефон: {user.phone || "Не указан"}</p>

              <h2 className="mt-6 text-lg font-medium">Выданные книги:</h2>
              <ul className="mt-2 space-y-2">
                {user.borrowings.length > 0 ? (
                  user.borrowings.map((b) => (
                    <li key={b.id}>
                      {b.book.title} —{" "}
                      <span
                        className={
                          b.returnDate ? "text-green-500" : "text-red-500"
                        }
                      >
                        {b.returnDate ? "Возвращена" : "Взята"}
                      </span>
                    </li>
                  ))
                ) : (
                  <p>Нет книг</p>
                )}
              </ul>

              <div className="mt-6">
                <Link
                  href="/admin?tab=users"
                  className="text-blue-600 hover:underline"
                >
                  ← Назад к списку
                </Link>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
