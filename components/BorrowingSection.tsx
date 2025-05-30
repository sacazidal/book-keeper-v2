"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import AddBorrowingDialog from "./AddBorrowingDialog";
import { Skeleton } from "./ui/skeleton";
import { borrowingSkeleton } from "@/const/borrowingSkeleton";

interface Borrowing {
  id: number;
  user: {
    fullName: string;
    email: string;
  };
  book: {
    title: string;
    year: number;
  };
  borrowDate: string;
  returnDate: string | null;
}

const BookSection = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrowings = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/borrowings");
      const data = await res.json();
      setBorrowings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBorrowings();
  }, []);

  const handleAddSuccess = () => {
    fetchBorrowings();
    setIsOpen(false);
  };

  const handleReturnBook = async (id: number) => {
    try {
      const res = await fetch(`/api/borrowing/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ returnDate: new Date().toISOString() }),
      });

      if (res.ok) {
        fetchBorrowings();
      } else {
        throw new Error("Ошибка при возврате книги");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-end">
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Добавить выдачу
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddBorrowingDialog onClose={handleAddSuccess} />
      </Dialog>

      <div className="space-y-4 mt-7">
        {loading ? (
          <div className="min-w-full border rounded shadow">
            <div className="flex items-center justify-between gap-3 px-15 py-3">
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
            </div>
            <div>
              {borrowingSkeleton.map((item) => (
                <div
                  className="border-t flex items-center justify-between gap-3 px-17 py-5"
                  key={item.id}
                >
                  <Skeleton className="h-3 w-[130px] dark:bg-neutral-700" />
                  <Skeleton className="h-3 w-[130px] dark:bg-neutral-700" />
                  <Skeleton className="h-3 w-[130px] dark:bg-neutral-700" />
                  <Skeleton className="h-3 w-[130px] dark:bg-neutral-700" />
                  <Skeleton className="h-3 w-[130px] dark:bg-neutral-700" />
                </div>
              ))}
            </div>
          </div>
        ) : (
          <table className="min-w-full border rounded shadow">
            <thead className="">
              <tr>
                <th className="px-4 py-2 text-left">Читатель</th>
                <th className="px-4 py-2 text-left">Книга</th>
                <th className="px-4 py-2 text-left">Дата выдачи</th>
                <th className="px-4 py-2 text-left">Дата возврата</th>
                <th className="px-4 py-2 text-left">Действия</th>
              </tr>
            </thead>
            <tbody>
              {borrowings.map((b) => (
                <tr key={b.id} className="border-t">
                  <td className="px-4 py-2">{b.user.fullName}</td>
                  <td className="px-4 py-2">{b.book.title}</td>
                  <td className="px-4 py-2">
                    {new Date(b.borrowDate).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2">
                    {b.returnDate
                      ? new Date(b.returnDate).toLocaleDateString()
                      : "Не возвращена"}
                  </td>
                  <td className="px-4 py-2">
                    {!b.returnDate && (
                      <Button size="sm" onClick={() => handleReturnBook(b.id)}>
                        Вернуть
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default BookSection;
