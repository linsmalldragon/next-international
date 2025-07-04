import 'server-only';

import type { ExplicitLocales, FlattenLocale, GetLocaleType, ImportedLocales } from 'international-types';
import type { I18nServerConfig } from '../../types';
import { createGetCurrentLocale } from './create-get-current-locale';
import { createGetI18n, createGetI18nGlobal } from './create-get-i18n';
import { createGetScopedI18n, createGetScopedI18nGlobal } from './create-get-scoped-i18n';
import { createGetStaticParams } from './create-get-static-params';

export { setStaticParamsLocale } from './get-locale-cache';

export let localesCache: any;
export let configFallbackCache: any;
export function createI18nServer<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
  config: I18nServerConfig = {},
) {
  type TempLocale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type Locale = TempLocale extends Record<string, string> ? TempLocale : FlattenLocale<TempLocale>;

  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  localesCache = locales;
  configFallbackCache = config.fallbackLocale;

  // @ts-expect-error deep type
  const getI18n = createGetI18n<Locales, Locale>(locales, config);
  const getScopedI18n = createGetScopedI18n<Locales, Locale>(locales, config);
  const getCurrentLocale = createGetCurrentLocale<LocalesKeys>();
  const getStaticParams = createGetStaticParams(locales, config);

  return {
    getI18n,
    getScopedI18n,
    getCurrentLocale,
    getStaticParams,
  };
}
export const getI18n = createGetI18nGlobal();
export const getScopedI18n = createGetScopedI18nGlobal();
