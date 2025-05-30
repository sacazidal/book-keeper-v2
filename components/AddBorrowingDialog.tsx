"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

interface AddBorrowingDialogProps {
  onClose: () => void;
}

export default function AddBorrowingDialog({
  onClose,
}: AddBorrowingDialogProps) {
  const [userId, setUserId] = useState<string>("");
  const [bookId, setBookId] = useState<string>("");
  const [users, setUsers] = useState<{ id: number; fullName: string }[]>([]);
  const [books, setBooks] = useState<{ id: number; title: string }[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const usersRes = await fetch("/api/users");
      const booksRes = await fetch("/api/books");

      const usersData = await usersRes.json();
      const booksData = await booksRes.json();

      setUsers(usersData);
      setBooks(booksData);
    };

    fetchData();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/borrowing/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: parseInt(userId),
          bookId: parseInt(bookId),
        }),
      });

      if (res.ok) {
        onClose();
      } else {
        throw new Error("Ошибка при добавлении выдачи");
      }
    } catch (error) {
      console.error(error);
      alert("Не удалось добавить выдачу");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
      <DialogHeader>
        <DialogTitle>Добавить новую выдачу</DialogTitle>
        <DialogDescription>Заполните данные</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="user" className="text-right">
              Читатель
            </Label>
            <Select onValueChange={setUserId} value={userId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите читателя" />
              </SelectTrigger>
              <SelectContent>
                {users.map((user) => (
                  <SelectItem key={user.id} value={String(user.id)}>
                    {user.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="book" className="text-right">
              Книга
            </Label>
            <Select onValueChange={setBookId} value={bookId}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Выберите книгу" />
              </SelectTrigger>
              <SelectContent>
                {books.map((book) => (
                  <SelectItem key={book.id} value={String(book.id)}>
                    {book.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{loading ? "Добавляем..." : "Добавить"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
