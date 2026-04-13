"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Megaphone, Sparkles, Tag } from "lucide-react";
import ProductCarousel from "@/components/shared/product/product-carousel";

type HeroSlide = {
  src: string;
  heading: string;
  footnote?: string;
  href?: string;
};

const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.12,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

const HomePromoBannerClient = ({
  featuredTitle,
  featuredSubtitle,
  featuredDescription,
  ctaHref,
  ctaLabel,
  slides,
}: {
  featuredTitle: string;
  featuredSubtitle?: string;
  featuredDescription: string;
  ctaHref: string;
  ctaLabel: string;
  slides: HeroSlide[];
}) => {
  return (
    <motion.section
      className="w-full"
      variants={containerVariants}
      initial="hidden"
      animate="show"
    >
      <div className="grid grid-cols-1 overflow-hidden rounded-none md:grid-cols-[440px_minmax(0,1fr)] lg:grid-cols-[520px_minmax(0,1fr)]">
        <motion.div
          variants={itemVariants}
          className="relative overflow-hidden bg-[#e31837] px-8 py-10 text-white md:px-12 md:py-14"
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-white/10"
            animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.6, 0.35] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -left-12 bottom-8 h-36 w-36 rounded-full bg-orange-300/20"
            animate={{ y: [0, -10, 0], opacity: [0.45, 0.7, 0.45] }}
            transition={{ duration: 4.8, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex items-start gap-4">
            <motion.div variants={itemVariants} className="mt-1 hidden sm:block">
              <Tag className="h-14 w-14" />
            </motion.div>
            <div>
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 rounded-full border border-white/30 px-3 py-1 text-xs font-bold uppercase tracking-wider"
              >
                <Megaphone className="h-3.5 w-3.5" />
                Featured Offer
              </motion.div>

              <motion.h2
                variants={itemVariants}
                className="mt-5 whitespace-pre-line text-3xl font-extrabold uppercase leading-[0.95] tracking-tight md:text-4xl"
              >
                {featuredTitle}
              </motion.h2>

              {featuredSubtitle && (
                <motion.p
                  variants={itemVariants}
                  className="mt-3 text-sm font-semibold uppercase tracking-wide md:text-base"
                >
                  {featuredSubtitle}
                </motion.p>
              )}

              <motion.p
                variants={itemVariants}
                className="mt-5 max-w-[34ch] text-sm text-white/90 md:text-base"
              >
                {featuredDescription}
              </motion.p>

              <motion.div variants={itemVariants} className="mt-7 inline-block">
                <motion.div
                  whileHover={{ y: -2, scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Link
                    href={ctaHref}
                    className="inline-flex items-center gap-1.5 rounded-md bg-white px-4 py-2 font-bold text-[#e31837] transition-colors hover:bg-white/90"
                  >
                    {ctaLabel}
                    <Sparkles className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <ProductCarousel
            variant="hero"
            slides={slides}
            fullBleed={false}
            className="h-full"
            autoplayDelay={3500}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default HomePromoBannerClient;
