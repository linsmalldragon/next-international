import { notFound, useParams } from 'next/navigation';
import type { BaseLocale } from 'international-types';
import { createContext, useContext, useMemo } from 'react';
import { DEFAULT_SEGMENT_NAME } from '../../common/constants';
import type { I18nClientConfig, LocaleContext } from '../../types';
import { error } from '../../helpers/log';
import { sharedI18nClientContext } from './index';

const emptyLocaleContext = createContext<LocaleContext<BaseLocale> | null>(null);

export function createUseCurrentLocale<LocalesKeys>(locales: LocalesKeys[], config: I18nClientConfig) {
  return function useCurrentLocale() {
    const params = useParams();
    const segment = params?.[config.segmentName ?? DEFAULT_SEGMENT_NAME];

    return useMemo(() => {
      for (const locale of locales) {
        if (segment === locale) {
          return locale;
        }
      }

      error(`Locale "${segment}" not found in locales (${locales.join(', ')}), returning "notFound()"`);
      notFound();
    }, [segment]);
  };
}

export function createUseCurrentLocaleGlobal() {
  return function useCurrentLocaleGlobal(segmentName?: string): string {
    const active = useContext<LocaleContext<BaseLocale> | null>(sharedI18nClientContext ?? emptyLocaleContext);
    const params = useParams();
    const segment = params?.[segmentName ?? DEFAULT_SEGMENT_NAME];
    if (segmentName === undefined && active) return active.locale;
    return segment as string;
  };
}
