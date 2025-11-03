
'use client';
import { useState, useEffect, useRef, useCallback } from 'react'; // Add useCallback
import '../../../styles/gpArchive.scss';
import Link from 'next/link';
import ArchiveCard from './ArchiveCard';
import {GpArchiveInfoBox} from './GpArchiveInfoBox'; // New import
import InfoBox from '../../../components/infoBox';

export default function ArchiveClient({ submissions: initialSubmissions, error, initialLastDocId, initialHasMore }) { // Accept new props
  const [customObjects, setCustomObjects] = useState([]);
  const [loadingCustomObjects, setLoadingCustomObjects] = useState(true);
  const galleryRowRef = useRef(null);

  const [submissions, setSubmissions] = useState(initialSubmissions); // Manage submissions state
  const [lastDocId, setLastDocId] = useState(initialLastDocId); // Manage lastDocId state
  const [hasMore, setHasMore] = useState(initialHasMore); // Manage hasMore state
  const [loadingMore, setLoadingMore] = useState(false); // Loading state for more submissions

  const [showInfoBox, setShowInfoBox] = useState(false);
  const [infoBoxData, setInfoBoxData] = useState(null);

  // New functions for info box
  const handleCardHover = useCallback((data) => {
    setInfoBoxData({ name: data.name, tag: data.tags ? data.tags.map(t => `#${t}`).join(' ') : '' }); // data에서 name과 tags 추출 및 포맷팅
    setShowInfoBox(true);
  }, []);

  const handleCardLeave = useCallback(() => {
    setShowInfoBox(false);
    setInfoBoxData(null);
  }, []);

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

  const handleWheelScroll = (event) => {
    if (galleryRowRef.current) {
      event.preventDefault();
      galleryRowRef.current.scrollLeft += event.deltaY;
    }
  };

  const loadMoreSubmissions = useCallback(async () => {
    if (loadingMore || !hasMore) return; // Prevent multiple fetches or if no more items

    setLoadingMore(true);
    try {
      const response = await fetch(`/api/get_submissions?limit=5&${lastDocId ? `lastDocId=${lastDocId}` : ''}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      setSubmissions((prevSubmissions) => [...prevSubmissions, ...data.submissions]);
      setLastDocId(data.lastDocId);
      setHasMore(data.hasMore);
    } catch (error) {
      console.error("Error fetching more submissions:", error);
    } finally {
      setLoadingMore(false);
    }
  }, [loadingMore, hasMore, lastDocId]);

  useEffect(() => {
    const galleryElement = galleryRowRef.current;
    if (!galleryElement) return;

    const handleScroll = () => {
      // Check if scrolled to the end (or near the end)
      if (galleryElement.scrollWidth - galleryElement.scrollLeft <= galleryElement.clientWidth + 200) { // 200px buffer
        loadMoreSubmissions();
      }
    };

    galleryElement.addEventListener('scroll', handleScroll);
    return () => galleryElement.removeEventListener('scroll', handleScroll);
  }, [loadMoreSubmissions]);


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
              onHover={handleCardHover} // New prop
              onLeave={handleCardLeave} // New prop
            />
          ))
        }
        {loadingMore && <p>더 많은 궤적을 불러오는 중...</p>} {/* Loading indicator */}
        {!hasMore && submissions.length > 0 && <p>모든 궤적을 불러왔습니다.</p>} {/* End of content indicator */}
      </div>
      {showInfoBox && infoBoxData && ( // Render GpArchiveInfoBox
        <GpArchiveInfoBox
          data={infoBoxData}
        />
      )}

      <InfoBox/>
    </div>
  );

}