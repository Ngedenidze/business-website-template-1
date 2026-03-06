"use client";

import Image from "next/image";
import { TentTree } from "lucide-react";
import { useState } from "react";

type BrandLogoProps = {
  logoUrl?: string | null;
  alt: string;
  size?: number;
};

export function BrandLogo({ logoUrl, alt, size = 36 }: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!logoUrl || hasError) {
    return <TentTree size={18} />;
  }

  return (
    <Image
      src={logoUrl}
      alt={alt}
      width={size}
      height={size}
      unoptimized
      onError={() => setHasError(true)}
    />
  );
}
