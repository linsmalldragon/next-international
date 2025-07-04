import { describe, expect, it, beforeEach } from 'vitest';
import { createI18nClient, clearI18nClientContextCache, sharedI18nClientContext } from '../src/app/client';
import en from './utils/en';

describe('SharedI18nClientContext', () => {
  beforeEach(() => {
    // 清除缓存以确保每个测试都从干净的状态开始
    clearI18nClientContextCache();
  });

  it('should use the same context instance across multiple createI18nClient calls', () => {
    // 第一次调用 createI18nClient
    const client1 = createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    // 第二次调用 createI18nClient
    const client2 = createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    // 验证两次调用返回的Context是同一个实例
    expect(client1.I18nClientContext).toBe(client2.I18nClientContext);
    expect(client1.I18nClientContext).toBe(sharedI18nClientContext);
    expect(client2.I18nClientContext).toBe(sharedI18nClientContext);
  });

  it('should work with different locale configurations', () => {
    // 使用不同的配置调用 createI18nClient
    const client1 = createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const client2 = createI18nClient({
      en: () => import('./utils/en'),
      es: () => import('./utils/en'), // 使用不同的locale
    });

    // 验证即使配置不同，Context仍然是同一个
    expect(client1.I18nClientContext).toBe(client2.I18nClientContext);
    expect(client1.I18nClientContext).toBe(sharedI18nClientContext);
  });

  it('should work with different client configurations but same locales', () => {
    // 使用相同的locale但不同的client配置
    const client1 = createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const client2 = createI18nClient(
      {
        en: () => import('./utils/en'),
        fr: () => import('./utils/fr'),
      },
      {
        segmentName: 'lang',
        fallbackLocale: en,
      },
    );

    // 验证相同的locale配置使用相同的Context
    expect(client1.I18nClientContext).toBe(client2.I18nClientContext);
    expect(client1.I18nClientContext).toBe(sharedI18nClientContext);
  });

  it('should clear cache when clearI18nClientContextCache is called', () => {
    // 第一次调用
    const client1 = createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    const firstContext = client1.I18nClientContext;

    // 清除缓存
    clearI18nClientContextCache();

    // 第二次调用（缓存已清除）
    const client2 = createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    // 验证清除缓存后创建了新的Context实例
    expect(client2.I18nClientContext).not.toBe(firstContext);
    expect(client2.I18nClientContext).toBe(sharedI18nClientContext);
  });

  it('should export sharedI18nClientContext', () => {
    // 验证 sharedI18nClientContext 被正确导出
    expect(sharedI18nClientContext).toBeDefined();

    // 创建一个client来初始化context
    createI18nClient({
      en: () => import('./utils/en'),
      fr: () => import('./utils/fr'),
    });

    // 验证context已被创建
    expect(sharedI18nClientContext).not.toBe(null);
    expect(typeof sharedI18nClientContext).toBe('object');
    expect(sharedI18nClientContext.Provider).toBeDefined();
    expect(sharedI18nClientContext.Consumer).toBeDefined();
  });
});
