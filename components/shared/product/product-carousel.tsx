"use client";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type HeroSlide = {
  src: string;
  heading: string;
  footnote?: string;
  href?: string;
};

type ProductCarouselProps =
  | {
      variant?: "product";
      data: Product[];
      className?: string;
      fullBleed?: boolean;
      autoplayDelay?: number;
    }
  | {
      variant: "hero";
      slides: HeroSlide[];
      className?: string;
      fullBleed?: boolean;
      autoplayDelay?: number;
    };

const ProductCarousel = (props: ProductCarouselProps) => {
  const isHero = props.variant === "hero";
  const autoplayDelay = props.autoplayDelay ?? (isHero ? 3500 : 2000);
  const fullBleed = props.fullBleed ?? !isHero;

  return (
    <Carousel
      className={cn(
        !isHero
          ? fullBleed
            ? "mb-12 w-screen max-w-none ml-[calc(50%-50vw)]"
            : "mb-12 w-full"
          : "h-full w-full",
        props.className
      )}
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: autoplayDelay,
          stopOnInteraction: true,
          stopOnMouseEnter: true,
        }),
      ]}
    >
      <CarouselContent className="-ml-0">
        {props.variant === "hero"
          ? props.slides.map((slide, index) => (
              <CarouselItem key={slide.src} className="pl-0">
                {slide.href ? (
                  <Link href={slide.href}>
                    <div className="relative min-h-[260px] md:min-h-[360px]">
                      <Image
                        src={slide.src}
                        alt="Hero banner"
                        fill
                        priority={index === 0}
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 70vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                      <div className="absolute bottom-8 left-8 right-8">
                        <div className="max-w-xl whitespace-pre-line text-white uppercase font-black tracking-tight leading-[0.95] text-4xl md:text-5xl">
                          {slide.heading}
                        </div>
                        {slide.footnote && (
                          <div className="mt-3 text-white/80 text-xs font-semibold uppercase tracking-widest">
                            {slide.footnote}
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ) : (
                  <div className="relative min-h-[260px] md:min-h-[360px]">
                    <Image
                      src={slide.src}
                      alt="Hero banner"
                      fill
                      priority={index === 0}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 70vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                    <div className="absolute bottom-8 left-8 right-8">
                      <div className="max-w-xl whitespace-pre-line text-white uppercase font-black tracking-tight leading-[0.95] text-4xl md:text-5xl">
                        {slide.heading}
                      </div>
                      {slide.footnote && (
                        <div className="mt-3 text-white/80 text-xs font-semibold uppercase tracking-widest">
                          {slide.footnote}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </CarouselItem>
            ))
          : props.data.map((product) => (
              <CarouselItem key={product.id} className="pl-0">
                <Link href={`/product/${product.slug}`}>
                  <div className="relative mx-auto">
                    <Image
                      src={product.banner!}
                      alt={product.name}
                      height="0"
                      width="0"
                      className="w-full h-auto"
                      sizes="100vw"
                    />
                  </div>
                </Link>
              </CarouselItem>
            ))}
      </CarouselContent>
      <CarouselPrevious className="left-4 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
      <CarouselNext className="right-4 border-white/30 bg-white/10 text-white hover:bg-white/20 hover:text-white" />
    </Carousel>
  );
};

export default ProductCarousel;
