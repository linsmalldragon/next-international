import type { BaseLocale, ImportedLocales, Scopes } from 'international-types';
import { createT } from '../../common/create-t';
import type { I18nServerConfig, LocaleContext } from '../../types';
import { getLocaleCache } from './get-locale-cache';
import { flattenLocale } from '../../common/flatten-locale';
import { configFallbackCache, localesCache } from './index';

let localeCache;
export function createGetScopedI18n<Locales extends ImportedLocales, Locale extends BaseLocale>(
  locales: Locales,
  config: I18nServerConfig,
) {
  if (!localeCache) {
    localeCache = new Map<string, Promise<ReturnType<typeof createT<Locale, undefined>>>>();
  }
  return async function getScopedI18n<Scope extends Scopes<Locale>>(
    scope: Scope,
  ): Promise<ReturnType<typeof createT<Locale, Scope>>> {
    const locale = await getLocaleCache();
    const cacheKey = `${locale}-${scope}`;
    const cached = localeCache.get(cacheKey);

    if (cached) {
      return (await cached) as ReturnType<typeof createT<Locale, Scope>>;
    }

    const localeFnPromise = (async () => {
      const localeModule = await locales[locale]();
      return createT(
        {
          localeContent: flattenLocale(localeModule.default),
          fallbackLocale: config.fallbackLocale ? flattenLocale(config.fallbackLocale) : undefined,
          locale,
        } as LocaleContext<Locale>,
        scope,
      );
    })();

    localeCache.set(cacheKey, localeFnPromise);

    return await localeFnPromise;
  };
}

export function createGetScopedI18nGlobal() {
  return async function getScopedI18n<Scope extends Scopes<Locale>>(
    scope: Scope,
  ): Promise<ReturnType<typeof createT<Locale, Scope>>> {
    if (!localeCache) {
      throw new Error('createGetScopedI18nGlobal set called');
    }
    const locale = await getLocaleCache();
    const cacheKey = `${locale}-${scope}`;
    const cached = localeCache.get(cacheKey);

    if (cached) {
      return (await cached) as ReturnType<typeof createT<Locale, Scope>>;
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
      scope,
    );
  };
}
