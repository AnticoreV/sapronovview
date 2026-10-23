/**
 * Studio portraits of Ivan. `studio` = light-grey studio background (it sits on the
 * light theme as it is); `cutout` = background removed, used in the dark theme on a
 * sunken well. Sources live in src/assets/portraits and are optimised by <Picture>.
 */
import type { ImageMetadata } from "astro";
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
  short: string;
  studio: ImageMetadata;
  cutout: ImageMetadata;
  alt: string;
};

export const portraits: Portrait[] = [
  {
    id: "turtleneck",
    short: "Turtleneck",
    studio: studioTurtleneck,
    cutout: cutoutTurtleneck,
    alt: "Ivan Sapronov in a grey turtleneck, arms crossed, looking at the camera",
  },
  {
    id: "green",
    short: "Green",
    studio: studioGreen,
    cutout: cutoutGreen,
    alt: "Ivan Sapronov smiling in a green sweater, arms crossed",
  },
  {
    id: "black",
    short: "Black",
    studio: studioBlack,
    cutout: cutoutBlack,
    alt: "Ivan Sapronov seated in a black sweater, leaning forward",
  },
  {
    id: "white",
    short: "White",
    studio: studioWhite,
    cutout: cutoutWhite,
    alt: "Ivan Sapronov in a white T-shirt, in profile, looking to the left",
  },
];

export const defaultPortrait = portraits[0]!;

/** A portrait by id (the homepage card uses the green sweater, as on the artboard). */
export const portraitById = (id: Portrait["id"]): Portrait =>
  portraits.find((p) => p.id === id) ?? defaultPortrait;
