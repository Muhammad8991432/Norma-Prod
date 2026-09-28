import React, { useState } from 'react';
import { useA11y } from '@context/Utils/A11y';
import { BubbleTabs } from '@core/index';
import { Icons } from '@core/Utils/Icons/Icons';
import './NavigationTab.scss';
export const NavigationTabs = ({
  tabs,
  defaultActive = 0,
  bubbleColor,
  onChange,
  showIcons = false
}) => {
  const [active, setActive] = useState(defaultActive);

  const { tA11yTranslate } = useA11y();

  const handleClick = (index) => {
    setActive(index);
    if (onChange) {
      onChange(index);
    }
  };

  const renderTab = (tab, index) => {
    const justifyContent = index === 0 ? 'start' : index === tabs.length - 1 ? 'end' : 'center';

    const isActive = active === index;

    const handleKeyDown = (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        handleClick(index);
      }
    };

    return (
      <div
        key={index}
        className={`col-${12 / tabs.length} p-0 align-self-center justify-self-${justifyContent}`}
        role="navigation"
      >
        {/* <div> */}
          {isActive ? (
            <div
              className={`d-flex align-items-center justify-content-${justifyContent} animate__animated animate__flipInY`}
              style={{ scale: 1.25 }}
              aria-live="polite">
              <div className="position-absolute">
                <BubbleTabs
                  text={tA11yTranslate(tab.text).content}
                  ariaLabel={tA11yTranslate(tab.text).ariaLabel}
                  bubbleColor={bubbleColor}
                  index={index}
                  bubbleIcon={tab.bubbleIcon}
                  role="button"
                  onClick={() => handleClick(index)}
                  onKeyDown={handleKeyDown}
                />
              </div>
            </div>
          ) : (
            <div
              className={`d-flex align-items-center justify-content-${justifyContent} px-4 px-md-5 py-1`}>
              <span
                className="d-flex align-items-center justify-content-center"
                // setting focus around icon+text
                tabIndex="0"
                role="button"
                onKeyDown={handleKeyDown}
                onClick={() => handleClick(index)}
                aria-label={tA11yTranslate(tab.text).ariaLabel}>
                {showIcons && tab.icon && (
                  <div className="me-1">
                    <Icons name={tab.icon} colorType="dark" />
                  </div>
                )}
                <div>
                  <p className="p-0 m-0 nc-doomsday-copy nc-underline text-gray-100">
                    {tA11yTranslate(tab.text).content}
                  </p>
                </div>
              </span>
            </div>
          )}
        {/* </div> */}
      </div>
    );
  };

  return (
    <div className="px-3">
      <div className="row bg-gray-10 py-1 rounded-pill">
        {tabs.map((tab, index) => renderTab(tab, index))}
      </div>
    </div>
  );
};

export default NavigationTabs;
