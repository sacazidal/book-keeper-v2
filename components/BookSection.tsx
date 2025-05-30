"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Image from "next/image";
import AddBookDialog from "./AddBookDialog";
import { Dialog } from "@radix-ui/react-dialog";
import Link from "next/link";
import { bookSkeleton } from "@/const/bookSkeleton";
import { Skeleton } from "./ui/skeleton";
import { TrashIcon } from "lucide-react";

interface Book {
  id: number;
  title: string;
  authors: { fullName: string }[];
  year: number;
  coverUrl: string;
  isAvailable: boolean;
}

const BookSection = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/books");
      const data = await res.json();
      setBooks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBookById = async (id: string) => {
    try {
      const res = await fetch(`/api/book/${id}/delete`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data) {
        fetchBooks();
      }
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleAddSuccess = () => {
    fetchBooks();
    setIsOpen(true);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-end">
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Добавить книгу
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddBookDialog onClose={handleAddSuccess} />
      </Dialog>

      {loading ? (
        <div className="space-y-4 mt-7">
          {bookSkeleton.map((item) => (
            <div
              className="space-y-3 relative h-28 shadow-sm hover:shadow-md transition-shadow"
              key={item.id}
            >
              <Skeleton className="w-full h-full rounded-lg">
                <div className="flex h-full items-center justify-between p-4">
                  <div className="flex items-center gap-4">
                    <Skeleton className="h-4 w-4 dark:bg-neutral-700" />
                    <Skeleton className="w-16 h-20 rounded dark:bg-neutral-700" />
                  </div>

                  <div className="flex flex-col flex-1 px-4 gap-2">
                    <Skeleton className="h-3 w-[200px] dark:bg-neutral-700" />
                    <Skeleton className="h-3 w-[200px] dark:bg-neutral-700" />
                    <Skeleton className="h-3 w-[200px] dark:bg-neutral-700" />
                  </div>

                  <div className="flex items-center gap-4">
                    <Skeleton className="h-5 w-[140px] dark:bg-neutral-700" />
                    <Skeleton className="h-5 w-[140px] dark:bg-neutral-700" />
                  </div>
                </div>
              </Skeleton>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4 mt-7">
          {books.map((book, index) => (
            <div
              key={book.id}
              className="flex items-center justify-between p-4 border rounded-lg shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <span className="text-xl font-bold text-gray-400 w-8 text-center">
                  {index + 1}.
                </span>
                <Image
                  src={book.coverUrl}
                  alt={`Обложка ${book.title}`}
                  width={64}
                  height={80}
                  priority
                  className="w-16 h-20 object-cover rounded"
                />
              </div>

              <div className="flex flex-col flex-1 px-4">
                <h2 className="text-lg font-semibold">{book.title}</h2>
                <p className="text-sm text-gray-600">
                  Автор: {book.authors[0].fullName}
                </p>
                <p className="text-sm text-gray-500">Год: {book.year}</p>
              </div>

              <div className="flex items-center gap-4">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                    book.isAvailable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {book.isAvailable ? "Есть в наличии" : "Нет в наличии"}
                </span>
                <Link
                  href={`/book/${book.id}`}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  Подробнее
                </Link>
                <button onClick={() => deleteBookById(book.id.toString())}>
                  <TrashIcon
                    className="hover:text-red-500"
                    width={18}
                    height={18}
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default BookSection;
