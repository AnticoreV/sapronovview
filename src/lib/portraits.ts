/**
 * Studio portraits of Ivan, one photo per outfit, used in both themes (the light studio
 * background reads as a framed photo on the dark card too). The masters in
 * src/assets/portraits are JPEG q95, 4:4:4, sRGB, made from the original PNGs in
 * Docs/Avatars; ProfileCard crops and encodes them at build. The background-removed
 * cut-outs are gone from the pages (their hair edges kept a light fringe); only the
 * share card still composites cutout-green.webp, on its light background.
 */
import type { ImageMetadata } from "astro";
import type { Locale } from "@/i18n/locales";
import turtleneck from "@/assets/portraits/turtleneck.jpg";
import green from "@/assets/portraits/green.jpg";
import black from "@/assets/portraits/black.jpg";
import white from "@/assets/portraits/white.jpg";

export type Portrait = {
  id: "turtleneck" | "green" | "black" | "white";
  /** Label in the portrait switch on /about. */
  short: Record<Locale, string>;
  photo: ImageMetadata;
  alt: Record<Locale, string>;
};

export const portraits: Portrait[] = [
  {
    id: "turtleneck",
    short: { en: "Turtleneck", cs: "Rolák" },
    photo: turtleneck,
    alt: {
      en: "Ivan Sapronov in a grey turtleneck, arms crossed, looking at the camera",
      cs: "Ivan Sapronov v šedém roláku se zkříženýma rukama, dívá se do objektivu",
    },
  },
  {
    id: "green",
    short: { en: "Green", cs: "Zelený" },
    photo: green,
    alt: {
      en: "Ivan Sapronov smiling in a green sweater, arms crossed",
      cs: "Ivan Sapronov v zeleném svetru se usmívá, ruce má zkřížené",
    },
  },
  {
    id: "black",
    short: { en: "Black", cs: "Černý" },
    photo: black,
    alt: {
      en: "Ivan Sapronov seated in a black sweater, leaning forward",
      cs: "Ivan Sapronov v černém svetru sedí a naklání se dopředu",
    },
  },
  {
    id: "white",
    short: { en: "White", cs: "Bílý" },
    photo: white,
    alt: {
      en: "Ivan Sapronov in a white T-shirt, in profile, looking to the left",
      cs: "Ivan Sapronov v bílém tričku z profilu, dívá se doleva",
    },
  },
];

export const defaultPortrait = portraits[0]!;

/** A portrait by id (the homepage card and /about open on the turtleneck). */
export const portraitById = (id: Portrait["id"]): Portrait =>
  portraits.find((p) => p.id === id) ?? defaultPortrait;
