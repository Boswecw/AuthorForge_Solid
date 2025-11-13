// src/routes/smithy/smithy.utils.ts
import type { SceneStats } from "./smithy.types";

export function getWordCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function getCharCount(text: string): number {
  return text.length;
}

export function getParagraphCount(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  // double newlines as paragraph separator
  return trimmed.split(/\n{2,}/).length;
}

export function getReadingMinutes(words: number): number {
  if (!words) return 0;
  return Math.max(1, Math.round(words / 250)); // ~250 wpm
}

export function computeStats(text: string): SceneStats {
  const words = getWordCount(text);
  const chars = getCharCount(text);
  const paragraphs = getParagraphCount(text);
  const readingMinutes = getReadingMinutes(words);

  return { words, chars, paragraphs, readingMinutes };
}
