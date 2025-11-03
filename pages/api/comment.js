// pages/api/comment.js
import { db } from '../../src/lib/firebase-admin.server';

export default async function handler(req, res) {
  try {
    if (req.method === 'GET') {
      console.log('[comment][GET] start');
      const snap = await db.collection('comments').orderBy('createdAt', 'desc').get();
      const items = snap.docs.map(d => ({ id: d.id, ...d.data() }));

      // 4개의 열로 나누기
      const columns = [[], [], [], []];
      items.forEach(item => {
        // 가장 짧은 열을 찾아서 아이템 추가
        const shortestColumn = columns.reduce((shortest, current) => 
          current.length < shortest.length ? current : shortest, 
          columns[0]
        );
        shortestColumn.push(item);
      });

      console.log('[comment][GET] ok, count=', items.length);
      return res.status(200).json(columns); // ← 4개 열이 담긴 2D 배열
    }

    if (req.method === 'POST') {
      console.log('[comment][POST] body=', req.body);
      const { nicName, fromName, message } = req.body || {};
      if (!nicName || !fromName || !message) {
        return res.status(400).json({ error: 'nicName, fromName, message 필수' });
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

    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).json({ error: 'Method Not Allowed' }); // ← JSON
  } catch (err) {
    console.error('[comment][ERROR]', err?.name, err?.message, err?.stack);
    return res.status(500).json({
      error: 'internal',
      name: err?.name,
      message: err?.message,
    }); // ← JSON
  }
}
