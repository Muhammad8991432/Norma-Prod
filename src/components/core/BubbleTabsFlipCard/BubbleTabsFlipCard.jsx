import React, { forwardRef } from 'react';
import './BubbleTabsFlipCard.scss';
import { useA11y } from '@context/Utils/A11y';
import { Icons } from '@core/Utils/Icons/Icons';

/**
 * BubbleTabs component for FlipCard on dashboard to enable correct
 * behaviour as tabs in a tab list.
 * (based on BubbleTabs component (copy on 2025-07-02) and refactored)
 */
export const BubbleTabsFlipCard = forwardRef(
  (
    {
      isActive = false, // whether the tab is active and whether to show the bubble
      bubbleColor,
      bubbleIcon,
      tapIcon,
      showIcons,
      index, // navigation tab index
      text,
      role,
      tabIndex,
      onClick,
      onKeyDown,
      ariaLabel,
      contrastClass='',
      ...props
    },
    tabRef
  ) => {
    const { tA11yTranslate } = useA11y();

    let justifyContent;
    if (index === 0) {
      justifyContent = 'start';
    } else if (index === 2) {
      justifyContent = 'end';
    } else {
      justifyContent = 'center';
    }

    const bubbleBodyStyles = isActive ? { backgroundColor: bubbleColor } : {};
    const bubbleTipStyles = isActive ? { borderColor: `${bubbleColor} transparent` } : {};

    return (
      // <div className={`${isActive ? 'position-absolute' : ''}`}>
        <div className={`${isActive ? 'bubble-tab position-absolute' : ''}`}>
          <div className={`${isActive ? 'bubble' : ''}`} style={bubbleBodyStyles}>
            {/* eslint-disable-next-line jsx-a11y/no-static-element-interactions */}
            <span
              ref={tabRef}
              className={ isActive
                ? `d-flex align-items-center justify-content-center ${contrastClass}`
                : 'd-flex align-items-center nc-underline justify-content-center'
              }
              // for usage in NavigationTab // setting focus around icon+text
              role={role}
              tabIndex={tabIndex}
              onClick={onClick}
              onKeyDown={onKeyDown}
              aria-label={ariaLabel}
              {...props}
            >
              {isActive && bubbleIcon &&(
                <span className="pe-2 bubble-icon">
                  <Icons name={bubbleIcon} width={20} />
                </span>
              )}
              {isActive && (
                <span className="nc-doomsday-copy text-white m-0">{text}</span>
              )}
              {!isActive && showIcons && tapIcon && (
                <div className="me-1">
                  <Icons name={tapIcon} colorType="dark" />
                </div>
              )}
              {!isActive && (
                <div>
                  <p className="p-0 m-0 nc-doomsday-copy text-gray-100">
                    {tA11yTranslate(text).content}
                  </p>
                </div>
              )}
            </span>
            {isActive && (
              <div
                className={`bubble-tip bubble-tip${'-right'}`}
                style={bubbleTipStyles}
              />
            )}
          </div>
        </div>
      // </div>
    );
  }
);

// this line was needed to avoid eslint error "display name is missing"
BubbleTabsFlipCard.displayName = 'BubbleTabsFlipCard';

export default BubbleTabsFlipCard;
