"use client";

import { Suspense } from "react";
import AdminPage from "./AdminPage";

export default function AdminPageWrapper() {
  return (
    <Suspense fallback="Загрузка...">
      <AdminPage />
    </Suspense>
  );
}
