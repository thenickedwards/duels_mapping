import { Suspense } from 'react';
import PlayersPageClient from './PlayersPageClient';

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayersPageClient />
    </Suspense>
  );
}

