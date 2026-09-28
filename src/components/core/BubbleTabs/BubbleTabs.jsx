import React, { useEffect, useRef } from 'react';
import './BubbleTabs.scss';
import { Icons } from '@core/Utils/Icons/Icons';

export function BubbleTabs({
  bubbleColor,
  bubbleIcon,
  index, // navigation tab index
  text,
  role,
  tabIndex,
  onClick,
  onKeyDown,
  ariaLabel,
  contrastClass='',
  focusAfterTabChange = false,
  ...props
}) {
  const tabRef = useRef(null);
  const isFirstRender = useRef(true);

  useEffect(() => {
    if (focusAfterTabChange) {
      if (isFirstRender.current) {
        isFirstRender.current = false; // Skip focus on first render
      } else if (tabRef.current) {
        tabRef.current.focus();
      }
    }
  }); // No dependency array: runs after every render

  let justifyContent;
  if (index === 0) {
    justifyContent = 'start';
  } else if (index === 2) {
    justifyContent = 'end';
  } else {
    justifyContent = 'center';
  }

  const bubbleBodyStyles = { backgroundColor: bubbleColor };
  const bubbleTipStyles = { borderColor: `${bubbleColor} transparent` };

  return (
    <div className="bubble-tab">
      <div className="bubble" style={bubbleBodyStyles}>
        <span
          ref={tabRef}
          className={`d-flex align-items-center justify-content-center ${contrastClass}`}        
          // for usage in NavigationTab // setting focus around icon+text
          role={role}
          tabIndex={tabIndex}
          onClick={onClick}
          onKeyDown={onKeyDown}
          aria-label={ariaLabel}
          {...props}
        >
          {bubbleIcon && (
            <span className="pe-2 bubble-icon">
              <Icons name={bubbleIcon} width={20} />
            </span>
          )}
          <span className="nc-doomsday-copy text-white m-0">{text}</span>
        </span>

        <div
          className={`bubble-tip bubble-tip${'-right'}`}
          style={bubbleTipStyles}></div>
      </div>
    </div>
  );
}

export default BubbleTabs;
