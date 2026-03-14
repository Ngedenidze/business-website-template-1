"use client";

import { type CSSProperties, useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { urlFor } from "@/sanity/image";
import type { SanityImageWithAlt } from "@/sanity/types";

type ImageSlideshowProps = {
  images?: SanityImageWithAlt[] | null;
  fallbackImage?: SanityImageWithAlt | null;
  fallbackLabel?: string;
  aspectRatio?: "16 / 9" | "4 / 3" | "3 / 2" | "1 / 1";
  autoplay?: boolean;
  intervalMs?: number;
  showControls?: boolean;
  sizes?: string;
  className?: string;
  priority?: boolean;
};

function sanitizeSlides(images?: SanityImageWithAlt[] | null) {
  if (!Array.isArray(images)) {
    return [] as SanityImageWithAlt[];
  }

  return images.filter((image) => Boolean(image?.asset?._ref || image?.asset?.url));
}

export function ImageSlideshow({
  images,
  fallbackImage,
  fallbackLabel = "Event photo placeholder",
  aspectRatio = "16 / 9",
  autoplay = true,
  intervalMs = 4000,
  showControls = true,
  sizes = "(max-width: 760px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className,
  priority = false,
}: ImageSlideshowProps) {
  const slides = useMemo(() => {
    const candidateSlides = sanitizeSlides(images);

    if (candidateSlides.length > 0) {
      return candidateSlides;
    }

    return fallbackImage?.asset ? [fallbackImage] : [];
  }, [images, fallbackImage]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const hasMultipleSlides = slides.length > 1;
  const visibleIndex = slides.length > 0 ? Math.min(currentIndex, slides.length - 1) : 0;

  useEffect(() => {
    if (!autoplay || isPaused || !hasMultipleSlides) {
      return;
    }

    const timer = window.setInterval(() => {
      setCurrentIndex((previous) => (previous + 1) % slides.length);
    }, intervalMs);

    return () => window.clearInterval(timer);
  }, [autoplay, hasMultipleSlides, intervalMs, isPaused, slides.length]);

  function goToNextSlide() {
    setCurrentIndex((previous) => (previous + 1) % slides.length);
  }

  function goToPreviousSlide() {
    setCurrentIndex((previous) => (previous - 1 + slides.length) % slides.length);
  }

  if (slides.length === 0) {
    return (
      <div className={`media-frame ${className ?? ""}`.trim()}>
        <div className="media-placeholder">{fallbackLabel}</div>
      </div>
    );
  }

  return (
    <div
      className={`slideshow media-frame ${className ?? ""}`.trim()}
      style={{ "--slide-aspect-ratio": aspectRatio } as CSSProperties}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
          setIsPaused(false);
        }
      }}
    >
      <div className="slideshow-viewport">
        {slides.map((slide, index) => {
          const directUrl = slide.asset?.url?.trim();
          const imageUrl = directUrl
            ? directUrl
            : slide.asset?._ref
              ? urlFor(slide).width(1800).height(1200).fit("crop").url()
              : null;
          const altText = slide.alt?.trim() || "Event rental photo";
          const isActive = index === visibleIndex;

          if (!imageUrl) {
            return null;
          }

          return (
            <div
              key={`slide-${index}`}
              className={`slideshow-slide ${isActive ? "is-active" : ""}`}
              aria-hidden={!isActive}
            >
              <Image
                src={imageUrl}
                alt={altText}
                fill
                priority={priority && index === 0}
                sizes={sizes}
              />
            </div>
          );
        })}
      </div>

      {hasMultipleSlides && showControls ? (
        <>
          <button
            type="button"
            className="slideshow-control slideshow-control-prev"
            onClick={goToPreviousSlide}
            aria-label="Show previous slide"
          >
            <ChevronLeft size={18} aria-hidden="true" />
          </button>

          <button
            type="button"
            className="slideshow-control slideshow-control-next"
            onClick={goToNextSlide}
            aria-label="Show next slide"
          >
            <ChevronRight size={18} aria-hidden="true" />
          </button>

          <div className="slideshow-dots" role="tablist" aria-label="Slide navigation">
            {slides.map((_, index) => {
              const isActive = index === visibleIndex;
              return (
                <button
                  key={`dot-${index}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`slideshow-dot ${isActive ? "is-active" : ""}`}
                  onClick={() => setCurrentIndex(index)}
                />
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
}
