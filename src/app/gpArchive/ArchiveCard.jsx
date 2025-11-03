'use client';
import { useState, useEffect, memo } from 'react';
import PlaybackAnimation from '../../../components/PlaybackAnimation';


export default memo(function ArchiveCard({ submission, customObjects, onHover, onLeave }) { // Accept onHover, onLeave
  const [translateY, setTranslateY] = useState(0); // State for random translateY

  useEffect(() => {
    // Generate a random translateY value between -50 and 50
    const randomY = Math.floor(Math.random() * 101) - 50; // -50 to 50
    setTranslateY(randomY);
  }, []); // Run once on mount

  const handleMouseEnter = (event) => {
    const infoData = {
      name: submission.name,
      tags: submission.tags,
      createdAt: submission.createdAt
        ? new Date(submission.createdAt).toLocaleString()
        : '알 수 없음',
    };
    onHover(infoData, event.clientX, event.clientY);
  };

  const handleMouseLeave = () => {
    onLeave();
  };

  return (
    <div 
      className="archive-card"
      style={{ transform: `translateY(${translateY}px)` }} // Apply inline style
      onMouseEnter={handleMouseEnter} // Call local handler
      onMouseLeave={handleMouseLeave} // Call local handler
    >
      <PlaybackAnimation
          trajectories={submission.trajectories}
          arrangement="orbit" // Assuming orbit is the default/desired arrangement for playback
          customObjects={customObjects}
      />
      
    </div>
  );
}
)