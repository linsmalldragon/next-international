import type { Context } from 'react';
import { useContext, useMemo } from 'react';
import type { BaseLocale } from 'international-types';
import type { LocaleContext } from '../types';
import { createT } from './create-t';
import { sharedI18nClientContext } from '../app/client';

export function createUsei18n<Locale extends BaseLocale>(I18nClientContext: Context<LocaleContext<Locale> | null>) {
  return function useI18n() {
    const context = useContext(I18nClientContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    return useMemo(() => createT(context, undefined), [context]);
  };
}
export function createUsei18nGlobal() {
  return function useI18n() {
    const context = useContext(sharedI18nClientContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    return useMemo(() => createT(context, undefined), [context]);
  };
}
