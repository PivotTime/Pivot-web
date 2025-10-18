'use client';
import { useEffect, useRef, useState } from 'react';

export default function GuestBook() {
  const [allComment, setAllComment] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/comment', { cache: 'no-store' });
      const data = await res.json();
      setAllComment(Array.isArray(data) ? data : []);
    })();
  }, []);

  async function onSubmit(e) {
    e.preventDefault();

    // 폼 요소를 먼저 캡처
    const form = e.currentTarget; // or formRef.current
    if (!(form instanceof HTMLFormElement)) return;

    const f = new FormData(form);
    const nicName = f.get('nicName');
    const message = f.get('message');

    await fetch('/api/comment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nicName, message }),
    });

    // 이벤트 객체를 다시 참조하지 말고, 캡처해둔 form으로 reset
    form.reset();

    const res = await fetch('/api/comment', { cache: 'no-store' });
    const data = await res.json();
    setAllComment(Array.isArray(data) ? data : []);
  }

  return (
    <main className="GuestBook">
      <form ref={formRef} onSubmit={onSubmit}>
        <input name="nicName" placeholder="닉네임" required />
        <input name="message" placeholder="메시지" required />
        <button type="submit">남기기</button>
      </form>

      <div className="commentList">
        {allComment.length === 0 ? (
          <div>아직 댓글이 없어요.</div>
        ) : (
          allComment.map((co) => (
            <CommentCard
              key={co.id}
              nicName={co.nicName}
              message={co.message}
              createdAt={co.createdAt}
            />
          ))
        )}
      </div>
    </main>
  );
}

function CommentCard({ nicName, message, createdAt }) {
  return (
    <div className="card">
      <strong>{nicName}</strong>
      <p>{message}</p>
      <small>
        {createdAt
          ? new Date(
              createdAt?.seconds ? createdAt.seconds * 1000 : createdAt
            ).toLocaleString()
          : ''}
      </small>
    </div>
  );
}
