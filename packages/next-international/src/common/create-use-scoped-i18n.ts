import type { Context } from 'react';
import { useContext, useMemo } from 'react';
import type { BaseLocale, Scopes } from 'international-types';
import type { LocaleContext } from '../types';
import { createT } from '../common/create-t';
import { sharedI18nClientContext } from '../app/client';

export function createScopedUsei18n<Locale extends BaseLocale>(
  I18nClientContext: Context<LocaleContext<Locale> | null>,
) {
  return function useScopedI18n<Scope extends Scopes<Locale>>(scope: Scope): ReturnType<typeof createT<Locale, Scope>> {
    const context = useContext(I18nClientContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    return useMemo(() => createT(context, scope), [context, scope]);
  };
}
export function createScopedUsei18nGlobal() {
  return function useScopedI18nGlobal(scope: Scope) {
    const context = useContext(sharedI18nClientContext);

    if (!context) {
      throw new Error('`useI18n` must be used inside `I18nProvider`');
    }

    return useMemo(() => createT(context, scope), [context, scope]) as any;
  };
}
