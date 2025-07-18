import { notFound, useParams } from 'next/navigation';
import { useMemo } from 'react';
import { DEFAULT_SEGMENT_NAME } from '../../common/constants';
import type { I18nClientConfig } from '../../types';
import { error } from '../../helpers/log';

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
    const params = useParams();
    const segment = params?.[segmentName ?? DEFAULT_SEGMENT_NAME];
    return segment as string;
  };
}
