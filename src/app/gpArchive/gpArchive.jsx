
'use client';
import { useState, useEffect } from 'react';
import '../../../styles/gpArchive.scss';
import Link from 'next/link';
import ArchiveCard from './ArchiveCard';

export default function ArchiveClient({ submissions, error }) {
  const [customObjects, setCustomObjects] = useState([]);
  const [loadingCustomObjects, setLoadingCustomObjects] = useState(true);

  useEffect(() => {
    const fetchCustomObjects = async () => {
      try {
        setLoadingCustomObjects(true);
        const response = await fetch("/api/get_custom_objects");
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        setCustomObjects(data);
      } catch (error) {
        console.error("Error fetching custom objects:", error);
      } finally {
        setLoadingCustomObjects(false);
      }
    };
    fetchCustomObjects();
  }, []);

  if (error) {
    return (
      <div className="archive-page">
        <h1>궤적 아카이브</h1>
        <p className="err">데이터를 불러오는 중 오류가 발생했습니다: {error}</p>
        <Link href="/goPivot" className="link">돌아가기</Link>
      </div>
    );
  }

  if (!submissions || submissions.length === 0) {
    return (
      <div className="archive-page">
        <h1>궤적 아카이브</h1>
        <p>저장된 궤적이 없습니다.</p>
        <Link href="/goPivot" className="link">만들러 가기</Link>
      </div>
    );
  }

  const half = Math.ceil(submissions.length / 2);
  const upperRowSubmissions = submissions.slice(0, half);
  const lowerRowSubmissions = submissions.slice(half);

  return (
    <div className="archive-page">
      <div className="archive-gallery-container"> {/* New container for two rows */}
        <div className="archive-gallery-row upper-row">
          {loadingCustomObjects ? <p>로딩중...</p> :
            upperRowSubmissions.map((submission) => (
              <ArchiveCard
                key={submission.id}
                submission={submission}
                customObjects={customObjects}
              />
            ))
          }
        </div>
        <div className="archive-gallery-row lower-row">
          {loadingCustomObjects ? <p>로딩중...</p> :
            lowerRowSubmissions.map((submission) => (
              <ArchiveCard
                key={submission.id}
                submission={submission}
                customObjects={customObjects}
              />
            ))
          }
        </div>
      </div>
    </div>
  );
}

