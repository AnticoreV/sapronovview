/**
 * Data for the homepage Experience timeline: every position (newest first) with its dates
 * as numbers for axes and proportional layouts, the duration, the labels the timeline
 * shows, the three strongest achievements and the technologies.
 */
import {
  employmentLabels,
  shortCompany,
  shown,
  shownAll,
  yearsLabel,
  type Position,
} from "@lib/content";
import { formatDuration, formatMonthYear } from "@lib/utils";
import type { Locale } from "@/i18n/locales";

export type TimelineItem = {
  id: string;
  role: string;
  company: string;
  location?: string;
  /** "Full-time", "Freelance", … in the page language. */
  type: string;
  freelance: boolean;
  /** "Apr 2026–Jun 2026" (spaced dash in Czech). */
  range: string;
  /** "2025–26" */
  years: string;
  /** "1 yr 4 mos" / "1 rok 4 měsíce" */
  duration: string;
  months: number;
  /** UTC milliseconds; `end` is now for a current position. */
  start: number;
  end: number;
  current: boolean;
  achievements: string[];
  shipped?: string;
  technologies: string[];
};

export function timelineItems(
  positions: Position[],
  locale: Locale,
  present: string,
): TimelineItem[] {
  const dash = locale === "cs" ? " – " : "–";
  return positions.map(({ id, data }) => {
    const end = data.endDate ?? new Date();
    const months = Math.max(
      1,
      (end.getUTCFullYear() - data.startDate.getUTCFullYear()) * 12 +
        (end.getUTCMonth() - data.startDate.getUTCMonth()) +
        1,
    );
    return {
      id,
      role: data.role,
      company: shortCompany(data.company),
      location: shown(data.location),
      type: employmentLabels[locale][data.employmentType],
      freelance: data.employmentType === "freelance" || data.employmentType === "contract",
      range: `${formatMonthYear(data.startDate, locale)}${dash}${
        data.endDate ? formatMonthYear(data.endDate, locale) : present
      }`,
      years: yearsLabel(data.startDate, data.endDate),
      duration: formatDuration(data.startDate, data.endDate, locale),
      months,
      start: data.startDate.valueOf(),
      end: end.valueOf(),
      current: !data.endDate,
      achievements: shownAll(data.achievements).slice(0, 3),
      shipped: shown(data.shipped),
      technologies: data.technologies,
    };
  });
}
