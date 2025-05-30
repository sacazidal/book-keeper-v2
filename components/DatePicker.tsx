"use client";

import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import { Button } from "./ui/button";

interface DatePickerProps {
  date: Date | undefined;
}

export function DatePicker({ date }: DatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <span className="mr-2 h-4 w-4">📅</span>
          {date ? dayjs(date).format("DD.MM.YYYY") : <span>Выберите дату</span>}
        </Button>
      </PopoverTrigger>
    </Popover>
  );
}
