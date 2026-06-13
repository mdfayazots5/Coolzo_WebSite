/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { apiConfig } from '../config/apiConfig';
import type {
  ServiceCategoryLookupResponse,
  ServiceLookupResponse,
  AcTypeLookupResponse,
  TonnageLookupResponse,
  BrandLookupResponse,
} from '../types/catalog';
import type { AmcPlanResponse } from '../types/amc';

/** Public catalog masters bundled into the snapshot (mirrors backend SnapshotMastersDto). */
export interface SnapshotMasters {
  serviceCategories?: ServiceCategoryLookupResponse[];
  services?: ServiceLookupResponse[];
  acTypes?: AcTypeLookupResponse[];
  tonnages?: TonnageLookupResponse[];
  brands?: BrandLookupResponse[];
  amcPlans?: AmcPlanResponse[];
}

export interface SnapshotImage {
  url: string;
  alt: string;
  variants: Record<string, string>;
}

export interface SnapshotBlock {
  key: string;
  title: string;
  summary: string;
  content: string;
  previewImageUrl: string;
  sortOrder: number;
}

/** Promotional banner bundled into the snapshot (mirrors backend SnapshotBannerDto). */
export interface SnapshotBanner {
  title: string;
  subtitle: string;
  imageUrl: string;
  redirectUrl: string;
  displayArea: string;
  sortOrder: number;
}

export interface ContentSnapshot {
  version: number;
  publishedAtUtc: string;
  checksum: string;
  theme: Record<string, string>;
  masters: SnapshotMasters;
  content: { blocks: SnapshotBlock[]; banners: SnapshotBanner[]; faqs: unknown[] };
  images: Record<string, SnapshotImage>;
}

const CACHE_KEY = 'coolzo.cms.snapshot';
const SNAPSHOT_PATH = '/cms/snapshot-latest.json';

/** Relative object URLs (dev, no CDN base) are resolved against the API origin. */
export function resolveAssetUrl(url: string): string {
  if (!url) {
    return url;
  }
  return /^https?:\/\//i.test(url) ? url : `${apiConfig.BASE_URL}${url}`;
}

export function readCachedSnapshot(): ContentSnapshot | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? (JSON.parse(raw) as ContentSnapshot) : null;
  } catch {
    return null;
  }
}

/**
 * Bucket-down fallback: when the static snapshot file is unreachable, resolve the active version
 * via the cached manifest API and read the snapshot through the API (served from IMemoryCache /
 * tblPublishedSnapshot). Returns the envelope-unwrapped snapshot.
 */
async function fetchSnapshotViaApi(): Promise<ContentSnapshot | null> {
  try {
    const manifestResponse = await fetch(`${apiConfig.BASE_URL}/api/cms/snapshot/manifest`, { cache: 'no-cache' });
    if (!manifestResponse.ok) {
      return null;
    }
    const manifestEnvelope = await manifestResponse.json();
    const version: number | undefined = manifestEnvelope?.data?.version;
    if (!version) {
      return null;
    }
    const snapshotResponse = await fetch(`${apiConfig.BASE_URL}/api/cms/snapshot/${version}`, { cache: 'no-cache' });
    if (!snapshotResponse.ok) {
      return null;
    }
    const snapshotEnvelope = await snapshotResponse.json();
    return (snapshotEnvelope?.data as ContentSnapshot) ?? null;
  } catch {
    return null;
  }
}

/**
 * Fetches the published snapshot directly from object storage (static file — no DB / no per-request
 * API). Cache-busted so a freshly published version is picked up; result cached in localStorage for
 * instant subsequent paints. Falls back to the API (Redis-less IMemoryCache + DB) if the static
 * file is unreachable, so the portal degrades gracefully when the bucket/CDN is unavailable.
 */
export async function fetchSnapshot(): Promise<ContentSnapshot | null> {
  let snapshot: ContentSnapshot | null = null;

  try {
    const response = await fetch(`${apiConfig.SNAPSHOT_BASE_URL}${SNAPSHOT_PATH}?t=${Date.now()}`, {
      cache: 'no-cache',
    });
    if (response.ok) {
      snapshot = (await response.json()) as ContentSnapshot;
    }
  } catch {
    snapshot = null;
  }

  if (!snapshot) {
    snapshot = await fetchSnapshotViaApi();
  }

  if (snapshot) {
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(snapshot));
    } catch {
      // Ignore quota/serialization failures; in-memory snapshot still works.
    }
  }

  return snapshot;
}

/**
 * Returns the bundled public catalog masters from the snapshot, or null when the active snapshot
 * predates masters (i.e. was published before masters were added — serviceCategories absent) so the
 * caller falls back to the live booking-lookup API. Reads the cached snapshot synchronously first,
 * then revalidates against the published file.
 */
export async function getSnapshotMasters(): Promise<SnapshotMasters | null> {
  const cached = readCachedSnapshot();
  if (cached?.masters && Array.isArray(cached.masters.serviceCategories)) {
    return cached.masters;
  }

  const fresh = await fetchSnapshot();
  if (fresh?.masters && Array.isArray(fresh.masters.serviceCategories)) {
    return fresh.masters;
  }

  return null;
}
