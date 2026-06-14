/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  ContentSnapshot,
  SnapshotBanner,
  SnapshotBlock,
  SnapshotImage,
  fetchSnapshot,
  readCachedSnapshot,
  resolveAssetUrl,
} from '../services/snapshotService';

interface ContentContextValue {
  snapshot: ContentSnapshot | null;
  isLoaded: boolean;
  /** Admin-published brand logo (theme.logoUrl), resolved to an absolute URL, or null when unset. */
  logoUrl: string | null;
  /** Returns a screen image (URLs resolved to absolute) by "page.slot" key, or null. */
  getImage: (key: string) => SnapshotImage | null;
  /** Returns a content block by its stable key, or null. */
  getBlock: (key: string) => SnapshotBlock | null;
  /**
   * Returns published promotional banners (imageUrl resolved to absolute), sorted by sortOrder.
   * Pass `area` to filter by displayArea (e.g. "Home"). Empty array when none are published.
   */
  getBanners: (area?: string) => SnapshotBanner[];
}

const ContentContext = createContext<ContentContextValue | undefined>(undefined);

/** Maps snapshot theme tokens to the portal's Tailwind CSS variables. */
const THEME_CSS_VAR_MAP: Record<string, string> = {
  'theme.color.primary': '--color-brand-navy',
  'theme.color.accent': '--color-brand-gold',
  'theme.color.background': '--color-brand-cream',
  'theme.color.textPrimary': '--color-brand-black',
};

function applyTheme(theme: Record<string, string>): void {
  const root = document.documentElement;

  Object.entries(THEME_CSS_VAR_MAP).forEach(([token, cssVar]) => {
    const value = theme[token];
    if (value) {
      root.style.setProperty(cssVar, value);
    }
  });

  const fontFamily = theme['theme.font.family'];
  if (fontFamily) {
    root.style.setProperty('--font-sans', `"${fontFamily}", ui-sans-serif, system-ui, sans-serif`);
  }
}

export function ContentProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<ContentSnapshot | null>(() => readCachedSnapshot());
  const [isLoaded, setIsLoaded] = useState(false);

  // Apply cached theme immediately (avoids a flash of default theme).
  useEffect(() => {
    if (snapshot?.theme) {
      applyTheme(snapshot.theme);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Revalidate against the published static snapshot on mount.
  useEffect(() => {
    let cancelled = false;
    void fetchSnapshot().then((fresh) => {
      if (cancelled) {
        return;
      }
      if (fresh) {
        setSnapshot(fresh);
        applyTheme(fresh.theme);
      }
      setIsLoaded(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo<ContentContextValue>(() => {
    const imageIndex = snapshot?.images ?? {};
    const blockIndex = new Map((snapshot?.content.blocks ?? []).map((block) => [block.key, block]));
    const banners = snapshot?.content.banners ?? [];

    const rawLogoUrl = snapshot?.theme?.['theme.logoUrl']?.trim();

    return {
      snapshot,
      isLoaded,
      logoUrl: rawLogoUrl ? resolveAssetUrl(rawLogoUrl) : null,
      getImage: (key) => {
        const image = imageIndex[key];
        if (!image) {
          return null;
        }
        const variants: Record<string, string> = {};
        Object.entries(image.variants).forEach(([breakpoint, url]) => {
          variants[breakpoint] = resolveAssetUrl(url);
        });
        return { url: resolveAssetUrl(image.url), alt: image.alt, variants };
      },
      getBlock: (key) => blockIndex.get(key) ?? null,
      getBanners: (area) =>
        banners
          .filter((banner) => !area || banner.displayArea === area)
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((banner) => ({ ...banner, imageUrl: resolveAssetUrl(banner.imageUrl) })),
    };
  }, [snapshot, isLoaded]);

  return <ContentContext.Provider value={value}>{children}</ContentContext.Provider>;
}

export function useContent(): ContentContextValue {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
}
