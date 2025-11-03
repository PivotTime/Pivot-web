'use client';
import { useState } from 'react';
import PlaybackAnimation from '../../../components/PlaybackAnimation';

export default function ArchiveCard({ submission, customObjects }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <div 
      className="archive-card"
    >
      <PlaybackAnimation
          trajectories={submission.trajectories}
          arrangement="orbit" // Assuming orbit is the default/desired arrangement for playback
          customObjects={customObjects}
      />
      <div 
        className="info-overlay"
        onMouseEnter={() => setShowInfo(true)}
        onMouseLeave={() => setShowInfo(false)}
        style={{ opacity: showInfo ? 1 : 0 }}
      >
        <h3 className="card-title">{submission.name}'s PIVOT</h3>
        <p className="card-tag"># {submission.tags.join(' ')}</p>
        <p className="card-date">
          저장된 시각:{' '}
          {submission.createdAt
            ? new Date(submission.createdAt).toLocaleString()
            : '알 수 없음'}
        </p>
      </div>
    </div>
  );
}
