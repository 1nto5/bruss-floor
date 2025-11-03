import type { Locale } from '@/lib/config/i18n';
import 'server-only';

const dictionaries = {
  pl: () =>
    import('@/app/dict/dmcheck/pl.json').then((module) => module.default),
  de: () =>
    import('@/app/dict/dmcheck/de.json').then((module) => module.default),
  en: () =>
    import('@/app/dict/dmcheck/en.json').then((module) => module.default),
  tl: () =>
    import('@/app/dict/dmcheck/tl.json').then((module) => module.default),
  uk: () =>
    import('@/app/dict/dmcheck/uk.json').then((module) => module.default),
  be: () =>
    import('@/app/dict/dmcheck/be.json').then((module) => module.default),
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
