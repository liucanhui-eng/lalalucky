import React, { useState, useRef } from 'react';
import { useFloating, offset, flip, shift } from '@floating-ui/react-dom';

const Popup = ({ content, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { x, y, reference, floating, strategy } = useFloating({
    middleware: [offset(10), flip(), shift()],
    placement: 'bottom',
  });

  return (
    <div>
      {/* Trigger Element */}
      <div
        ref={reference}
        onClick={() => setIsOpen(!isOpen)}
        style={{ display: 'inline-block', cursor: 'pointer' }}
      >
        {children}
      </div>

      {/* Popup Element */}
      {isOpen && (
        <div
          ref={floating}
          style={{
            position: strategy,
            top: y ?? 0,
            left: x ?? 0,
            backgroundColor: '#fff',
            boxShadow: '0px 4px 12px rgba(0,0,0,0.1)',
            padding: '8px',
            borderRadius: '4px',
            zIndex: 1000,
          }}
        >
          {content}
        </div>
      )}
    </div>
  );
};

export default Popup;
