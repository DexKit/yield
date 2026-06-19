type SiteLogoVariant = "header" | "hero";

interface SiteLogoProps {
  className?: string;
  alt?: string;
  priority?: boolean;
  variant?: SiteLogoVariant;
}

const LOGO_SRC = "/logo-hero.png";
const LOGO_WIDTH = 186;
const LOGO_HEIGHT = 192;

const VARIANT_CLASS: Record<SiteLogoVariant, string> = {
  header: "block h-8 w-auto shrink-0",
  hero: "mx-auto block h-20 w-auto shrink-0 sm:h-24",
};

/** Native img keeps PNG alpha; Next/Image WebP optimization adds a black matte. */
export function SiteLogo({
  className,
  alt = "Yield by DexKit",
  priority = false,
  variant = "header",
}: SiteLogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- transparency must bypass next/image optimizer
    <img
      src={LOGO_SRC}
      alt={alt}
      width={LOGO_WIDTH}
      height={LOGO_HEIGHT}
      className={className ?? VARIANT_CLASS[variant]}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
    />
  );
}
