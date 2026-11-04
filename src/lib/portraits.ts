/**
 * Studio portraits of Ivan. `studio` = light-grey studio background (it sits on the
 * light theme as it is); `cutout` = background removed, used in the dark theme on a
 * sunken well. Sources live in src/assets/portraits and are optimised by <Picture>.
 */
import type { ImageMetadata } from "astro";
import type { Locale } from "@/i18n/locales";
import studioTurtleneck from "@/assets/portraits/studio-turtleneck.jpg";
import studioGreen from "@/assets/portraits/studio-green.jpg";
import studioBlack from "@/assets/portraits/studio-black.jpg";
import studioWhite from "@/assets/portraits/studio-white.jpg";
import cutoutTurtleneck from "@/assets/portraits/cutout-turtleneck.webp";
import cutoutGreen from "@/assets/portraits/cutout-green.webp";
import cutoutBlack from "@/assets/portraits/cutout-black.webp";
import cutoutWhite from "@/assets/portraits/cutout-white.webp";

export type Portrait = {
  id: "turtleneck" | "green" | "black" | "white";
  /** Label in the portrait switch on /about. */
  short: Record<Locale, string>;
  studio: ImageMetadata;
  cutout: ImageMetadata;
  alt: Record<Locale, string>;
};

export const portraits: Portrait[] = [
  {
    id: "turtleneck",
    short: { en: "Turtleneck", cs: "Rolák" },
    studio: studioTurtleneck,
    cutout: cutoutTurtleneck,
    alt: {
      en: "Ivan Sapronov in a grey turtleneck, arms crossed, looking at the camera",
      cs: "Ivan Sapronov v šedém roláku se zkříženýma rukama, dívá se do objektivu",
    },
  },
  {
    id: "green",
    short: { en: "Green", cs: "Zelený" },
    studio: studioGreen,
    cutout: cutoutGreen,
    alt: {
      en: "Ivan Sapronov smiling in a green sweater, arms crossed",
      cs: "Ivan Sapronov v zeleném svetru se usmívá, ruce má zkřížené",
    },
  },
  {
    id: "black",
    short: { en: "Black", cs: "Černý" },
    studio: studioBlack,
    cutout: cutoutBlack,
    alt: {
      en: "Ivan Sapronov seated in a black sweater, leaning forward",
      cs: "Ivan Sapronov v černém svetru sedí a naklání se dopředu",
    },
  },
  {
    id: "white",
    short: { en: "White", cs: "Bílý" },
    studio: studioWhite,
    cutout: cutoutWhite,
    alt: {
      en: "Ivan Sapronov in a white T-shirt, in profile, looking to the left",
      cs: "Ivan Sapronov v bílém tričku z profilu, dívá se doleva",
    },
  },
];

export const defaultPortrait = portraits[0]!;

/** A portrait by id (the hero uses the green sweater, the homepage card the turtleneck). */
export const portraitById = (id: Portrait["id"]): Portrait =>
  portraits.find((p) => p.id === id) ?? defaultPortrait;
