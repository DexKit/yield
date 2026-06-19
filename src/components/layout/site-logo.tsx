type SiteLogoVariant = "header" | "hero";

interface SiteLogoProps {
  className?: string;
  alt?: string;
  priority?: boolean;
  variant?: SiteLogoVariant;
  decorative?: boolean;
}

const LOGO_ASSETS = {
  header: { src: "/logo-mark.png", width: 294, height: 295 },
  hero: { src: "/logo-hero.png", width: 294, height: 328 },
} as const;

const VARIANT_CLASS: Record<SiteLogoVariant, string> = {
  header: "block h-8 w-8 shrink-0 object-contain",
  hero: "mx-auto block h-28 w-auto shrink-0 sm:h-32",
};

/** Native img keeps PNG alpha; Next/Image WebP optimization adds a black matte. */
export function SiteLogo({
  className,
  alt = "Yield by DexKit",
  priority = false,
  variant = "header",
  decorative = false,
}: SiteLogoProps) {
  const asset = LOGO_ASSETS[variant];

  return (
    // eslint-disable-next-line @next/next/no-img-element -- transparency must bypass next/image optimizer
    <img
      src={asset.src}
      alt={decorative ? "" : alt}
      aria-hidden={decorative || undefined}
      width={asset.width}
      height={asset.height}
      className={className ?? VARIANT_CLASS[variant]}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
