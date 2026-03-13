"use client";

import Image from "next/image";
import { TentTree } from "lucide-react";
import { useState } from "react";

type BrandLogoProps = {
  logoUrl?: string | null;
  alt: string;
  width?: number;
  height?: number;
};

export function BrandLogo({
  logoUrl,
  alt,
  width = 100,
  height = 32,
}: BrandLogoProps) {
  const [hasError, setHasError] = useState(false);

  if (!logoUrl || hasError) {
    return <TentTree size={18} />;
  }

  return (
    <Image
      src={logoUrl}
      alt={alt}
      width={width}
      height={height}
      unoptimized
      onError={() => setHasError(true)}
    />
  );
}
