"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { CheckCircle2, X } from "lucide-react";

import { Button } from "@/components/ui/button";

type SuccessDialogProps = {
  open: boolean;
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
  onOpenChange: (open: boolean) => void;
};

export function SuccessDialog({
  open,
  title,
  message,
  actionLabel = "Done",
  onAction,
  onOpenChange
}: SuccessDialogProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[70] bg-slate-950/35 backdrop-blur-md data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-slate-200 bg-white p-6 shadow-2xl shadow-slate-900/20 outline-none data-[state=closed]:animate-out data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <Dialog.Close className="absolute right-4 top-4 rounded-md p-2 text-slate-400 transition-colors duration-150 hover:bg-slate-100 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
            <X className="h-4 w-4" />
            <span className="sr-only">Close success dialog</span>
          </Dialog.Close>

          <div className="flex flex-col items-center text-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
              <CheckCircle2 className="h-7 w-7" />
            </span>
            <Dialog.Title className="mt-5 text-xl font-semibold tracking-tight text-slate-900">
              {title}
            </Dialog.Title>
            <Dialog.Description className="mt-2 text-sm leading-6 text-slate-600">
              {message}
            </Dialog.Description>
            <Button
              type="button"
              className="mt-6 w-full"
              onClick={() => {
                onAction?.();
                onOpenChange(false);
              }}
            >
              {actionLabel}
            </Button>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
