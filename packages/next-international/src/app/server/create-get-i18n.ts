import type { BaseLocale, ImportedLocales } from 'international-types';
import { createT } from '../../common/create-t';
import { flattenLocale } from '../../common/flatten-locale';
import type { I18nServerConfig, LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';
import { localesCache, configFallbackCache } from './index';

let localeCache;
export function createGetI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(
  locales: Locales,
  config: I18nServerConfig,
) {
  if (!localeCache) {
    localeCache = new Map<string, Promise<ReturnType<typeof createT<Locale, undefined>>>>();
  }

  return async function getI18n() {
    const locale = await getLocaleCache();
    const cached = localeCache.get(locale);

    if (cached) {
      return await cached;
    }

    const localeFnPromise = (async () => {
      const localeModule = await locales[locale]();
      return createT(
        {
          localeContent: flattenLocale(localeModule.default),
          fallbackLocale: config.fallbackLocale ? flattenLocale(config.fallbackLocale) : undefined,
          locale,
        } as LocaleContext<Locale>,
        undefined,
      );
    })();

    localeCache.set(locale, localeFnPromise);

    return await localeFnPromise;
  };
}

export function createGetI18nGlobal() {
  return async function getI18n() {
    const locale = await getLocaleCache();
    const cached = localeCache.get(locale);
    if (cached) {
      return await cached;
    }
    if (!localeCache) {
      throw new Error('createI18nServer set called');
    }
    const localeModule = await localesCache[locale]();
    return createT(
      {
        localeContent: flattenLocale(localeModule.default),
        fallbackLocale: configFallbackCache ? flattenLocale(configFallbackCache) : undefined,
        locale,
      } as LocaleContext<Locale>,
      undefined,
    ) as any;
  };
}
