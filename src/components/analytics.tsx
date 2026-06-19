/** Privacy-friendly analytics via Plausible (no cookies). */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  if (!domain) return null;

  return (
    <script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
    />
  );
}
