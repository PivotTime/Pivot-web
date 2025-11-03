// app/gpArchive/page.jsx
import 'server-only';

export const revalidate = 0;           // 항상 최신 (또는 dynamic='force-dynamic')
export const dynamic = 'force-dynamic';

async function getSubmissions() {
  // 경로는 프로젝트 구조에 맞게 조정하세요.
  // 예: '@/lib/firebase-admin.server.js'
  const { db } = await import('@/lib/firebase-admin.server.js');

  const snap = await db
    .collection('pivot-submissions')
    .orderBy('createdAt', 'desc')
    .limit(8)
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
      trajectories: data.trajectories ?? [], // trajectories 추가
    };
  });

  return submissions;
}

import ArchiveClient from './gpArchive';

export default async function Page() {
  try {
    const submissions = await getSubmissions();
    return <ArchiveClient submissions={submissions} />;
  } catch (e) {
    // 서버에서 에러를 문자열로 내려줌 (클라에서 표시)
    return <ArchiveClient error={`데이터 로드 실패: ${e?.message ?? e}`} submissions={[]} />;
  }
}
