
'use client';
import DrawingCanvas from '../components/makObject.jsx'; // Correct path to the component
import Link from 'next/link';

export default function MakeObjectPage() {
  return (
    <div style={styles.page}>
      <h1 style={styles.title}>나만의 오브젝트 만들기</h1>
      <p style={styles.subtitle}>캔버스에 도형을 그리고 Firestore에 저장하세요.</p>
      <Link href="/goPivot" style={styles.link}>궤적 만들러 가기</Link>
      <Link href="/gpArchive" style={styles.link}>궤적 아카이브 보기</Link>

      <DrawingCanvas />
    </div>
  );
}

const styles = {
  page: {
    width: '100vw',
    minHeight: '100vh',
    background: '#202225',
    color: '#ccc',
    padding: '24px',
    fontFamily: 'sans-serif',
  },
  title: {
    color: '#fff',
    borderBottom: '1px solid #444',
    paddingBottom: '16px',
    marginBottom: '8px',
  },
  subtitle: {
    color: '#aaa',
    marginBottom: '16px',
  },
  link: {
    color: '#9ef',
    textDecoration: 'none',
    display: 'inline-block',
    marginRight: '16px',
    marginBottom: '24px',
  },
};