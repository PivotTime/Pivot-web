
'use client';
import ShapeRenderer from './ShapeRenderer';

export default function StaticAnimation({ objects, customObjects }) {
  if (!objects || objects.length === 0) {
    return <div className="static-animation-container" style={{ color: 'white' }}>애니메이션 데이터가 없습니다.</div>;
  }

  return (
    <div className="static-animation-container">
      {objects.map((obj, index) => {
        const customShapes =
          obj.type === 'custom'
            ? customObjects.find((co) => co.id === obj.customObjectId)?.shapes
            : null;

        return (
          <div
            key={index}
            style={{
              position: 'absolute',
              left: `${obj.left}px`,
              top: `${obj.top}px`,
              transform: obj.transform,
              opacity: obj.opacity,
            }}
          >
            <ShapeRenderer
              type={obj.type}
              customShapes={customShapes}
              width={240} 
              height={240}
            />
          </div>
        );
      })}
    </div>
  );
}
