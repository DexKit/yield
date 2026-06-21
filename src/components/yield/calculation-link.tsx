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
        className="text-sm text-yield-accent text-yield-accent-hover underline-offset-2 transition-colors hover:underline"
      >
        How is this calculated?
      </button>
      <CalculationModal open={open} onClose={() => setOpen(false)} />
    </>
  );
}
