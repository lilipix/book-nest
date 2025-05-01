import { format } from "date-fns";
import { fr } from "date-fns/locale";
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

const DatePicker = () => {
  const formContext = useFormContext<DatePickerFormBlockValues>();
  const date = formContext.watch("borrowedAt");
  return (
    <Popover>
      <PopoverTrigger>
        <Button
          type="button"
          variant={"outline"}
          className={cn(
            "h-9 w-full px-3 py-2 border border-input bg-background text-base font-normal text-left justify-start items-center rounded-md",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? (
            format(date, "PPP", { locale: fr })
          ) : (
            <span>Sélectionnez une date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date ?? undefined}
          onSelect={(selectedDate) =>
            formContext.setValue("borrowedAt", selectedDate ?? null)
          }
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
