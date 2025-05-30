"use client";

import AuthorSection from "@/components/AuthorSection";
import BookSection from "@/components/BookSection";
import BorrowingSection from "@/components/BorrowingSection";
import { Button } from "@/components/ui/button";
import UserSection from "@/components/UserSection";
import { useRouter, useSearchParams } from "next/navigation";

export default function AdminPage() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "books";

  const router = useRouter();

  return (
    <div className="p-6">
      <div className="flex items-center justify-end gap-4 mb-6">
        <Button
          className="cursor-pointer"
          variant={tab === "books" ? "default" : "outline"}
          onClick={() => router.push("/admin?tab=books")}
        >
          Книги
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "users" ? "default" : "outline"}
          onClick={() => router.push("/admin?tab=users")}
        >
          Читатели
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "borrowings" ? "default" : "outline"}
          onClick={() => router.push("/admin?tab=borrowings")}
        >
          История выдач
        </Button>
        <Button
          className="cursor-pointer"
          variant={tab === "authors" ? "default" : "outline"}
          onClick={() => router.push("/admin?tab=authors")}
        >
          Авторы книг
        </Button>
      </div>

      <div className="border-2 rounded-xl p-5 shadow min-h-[300px]">
        {tab === "books" && <BookSection />}
        {tab === "users" && <UserSection />}
        {tab === "borrowings" && <BorrowingSection />}
        {tab === "authors" && <AuthorSection />}
      </div>
    </div>
  );
}
