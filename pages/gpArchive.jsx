'use client';
import { CanvasLine, CanvasCircle, CanvasSquare } from '../components/basicObject';
import Link from 'next/link';

// This is the main component for the page
export default function GpArchive({ submissions, error }) {
  if (error) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>궤적 아카이브</h1>
        <p style={{ color: 'red' }}>데이터를 불러오는 중 오류가 발생했습니다: {error}</p>
        <Link href="/goPivot" style={styles.link}>돌아가기</Link>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div style={styles.page}>
        <h1 style={styles.title}>궤적 아카이브</h1>
        <p>저장된 궤적이 없습니다.</p>
        <Link href="/goPivot" style={styles.link}>만들러 가기</Link>
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>궤적 아카이브</h1>
      <p style={styles.subtitle}>최근 5개의 궤적입니다.</p>
      <Link href="/goPivot" style={styles.link}>새 궤적 만들기</Link>
      
      <div style={styles.gallery}>
        {submissions.map(submission => (
          <div key={submission.id} style={styles.submissionCard}>
            <h3 style={styles.cardTitle}>
              ID: {submission.id}
            </h3>
            <p style={styles.cardDate}>
              저장된 시각: {new Date(submission.createdAt).toLocaleString()}
            </p>
            <div style={styles.canvas}>
              {submission.objects.map(obj => (
                <div
                  key={obj.key}
                  style={{
                    position: 'absolute',
                    left: `${obj.left}px`,
                    top: `${obj.top}px`,
                    transform: obj.transform,
                    opacity: obj.opacity,
                  }}
                >
                  {obj.type === 'line' && <CanvasLine width={160} height={60} />}
                  {obj.type === 'square' && <CanvasSquare width={120} height={120} />}
                  {obj.type === 'circle' && <CanvasCircle width={120} height={120} />}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// This function runs on the server before the page is rendered
export async function getServerSideProps() {
  const { db } = await import('../src/lib/firebase-admin.server.js');
  try {
    const submissionsRef = db.collection('pivot-submissions');
    const snapshot = await submissionsRef.orderBy('createdAt', 'desc').limit(5).get();

    if (snapshot.empty) {
      return {
        props: {
          submissions: [],
        },
      };
    }

    const submissions = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        // Convert Firestore Timestamp to a serializable format (ISO string)
        createdAt: data.createdAt.toDate().toISOString(),
        objects: data.objects,
      };
    });

    return {
      props: {
        submissions,
      },
    };
  } catch (error) {
    console.error('Error fetching from Firestore in getServerSideProps:', error);
    // Pass error to the page component
    return {
      props: {
        error: `서버에서 데이터를 가져오는 데 실패했습니다. Firebase 환경변수 및 권한을 확인해주세요. (${error.message})`,
      },
    };
  }
}

// Basic styling
const styles = {
  page: {
    width: '100%',
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
  },
  subtitle: {
    color: '#aaa',
    marginBottom: '16px',
  },
  link: {
    color: '#9ef',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '24px',
  },
  gallery: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  submissionCard: {
    border: '1px solid #444',
    borderRadius: '8px',
    padding: '16px',
    background: '#2c2f33',
  },
  cardTitle: {
    margin: '0 0 4px 0',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'normal',
  },
  cardDate: {
    margin: '0 0 16px 0',
    color: '#aaa',
    fontSize: '12px',
  },
  canvas: {
    position: 'relative',
    width: '100%',
    height: '1000px', // Adjust as needed
    background: '#202225',
    borderRadius: '4px',
    overflow: 'hidden',
    // We need to simulate the original canvas size for positioning to work
    // This assumes the original canvas was roughly viewport-sized.
    // A more robust solution might store the canvas dimensions with the submission.
  },
};