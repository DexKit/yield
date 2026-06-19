"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef } from "react";
import { YIELD_DISCLAIMER } from "@/lib/constants/trust";

interface CalculationModalProps {
  open: boolean;
  onClose: () => void;
}

export function CalculationModal({ open, onClose }: CalculationModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className="fixed inset-0 z-50 m-auto w-[calc(100%-2rem)] max-w-md rounded-xl border border-zinc-200 bg-white p-0 shadow-xl backdrop:bg-zinc-900/50 dark:border-zinc-700 dark:bg-zinc-900"
      aria-labelledby="calc-modal-title"
    >
      <div className="space-y-5 p-6">
        <div className="flex items-start justify-between gap-4">
          <h2
            id="calc-modal-title"
            className="text-lg font-semibold text-zinc-900 dark:text-zinc-50"
          >
            How is this calculated?
          </h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-md px-2 py-1 text-sm text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4 text-sm text-zinc-600 dark:text-zinc-300">
          <p>We estimate yield using:</p>
          <ol className="list-decimal space-y-1 pl-5">
            <li>Current wallet balances</li>
            <li>Current protocol yield rates</li>
            <li>Current market prices</li>
          </ol>
          <p className="text-zinc-500 dark:text-zinc-400">
            These are estimates based on current rates and are not guaranteed.
          </p>
          <p>
            <Link
              href="/methodology"
              className="text-emerald-600 underline-offset-2 hover:underline"
              onClick={handleClose}
            >
              Read full methodology →
            </Link>
          </p>
        </div>

        <p className="border-t border-zinc-100 pt-4 text-xs text-zinc-400 dark:border-zinc-800">
          {YIELD_DISCLAIMER}
        </p>
      </div>
    </dialog>
  );
}
