import React, { useRef, useState, useEffect } from 'react';

export default function SignatureCanvas({ onSignatureChange, width = '100%', height = 200, disabled = false }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * 2;
    canvas.height = rect.height * 2;
    ctx.scale(2, 2);
    ctx.strokeStyle = '#111827';
    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
  }, []);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches ? e.touches[0] : e;
    return { x: touch.clientX - rect.left, y: touch.clientY - rect.top };
  };

  const startDraw = (e) => {
    if (disabled) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing || disabled) return;
    e.preventDefault();
    const ctx = canvasRef.current.getContext('2d');
    const pos = getPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const endDraw = () => {
    if (isDrawing) {
      setIsDrawing(false);
      setHasSignature(true);
      if (onSignatureChange) {
        onSignatureChange(canvasRef.current.toDataURL('image/png'));
      }
    }
  };

  const clear = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    if (onSignatureChange) onSignatureChange(null);
  };

  return (
    <div>
      <div style={{
        position: 'relative', width, height,
        border: '1.5px dashed #D1D5DB', borderRadius: 12,
        overflow: 'hidden', background: disabled ? '#F3F4F6' : '#FAFAFA',
        touchAction: 'none', opacity: disabled ? 0.6 : 1,
      }}>
        <canvas
          ref={canvasRef}
          style={{ width: '100%', height: '100%', cursor: disabled ? 'default' : 'crosshair' }}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={endDraw}
        />
        {!hasSignature && !disabled && (
          <div style={{
            position: 'absolute', top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            color: '#9CA3AF', fontSize: 13, fontWeight: 600,
            pointerEvents: 'none', textAlign: 'center',
          }}>
            วาดลายเซ็นที่นี่<br />Sign here
          </div>
        )}
      </div>
      {hasSignature && !disabled && (
        <button
          onClick={clear}
          style={{
            marginTop: 8, fontSize: 11, color: '#6B7280',
            background: 'none', border: 'none', cursor: 'pointer',
            textDecoration: 'underline',
          }}
        >
          ล้างลายเซ็น / Clear
        </button>
      )}
    </div>
  );
}
