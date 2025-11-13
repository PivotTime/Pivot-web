'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import '../../../styles/gpArchive.scss';
import Link from 'next/link';
import ArchiveCard from './ArchiveCard';
import { GpArchiveInfoBox } from './GpArchiveInfoBox';
import InfoBox from '../../../components/infoBox';


export default function ArchiveClient() {
  const [customObjects, setCustomObjects] = useState([]);
  const [loadingCustomObjects, setLoadingCustomObjects] = useState(true);
  const galleryRowRef = useRef(null);

  const [submissions, setSubmissions] = useState([]);
  const [lastDoc, setLastDoc] = useState(null); // 페이지네이션을 위해 마지막 문서를 저장
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [infoBoxData, setInfoBoxData] = useState(null);

  const handleCardHover = useCallback((data) => {
    setInfoBoxData({ name: data.name, tag: data.tags ? data.tags.map(t => `#${t}`).join(' ') : '' });
    setShowInfoBox(true);
  }, []);

  const handleCardLeave = useCallback(() => {
    setShowInfoBox(false);
    setInfoBoxData(null);
  }, []);

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Fetch initial submissions from API
        const subResponse = await fetch('/api/get_submissions?limit=5');
        if (!subResponse.ok) {
          throw new Error(`HTTP error! status: ${subResponse.status}`);
        }
        const subData = await subResponse.json();
        setSubmissions(subData.submissions);
        setLastDoc(subData.lastDocId);
        setHasMore(subData.hasMore);

        // Fetch custom objects from API
        setLoadingCustomObjects(true);
        const customObjResponse = await fetch('/api/get_custom_objects');
        if (!customObjResponse.ok) {
          throw new Error(`HTTP error! status: ${customObjResponse.status}`);
        }
        const customObjData = await customObjResponse.json();
        setCustomObjects(customObjData);

      } catch (err) {
        console.error("Error fetching initial data from API:", err);
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingCustomObjects(false);
      }
    };
    fetchInitialData();
  }, []);

  const handleWheelScroll = (event) => {
    if (galleryRowRef.current) {
      event.preventDefault();
      galleryRowRef.current.scrollLeft += event.deltaY;
    }
  };

  const loadMoreSubmissions = useCallback(async () => {
    if (loadingMore || !hasMore || !lastDoc) return;

    setLoadingMore(true);
    try {
      const moreSubResponse = await fetch(`/api/get_submissions?limit=5&lastDocId=${lastDoc}`);
      if (!moreSubResponse.ok) {
        throw new Error(`HTTP error! status: ${moreSubResponse.status}`);
      }
      const moreSubData = await moreSubResponse.json();

      setSubmissions((prev) => [...prev, ...moreSubData.submissions]);
      setLastDoc(moreSubData.lastDocId);
      setHasMore(moreSubData.hasMore);
    } catch (err) {
      console.error("Error fetching more submissions from API:", err);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastDoc]);

  useEffect(() => {
    const galleryElement = galleryRowRef.current;
    if (!galleryElement || loading) return;

    const handleScroll = () => {
      if (galleryElement.scrollWidth - galleryElement.scrollLeft <= galleryElement.clientWidth + 200) {
        loadMoreSubmissions();
      }
    };

    galleryElement.addEventListener('scroll', handleScroll);
    return () => galleryElement.removeEventListener('scroll', handleScroll);
  }, [loadMoreSubmissions, loading]);

  if (loading) {
    return (
      <div className="archive-page">
        <h1>궤적 아카이브</h1>
        <p>궤적을 불러오는 중...</p>
      </div>
    );
  }

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

  return (
    <div className="archive-page">
      <div
        className="archive-gallery-row"
        ref={galleryRowRef}
        onWheel={handleWheelScroll}
      >
        {loadingCustomObjects ? <p>로딩중...</p> :
          submissions.map((submission) => (
            <ArchiveCard
              key={submission.id}
              submission={submission}
              customObjects={customObjects}
              onHover={handleCardHover}
              onLeave={handleCardLeave}
            />
          ))
        }
        {loadingMore && <p>더 많은 궤적을 불러오는 중...</p>}
        {!hasMore && submissions.length > 0 && <p>모든 궤적을 불러왔습니다.</p>}
      </div>
      {showInfoBox && infoBoxData && (
        <GpArchiveInfoBox
          data={infoBoxData}
        />
      )}

      <InfoBox/>
    </div>
  );
}