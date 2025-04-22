import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useFormContext } from "react-hook-form";
import { z } from "zod";

export const DatePickerFormBlockSchema = z.object({
  borrowedAt: z.date().nullable(),
});

export type DatePickerFormBlockValues = z.infer<
  typeof DatePickerFormBlockSchema
>;
export function DatePicker() {
  const [date, setDate] = React.useState<Date>();
  const formContext = useFormContext<DatePickerFormBlockValues>();
  React.useEffect(() => {
    if (formContext && date) {
      formContext.setValue("borrowedAt", date);
    }
  }, [date, formContext]);
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "w-[280px] justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "fr‑FR") : <span>Sélectionnez une date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
