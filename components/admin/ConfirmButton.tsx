"use client";
import { useRef, type ReactNode } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

/**
 * A button that asks first, then submits its form (a server action). For anything that can't be
 * undone: deleting an entry, restoring original content.
 */
export default function ConfirmButton({
  action,
  title,
  description,
  confirmLabel,
  children,
  variant = "destructive",
  size = "default",
}: {
  action: () => Promise<void>;
  title: string;
  description: string;
  confirmLabel: string;
  children: ReactNode;
  variant?: "destructive" | "outline" | "ghost";
  size?: "default" | "sm";
}) {
  const form = useRef<HTMLFormElement>(null);
  return (
    <form ref={form} action={action}>
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button type="button" variant={variant} size={size}>
            {children}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive text-white hover:bg-destructive/90" onClick={() => form.current?.requestSubmit()}>
              {confirmLabel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </form>
  );
}
