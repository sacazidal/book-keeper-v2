"use client";

import Image from "next/image";
import Link from "next/link";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { useEffect, useState } from "react";
import AddAuthorDialog from "./AddAuthorDialog";
import { Skeleton } from "./ui/skeleton";
import { authorSkeleton } from "@/const/authorSkeleton";

interface Author {
  id: number;
  fullName: string;
  bio?: string;
  avatarUrl?: string;
}

const AuthorSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAuthors = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/authors");
      const data = await res.json();
      setAuthors(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuthors();
  }, []);

  const handleAddSuccess = () => {
    fetchAuthors();
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-end">
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Добавить автора
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddAuthorDialog onClose={handleAddSuccess} />
      </Dialog>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-7 gap-6 space-y-12">
          {authorSkeleton.map((item) => (
            <div className="space-y-3 relative h-93" key={item.id}>
              <Skeleton className="w-full h-full rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-7">
          {authors.map((author) => (
            <Link href={`/author/${author.id}`} key={author.id}>
              <div className="border rounded-lg overflow-hidden shadow hover:shadow-md transition-shadow">
                <div className="relative w-full h-80 bg-gray-200 flex items-center justify-center">
                  {author.avatarUrl ? (
                    <Image
                      src={author.avatarUrl}
                      alt={author.fullName}
                      width={200}
                      height={200}
                      className="object-cover w-full h-full"
                    />
                  ) : (
                    <span className="text-gray-400 text-xl">👤</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-lg">{author.fullName}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {author.bio || "Биография отсутствует"}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
export default AuthorSection;
