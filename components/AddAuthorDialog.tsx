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

interface AddAuthorDialogProps {
  onClose: () => void;
}

export default function AddAuthorDialog({ onClose }: AddAuthorDialogProps) {
  const [fullName, setFullName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/author/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName,
          bio,
          avatarUrl,
        }),
      });

      if (res.ok) {
        setFullName("");
        setBio("");
        setAvatarUrl("");
        onClose();
      } else {
        throw new Error("Ошибка при добавлении автора");
      }
    } catch (error) {
      console.error(error);
      alert("Не удалось добавить автора");
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
      setAvatarUrl(imageUrl);
    } catch (error) {
      console.error("Ошибка загрузки изображения:", error);
      alert("Не удалось загрузить изображение");
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] dark:bg-neutral-900">
      <DialogHeader>
        <DialogTitle>Добавить нового автора</DialogTitle>
        <DialogDescription>Заполните данные об авторе</DialogDescription>
      </DialogHeader>
      <form onSubmit={handleSubmit}>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="fullName" className="text-right">
              Имя
            </Label>
            <Input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="bio" className="text-right">
              Биография
            </Label>
            <Input
              id="bio"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="col-span-3"
              required
            />
          </div>

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="avatarUrl" className="text-right">
              Фото
            </Label>
            <Input
              id="image"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="w-[124px]"
            />
            {avatarUrl && (
              <div className="relative w-16 h-20 ml-12">
                <Image
                  src={avatarUrl}
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
