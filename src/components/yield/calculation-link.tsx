"use client";

import { useState } from "react";
import { CalculationModal } from "./calculation-modal";

export function CalculationLink() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-sm text-emerald-600 underline-offset-2 transition-colors hover:text-emerald-700 hover:underline dark:text-emerald-500 dark:hover:text-emerald-400"
      >
        How is this calculated?
      </button>
      <CalculationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
