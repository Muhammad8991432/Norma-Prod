import React from 'react';
import { BackgroundBlur } from '@core/BackgroundBlur';
import { PopupCampaignSliderAccessible } from '@part/PopupCampaignSliderAccessible';
import { PopupCampaignCard } from '@core/PopupCampaignCard';
import { AppPageContentWrapper } from '@part/AppPageContentWrapper';

// Only for use in combination with PopupCampaignSliderAccessible and PopupCampaignCard, not for single use
export function PopupCampaign({ 
  data = [],
  hidePopup = () => {},
  sliderContent = null, // contains aria label for slider
  slideContent = null // contains aria label for selected slide
}) {
  // State
  const [popupData, setPopupData] = React.useState(data);

  // Functions
  const handleUpdateData = (newData) => {
    setPopupData([...newData]);
  };

  return (
    <BackgroundBlur>
      <AppPageContentWrapper isCenterPageContent>
        {popupData.length === 1 && (
          <div className="d-flex justify-content-center align-items-center">
            <PopupCampaignCard
              data={popupData[0]}
              onCardClose={hidePopup}
              isActive
              firstHeadlineIdSuffix="first-headline-0"
              lastSliderCardAriaLabel={slideContent || undefined}
              isLastPopupCampaignCardInSlider
            />
          </div>
        )}
        {popupData.length > 1 && (
          <PopupCampaignSliderAccessible
            slidesData={popupData}
            updateSlidesData={handleUpdateData}
            hidePopup={hidePopup}
            sliderContent={sliderContent}
            slideContent={slideContent}
            idPrefix="dashboard-popup-slider"
          />
        )}
      </AppPageContentWrapper>
    </BackgroundBlur>
  );
}

export default PopupCampaign;
