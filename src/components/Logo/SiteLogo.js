"use client";

import { useContent } from "../Content/ContentProvider";

export function SiteLogo({ alt, className }) {
  const { settings } = useContent();
  const logo = settings.logo || {
    src: '/images/SONDER_ORIGIN_WORDMARK_LOGO_BLACK.svg',
    width: 473,
    height: 252,
    alt: 'Sonder Origin',
  };
  return <img className={className} src={logo.src} alt={alt ?? logo.alt} width={logo.width} height={logo.height} />;
}
