"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Dialog } from "@radix-ui/react-dialog";
import AddUserDialog from "./AddUserDialog";
import Link from "next/link";
import { Skeleton } from "./ui/skeleton";
import { userSkeleton } from "@/const/userSkeleton";

interface User {
  id: number;
  fullName: string;
  email: string;
  phone?: string;
}

export default function UserSection() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddSuccess = () => {
    fetchUsers();
    setIsOpen(false);
  };

  return (
    <div className="flex flex-col justify-center">
      <div className="flex justify-end">
        <Button className="cursor-pointer" onClick={() => setIsOpen(true)}>
          Добавить читателя
        </Button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <AddUserDialog onClose={handleAddSuccess} />
      </Dialog>

      <div className="space-y-4 mt-7">
        {loading ? (
          <div className="min-w-full border rounded shadow">
            <div className="flex items-center justify-between gap-3 px-15 py-3">
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
              <Skeleton className="h-3 w-[150px] dark:bg-neutral-700" />
            </div>
            <div>
              {userSkeleton.map((item) => (
                <div
                  className="border-t flex items-center justify-between gap-3 px-17 py-5"
                  key={item.id}
                >
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
                <th className="px-4 py-2 text-left">Имя</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Телефон</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-t">
                  <td className="px-4 py-2">
                    <Link
                      href={`/user/${user.id}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {user.fullName}
                    </Link>
                  </td>
                  <td className="px-4 py-2">{user.email}</td>
                  <td className="px-4 py-2">{user.phone || "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
