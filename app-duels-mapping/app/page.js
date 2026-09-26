import { Suspense } from 'react';
import PlayersPageClient from './PlayersPageClient';
import { SITE_DESCRIPTION } from './lib/siteDescription';
import { describeView, parseViewParams } from '@/utils/view-params';

// A shared link unfurls (Slack, iMessage, social) with the view it opens, e.g.
// "Duels Mapping | 2024 · Defenders · Seattle Sounders FC". The bare URL keeps the
// site-wide title and description from layout.js.
export async function generateMetadata({ searchParams }) {
  const params = await searchParams;
  if (!params || Object.keys(params).length === 0) return {};

  const view = parseViewParams(params);
  const summary = describeView(view);
  const title = `Duels Mapping | ${summary}`;
  const description =
    view.tab === 'comparisons'
      ? `Head-to-head Schmetzer Score comparisons for the ${view.season} MLS season.`
      : `MLS Schmetzer Score rankings: ${summary}. ${SITE_DESCRIPTION}`;

  return {
    title,
    description,
    openGraph: { title, description, siteName: 'Duels Mapping' },
    // "summary" rather than the large card: opengraph-image.png is square.
    twitter: { card: 'summary', title, description },
  };
}

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayersPageClient />
    </Suspense>
  );
}
