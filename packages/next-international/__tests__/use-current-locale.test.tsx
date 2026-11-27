import React from 'react';
import { expect, it, vi } from 'vitest';
import { createI18nClient, useCurrentLocale } from '../src/app/client';
import { render, screen } from './utils';
import en from './utils/en';

vi.mock('next/navigation', () => ({ useParams: () => ({ locale: 'en', lang: 'en' }) }));

it('reads changes to the rendered locale without a route change', () => {
  const { I18nClientContext } = createI18nClient({
    en: () => import('./utils/en'),
    fr: () => import('./utils/fr'),
  });

  function Probe() {
    const locale = useCurrentLocale();
    const routedLocale = useCurrentLocale('lang');
    return <p>{locale} / {routedLocale}</p>;
  }

  const withLocale = (locale: string) => (
    <I18nClientContext.Provider value={{ locale, localeContent: en }}>
      <Probe />
    </I18nClientContext.Provider>
  );
  const screenResult = render(withLocale('fr'));
  expect(screen.getByText('fr / en')).toBeInTheDocument();
  screenResult.rerender(withLocale('en'));
  expect(screen.getByText('en / en')).toBeInTheDocument();
  screenResult.rerender(<Probe />);
  expect(screen.getByText('en / en')).toBeInTheDocument();
});
