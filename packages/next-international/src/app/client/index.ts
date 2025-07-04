import 'client-only';
import type { ExplicitLocales, FlattenLocale, GetLocaleType, ImportedLocales } from 'international-types';
import type { I18nClientConfig, LocaleContext } from '../../types';
import type { Context } from 'react';
import { createContext } from 'react';
import { createI18nProviderClient } from './create-i18n-provider-client';
import { createUsei18n, createUsei18nGlobal } from '../../common/create-use-i18n';
import { createScopedUsei18n, createScopedUsei18nGlobal } from '../../common/create-use-scoped-i18n';
import { createUseChangeLocale } from './create-use-change-locale';
import { createDefineLocale } from '../../common/create-define-locale';
import { createUseCurrentLocale, createUseCurrentLocaleGlobal } from './create-use-current-locale';

// 模块级别的Context缓存
let sharedI18nClientContext: any = null;

export function createI18nClient<Locales extends ImportedLocales, OtherLocales extends ExplicitLocales | null = null>(
  locales: Locales,
  config: I18nClientConfig = {},
) {
  type TempLocale = OtherLocales extends ExplicitLocales ? GetLocaleType<OtherLocales> : GetLocaleType<Locales>;
  type Locale = TempLocale extends Record<string, string> ? TempLocale : FlattenLocale<TempLocale>;

  type LocalesKeys = OtherLocales extends ExplicitLocales ? keyof OtherLocales : keyof Locales;

  const localesKeys = Object.keys(locales) as LocalesKeys[];
  if (!sharedI18nClientContext) {
    // @ts-expect-error deep type
    sharedI18nClientContext = createContext<LocaleContext<Locale> | null>(null);
  }

  const I18nClientContext = sharedI18nClientContext as Context<LocaleContext<Locale> | null>;

  const useCurrentLocale = createUseCurrentLocale<LocalesKeys>(localesKeys, config);
  const I18nProviderClient = createI18nProviderClient<Locale>(I18nClientContext, locales, config.fallbackLocale);
  const useI18n = createUsei18n(I18nClientContext);
  const useScopedI18n = createScopedUsei18n(I18nClientContext);
  const useChangeLocale = createUseChangeLocale<LocalesKeys>(useCurrentLocale, locales, config);
  const defineLocale = createDefineLocale<Locale>();

  return {
    useI18n,
    useScopedI18n,
    I18nProviderClient,
    I18nClientContext,
    useChangeLocale,
    defineLocale,
    useCurrentLocale,
  };
}

// 导出函数用于清除缓存（测试时可能需要）
export function clearI18nClientContextCache() {
  sharedI18nClientContext = null;
}

// 导出共享Context的引用
export { sharedI18nClientContext };

export const useI18n = createUsei18nGlobal();
export const useScopedI18n = createScopedUsei18nGlobal();
export const useCurrentLocale = createUseCurrentLocaleGlobal();
