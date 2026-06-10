/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useContent } from '../contexts/ContentContext';

interface SnapshotImageProps {
  /** Stable "page.slot" key, e.g. "home.hero". */
  slotKey: string;
  /** Shown until/unless an admin-managed image exists for this slot. */
  fallbackSrc: string;
  alt: string;
  className?: string;
  loading?: 'lazy' | 'eager';
}

/**
 * Renders an admin-managed screen image (with per-breakpoint variants) for the given slot,
 * falling back to the bundled default when no image has been published. Never a broken image.
 */
export default function SnapshotImage({ slotKey, fallbackSrc, alt, className, loading = 'lazy' }: SnapshotImageProps) {
  const { getImage } = useContent();
  const image = getImage(slotKey);

  if (!image?.url) {
    return <img src={fallbackSrc} alt={alt} className={className} loading={loading} />;
  }

  const desktop = image.variants.desktop ?? image.url;
  const tablet = image.variants.tablet;
  const mobile = image.variants.mobile;

  return (
    <picture>
      {mobile && <source media="(max-width: 640px)" srcSet={mobile} />}
      {tablet && <source media="(max-width: 1024px)" srcSet={tablet} />}
      <img src={desktop} alt={image.alt || alt} className={className} loading={loading} />
    </picture>
  );
}
