import 'server-only';
import type { Locale } from '@/lib/config/i18n';

const dictionaries = {
  pl: () => import('@/app/dict/oven/pl.json').then((module) => module.default),
  de: () => import('@/app/dict/oven/de.json').then((module) => module.default),
  en: () => import('@/app/dict/oven/en.json').then((module) => module.default),
  tl: () => import('@/app/dict/oven/tl.json').then((module) => module.default),
  uk: () => import('@/app/dict/oven/uk.json').then((module) => module.default),
  be: () => import('@/app/dict/oven/be.json').then((module) => module.default),
};

export const getDictionary = async (locale: Locale) => {
  if (locale === 'en') {
    return dictionaries.en();
  }
  if (locale === 'de') {
    return dictionaries.de();
  }
  if (locale === 'tl') {
    return dictionaries.tl();
  }
  if (locale === 'uk') {
    return dictionaries.uk();
  }
  if (locale === 'be') {
    return dictionaries.be();
  }
  return dictionaries.pl();
};

export type Dictionary = Awaited<ReturnType<typeof getDictionary>>;