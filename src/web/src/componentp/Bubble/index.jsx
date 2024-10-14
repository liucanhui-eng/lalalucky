import React, { useState, useRef } from 'react';
import { useFloating, shift, arrow, offset } from '@floating-ui/react';
import './index.scss';

const Bubble = ({ content, children, position = 'bottom' }) => {
    const [isVisible, setIsVisible] = useState(false);
    const referenceRef = useRef(null);
    const { x, y, strategy, refs } = useFloating({
      placement: position,
      middleware: [
        offset(10), // 气泡与触发元素之间的间距
        shift(),    // 确保气泡在视口内
        arrow({ element: refs.arrow }), // 箭头的定位
      ],
    });
  
    const toggleVisibility = () => setIsVisible((prev) => !prev);
  
    return (
      <div className="bubble-wrapper" ref={referenceRef}>
        <div onClick={toggleVisibility} ref={refs.setReference}>
          {children}
        </div>
        {isVisible && (
          <>
            <div className="bubble-overlay" onClick={toggleVisibility} />
            <div
              className="bubble-content"
              style={{ position: strategy, top: y ?? 0, left: x ?? 0 }}
              ref={refs.setFloating}
            >
              {content}
              <div className="bubble-arrow" ref={refs.arrow} />
            </div>
          </>
        )}
      </div>
    );
  };
  
  export default Bubble;
