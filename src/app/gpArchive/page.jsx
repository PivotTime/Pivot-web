// app/gpArchive/page.jsx
import 'server-only';

export const revalidate = 0;           // 항상 최신 (또는 dynamic='force-dynamic')
export const dynamic = 'force-dynamic';

async function getSubmissions(initialLimit = 5) { // Add initialLimit parameter
  const { db } = await import('../../lib/firebase-admin.server');

  const snap = await db
    .collection('pivot-submissions')
    .orderBy('createdAt', 'desc')
    .limit(initialLimit) // Use initialLimit
    .get();

  const submissions = snap.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name: data.name ?? 'Unknown',
      tags: data.tags ?? [],
      createdAt:
        data.createdAt && data.createdAt.toDate
          ? data.createdAt.toDate().toISOString()
          : data.createdAt ?? null,
      objects: data.objects ?? [],
      trajectories: data.trajectories ?? [],
    };
  });

  const lastDocId = snap.docs.length > 0 ? snap.docs[snap.docs.length - 1].id : null;
  const hasMore = snap.docs.length === initialLimit; // Check if more items might exist

  return { submissions, lastDocId, hasMore }; // Return lastDocId and hasMore
}

import ArchiveClient from './gpArchive';

export default async function Page() {
  try {
    const { submissions, lastDocId, hasMore } = await getSubmissions(); // Destructure returned object
    return <ArchiveClient submissions={submissions} initialLastDocId={lastDocId} initialHasMore={hasMore} />;
  } catch (e) {
    return <ArchiveClient error={`데이터 로드 실패: ${e?.message ?? e}`} submissions={[]} initialLastDocId={null} initialHasMore={false} />;
  }
}
