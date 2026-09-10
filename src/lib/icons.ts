/**
 * Icon registry for content that references icons by name (e.g. hobbies).
 * Add any lucide-astro icon here to make it available in frontmatter.
 */
import {
  Award,
  Bike,
  BookOpen,
  Briefcase,
  Camera,
  Compass,
  Cpu,
  Dumbbell,
  FlaskConical,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  Mic,
  Mountain,
  Music,
  Palette,
  Plane,
  Sparkles,
  Users,
} from "lucide-astro";

export const icons = {
  Award,
  Bike,
  BookOpen,
  Briefcase,
  Camera,
  Compass,
  Cpu,
  Dumbbell,
  FlaskConical,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  Mic,
  Mountain,
  Music,
  Palette,
  Plane,
  Sparkles,
  Users,
} as const;

export type IconName = keyof typeof icons;

export function getIcon(name: string) {
  return (icons as Record<string, (typeof icons)[IconName]>)[name] ?? Sparkles;
}
