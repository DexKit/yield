"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { identifierSchema } from "@/lib/validation/identifier";

interface SearchFormProps {
  defaultValue?: string;
}

export function SearchForm({ defaultValue = "" }: SearchFormProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const result = identifierSchema.safeParse(value);
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Invalid input");
      return;
    }

    setLoading(true);
    const encoded = encodeURIComponent(result.data.trim());
    router.push(`/${encoded}`);
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-3">
      <Input
        type="text"
        placeholder="Paste wallet or ENS"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          setError(null);
        }}
        aria-label="Wallet address or ENS name"
        autoComplete="off"
        spellCheck={false}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" className="w-full" disabled={loading}>
        {loading ? "Calculating…" : "Calculate Yield"}
      </Button>
    </form>
  );
}
