// pages/api/comment.js
import { db } from '../../src/lib/firebase-admin.server';

export default async function handler(req, res) {
  try {
    // GET: 댓글 리스트 조회
    if (req.method === 'GET') {
      console.log('[comment][GET] start');

      // 쿼리 파라미터
      const { limit = 10, lastDocId = null } = req.query;

      // limit 문자열 → 숫자로 변환 + 최소/최대값 제한
      const parsedLimit = Math.min(
        100,                         // 최대 100개까지만 허용 (원하는 값으로 조정 가능)
        Math.max(1, parseInt(limit, 10) || 50) // 기본값 50
      );

      // 기본 쿼리: createdAt 내림차순
      let query = db
        .collection('comments')
        .orderBy('createdAt', 'desc');

      // lastDocId가 있으면 해당 문서 이후부터 시작
      if (lastDocId) {
        const lastDoc = await db.collection('comments').doc(lastDocId).get();
        if (lastDoc.exists) {
          query = query.startAfter(lastDoc);
        }
      }

      // limit 적용 후 실제로 가져오기
      const snap = await query.limit(parsedLimit).get();

      // 문서 → JS 객체 변환
      const items = snap.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          ...data,
        };
      });

      // 다음 페이지를 위한 cursor 정보
      const newLastDocId =
        snap.docs.length > 0
          ? snap.docs[snap.docs.length - 1].id
          : null;

      const hasMore = snap.docs.length === parsedLimit;

      console.log('[comment][GET] ok, count=', items.length);

      // 댓글 목록(1차원 배열)과 페이지네이션 메타 정보를 같이 반환
      return res.status(200).json({
        comments: items, // 1차원 배열
        lastDocId: newLastDocId,
        hasMore,
      });
    }

    // POST: 새 댓글 작성
    if (req.method === 'POST') {
      console.log('[comment][POST] body=', req.body);

      const { nicName, fromName, message } = req.body || {};

      if (!nicName || !fromName || !message) {
        return res
          .status(400)
          .json({ error: 'nicName, fromName, message 필수' });
      }

      const ref = await db.collection('comments').add({
        nicName,
        fromName,
        message,
        createdAt: new Date(),
      });

      console.log('[comment][POST] ok, id=', ref.id);

      return res.status(201).json({ id: ref.id });
    }

    // 허용되지 않은 메서드
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (err) {
    console.error('[comment][ERROR]', err?.name, err?.message, err?.stack);
    return res.status(500).json({
      error: 'internal',
      name: err?.name,
      message: err?.message,
    });
  }
}
