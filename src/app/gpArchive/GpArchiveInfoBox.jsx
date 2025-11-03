'use client';
import React, { useState, useEffect, useRef } from 'react';

export function GpArchiveInfoBox({ data }){
    if (!data) return null; // 데이터가 없으면 렌더링하지 않음

    const { name, tag } = data;
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const animationFrameRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            animationFrameRef.current = requestAnimationFrame(() => {
                setMousePosition({ x: event.clientX, y: event.clientY });
            });
        };

        document.addEventListener('mousemove', handleMouseMove);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    return(
        <div
            className="gpArchiveInfoBox"
            style={{
                position: 'fixed', // 뷰포트 기준으로 위치 설정
                left: mousePosition.x + 10, // 마우스 x 좌표에 박스의 왼쪽 끝을 맞춤
                top: mousePosition.y -102, // 마우스 y 좌표에서 약간 아래로 이동
                transform: 'translateX(-100%)', // 박스 너비만큼 왼쪽으로 이동하여 오른쪽 끝을 마우스에 맞춤
                pointerEvents: 'none', // 마우스 이벤트 무시
                zIndex: 1000, // 다른 요소 위에 표시
            }}
        >
            <p>{name}</p>
            <svg width="233" height="78" viewBox="0 0 233 78" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g opacity="0.9">
            <circle cx="3.33333" cy="3.33333" r="3.33333" transform="matrix(1 0 0 -1 219.167 70.833)" fill="#E1E1E1"/>
            <circle cx="10" cy="10" r="9.5" transform="matrix(1 0 0 -1 212.5 77.5)" stroke="#E1E1E1"/>
            <path d="M222 67.5L155 0.500006L0 0.500183" stroke="#E1E1E1"/>
            </g>
            </svg>
            <p className='tagBox'>{tag}</p>
        </div>
    )
}