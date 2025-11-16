'use client';
import { useState, useEffect, memo } from 'react';
import PlaybackAnimation from '../../../components/PlaybackAnimation';


export default memo(function ArchiveCard({ submission, customObjects, onHover, onLeave, isNew }) {
  const [translateY, setTranslateY] = useState(0);
  const [isEntering, setIsEntering] = useState(isNew);

  useEffect(() => {
    // Generate a random translateY value between -50 and 50
    const randomY = Math.floor(Math.random() * 101) - 50; // -50 to 50
    setTranslateY(randomY);
  }, []); // Run once on mount

  useEffect(() => {
    if (isNew) {
      // It's a new card, start the animation sequence
      setIsEntering(true);
      const timer = setTimeout(() => {
        setIsEntering(false); // This will trigger the transition
      }, 100); // Short delay to ensure the element is in the DOM with the initial state
      return () => clearTimeout(timer);
    }
  }, [isNew]);

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

  const cardClass = `archive-card ${isEntering ? 'new-card-enter' : ''}`;

  return (
    <div 
      className={cardClass}
      style={{ '--translateY': `${translateY}px` }} // Use CSS custom property
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
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