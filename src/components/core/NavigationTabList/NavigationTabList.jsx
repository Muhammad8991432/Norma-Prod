import React, { useState, useRef } from 'react';
import { useA11y } from '@context/Utils/A11y';
import { BubbleTabsFlipCard } from '@core/index';
import { appKeyCode } from '@utils/globalConstant';
import '../NavigationTabs/NavigationTab.scss';

// Implementation is based on this APG pattern: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/examples/tabs-automatic/
export const NavigationTabList = ({
  tabs,
  defaultActive = 1,
  bubbleColor,
  onChange,
  switchTabs,
  controlIdPrefix,
  showIcons = false
}) => {
  const tabRefs = useRef([]);

  const [active, setActive] = useState(defaultActive);

  const { tA11yTranslate } = useA11y();

  const handleClick = (index) => {
    setActive(index);
    tabRefs.current[index].focus();
    if (onChange) {
      onChange(index);
    }
  };

  const renderTab = (tab, index) => {
    const justifyContent = index === 0 ? 'start' : index === tabs.length - 1 ? 'end' : 'center';

    const isActive = active === index;

    const handleKeyDown = (event, tabIndex) => {
      let newIndex = -9;
      const { keyCode } = event;

      if (keyCode === appKeyCode.ARROW_LEFT) {
        newIndex = tabIndex - 1;
        newIndex = newIndex < 0 ? tabs.length - 1 : newIndex; // Wrap around to last tab
      }
      if (keyCode === appKeyCode.ARROW_RIGHT) {
        newIndex = tabIndex + 1;
        newIndex = newIndex >= tabs.length ? 0 : newIndex; // Wrap around to first tab
      }
      if (keyCode === appKeyCode.HOME) {
        newIndex = 0;
      }
      if (keyCode === appKeyCode.END) {
        newIndex = tabs.length - 1;
      }

      if (newIndex !== -9) {
        event.preventDefault();
        // handleClick(newIndex);
        setActive(newIndex);
        tabRefs.current[newIndex].focus();
        if (switchTabs) {
          switchTabs(newIndex);
        }
      }
    };

    return (
      <div
        key={index}
        className={`col-${12 / tabs.length} p-0 align-self-center justify-self-${justifyContent}`}
      >
        <div
          className={`d-flex align-items-center justify-content-${justifyContent} ${
            isActive ? 'animate__animated animate__flipInY' : 'px-4 px-md-5 py-1'
          }`}
          style={ isActive ? { scale: 1.25 } : {} }
        >
          {/* The former implementation used BubbleTabs component for active tab and span elements
          for non-active tabs, which caused issues with focus management and accessibility.
          The problem was that on change of the tabs the focus was lost and went to the body
          element, which was not expected. This caused issues with screen readers which read
          the page title (followed by a 'document' suffix).
          The reason for this was that the active tab was remounted as a new element.
          That is why we implemented the BubbleTabsFlipCard component for all tabs regardless of
          the activity state. We only change their props and classes based on active state. */}
          <BubbleTabsFlipCard
            ref={el => tabRefs.current[index] = el} 
            isActive={isActive}
            text={tA11yTranslate(tab.text).content}
            ariaLabel={tA11yTranslate(tab.text).ariaLabel}
            bubbleColor={bubbleColor}
            bubbleIcon={tab.bubbleIcon}
            tapIcon={tab.icon}
            showIcons={showIcons}
            index={index}
            tabIndex={isActive ? '0' : '-1'}
            role="tab"
            id={`tab-${index}`}
            aria-selected={isActive}
            aria-controls={`${controlIdPrefix}${index}`}
            onClick={() => handleClick(index)}
            onKeyDown={(event) => handleKeyDown(event, index)}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="px-3">
      <div className="row bg-gray-10 py-1 rounded-pill" role="tablist">
        {tabs.map((tab, index) => renderTab(tab, index))}
      </div>
    </div>
  );
};

export default NavigationTabList;
