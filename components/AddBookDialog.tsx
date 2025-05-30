"use client";

import {
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import Image from "next/image";

interface AddBookDialogProps {
  onClose: () => void;
}

export default function AddBookDialog({ onClose }: AddBookDialogProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [genre, setGenre] = useState("");
  const [year, setYear] = useState("");
  const [coverUrl, setCoverUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/books/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          author,
          genre,
          year: parseInt(year),
          coverUrl,
        }),
      });

      if (res.ok) {
        setTitle("");
        setAuthor("");
        setGenre("");
        setYear("");
        setCoverUrl("");
        onClose();
      } else {
        throw new Error("Ошибка при добавлении книги");
      }
    } catch (error) {
      console.error(error);
      alert("Не удалось добавить книгу");
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(
        `https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMAGEBB_API_KEY}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();
      const imageUrl = data.data.url;
      setCoverUrl(imageUrl);
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      alert("Не удалось загрузить изображение");
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
      <DialogHeader>
        <DialogTitle>Добавить новую книгу</DialogTitle>
        <DialogDescription>Заполните данные о книге</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Название
            </Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="author" className="text-right">
              Автор
            </Label>
            <Input
              id="author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="genre" className="text-right">
              Жанр
            </Label>
            <Input
              id="genre"
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="year" className="text-right">
              Год
            </Label>
            <Input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="image" className="text-right">
              Картинка
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-[124px]"
            />
            {coverUrl && (
              <div className="relative w-16 h-20 ml-12">
                <Image
                  src={coverUrl}
                  width={300}
                  height={400}
                  alt="Обложка"
                  className="object-cover w-full h-full rounded"
                />
              </div>
            )}
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">{loading ? "Добавляем..." : "Добавить"}</Button>
        </DialogFooter>
      </form>
    </DialogContent>
  );
}
